const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

export type ApiResponse<T = unknown> = {
  StatusCode: number;
  Description: string;
  Data: T;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  if (isRefreshing) {
    return new Promise((resolve) => refreshQueue.push(resolve));
  }

  isRefreshing = true;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      clearTokens();
      refreshQueue.forEach((cb) => cb(null));
      refreshQueue = [];
      return null;
    }

    // /auth/refresh returns { access_token, refresh_token } directly (no wrapper)
    const json: TokenPair = await res.json();
    setTokens(json.access_token, json.refresh_token);
    refreshQueue.forEach((cb) => cb(json.access_token));
    refreshQueue = [];
    return json.access_token;
  } catch {
    clearTokens();
    refreshQueue.forEach((cb) => cb(null));
    refreshQueue = [];
    return null;
  } finally {
    isRefreshing = false;
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const { skipAuth, ...fetchInit } = init;

  const headers: Record<string, string> = {
    ...(fetchInit.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE}${path}`, { ...fetchInit, headers });

  // Attempt token refresh on 401 once
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...fetchInit, headers });
    }
  }

  return res.json();
}

// ─── Public API surface ───────────────────────────────────────────────────────

export const api = {
  // Wrapped endpoints: response shape is ApiResponse<T>
  get: <T>(path: string, opts?: RequestInit) =>
    apiFetch<ApiResponse<T>>(path, { ...opts, method: "GET" }),

  post: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    apiFetch<ApiResponse<T>>(path, {
      ...opts,
      method: "POST",
      headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    apiFetch<ApiResponse<T>>(path, {
      ...opts,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, opts?: RequestInit) =>
    apiFetch<ApiResponse<T>>(path, { ...opts, method: "DELETE" }),

  patch: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    apiFetch<ApiResponse<T>>(path, {
      ...opts,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  // Unwrapped endpoints: response is the payload itself (auth token endpoints)
  raw: {
    post: <T>(path: string, body?: unknown, opts?: RequestInit) =>
      apiFetch<T>(path, {
        ...opts,
        method: "POST",
        headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        skipAuth: true,
      } as RequestInit & { skipAuth?: boolean }),
  },
};

// ─── File + Job helpers (PDF tooling) ─────────────────────────────────────────

export type FileUploadResult = {
  id: string;
  dedup?: boolean;
};

/**
 * POST /file/upload via multipart. Auth optional — backend tiers caps at
 * 30 MB guest / 50 MB signed-in. Throws on validation/limit errors so
 * callers can surface them next to the dropzone.
 */
export async function uploadFile(file: File): Promise<FileUploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/file/upload`, {
    method: "POST",
    headers,
    body: fd,
  });
  const json: ApiResponse<FileUploadResult> = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof json.Data === "string" ? json.Data : `Upload failed (${res.status})`,
    );
  }
  return json.Data;
}

/** Browser-friendly download URL for an output file. */
export function fileDownloadUrl(fileId: string): string {
  return `${API_BASE}/file/${fileId}/download`;
}

/**
 * Force the browser to download a file with a chosen filename. Streams
 * through fetch so we can attach the Bearer header — direct <a href> would
 * skip auth on signed-in users' owned files.
 */
export async function downloadFile(fileId: string, filename = "result.pdf"): Promise<void> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(fileDownloadUrl(fileId), { headers });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── Generic job runner (POST → poll → done|failed) ─────────────────────────

export type JobStatus = "pending" | "processing" | "done" | "failed";

export interface JobRecord {
  id: string;
  status: JobStatus;
  output_file_id?: string | null;
  output_file_ids?: string[] | null;
  zip_file_id?: string | null;
  error?: string;
  [k: string]: unknown;
}

export interface RunJobOptions {
  /** Poll interval in ms. Default 1500. */
  intervalMs?: number;
  /** Give up after this many ms. Default 90_000. */
  timeoutMs?: number;
  /** Called on every status change so the UI can show pending/processing/done. */
  onStatus?: (status: JobStatus) => void;
}

/**
 * Standard async job flow:
 *   1. POST /api/pdf/<op> with body → returns { id }
 *   2. Poll GET /api/pdf/<op>/<id> until status flips to done | failed
 *   3. Resolve with the final job record (callers pluck output_file_id etc.)
 *
 * Throws on the underlying fetch error, validation failure, or `failed`
 * status — caller can show the message next to the form.
 */
export async function runJob<T extends JobRecord = JobRecord>(
  op: string,
  body: unknown,
  options: RunJobOptions = {},
): Promise<T> {
  const { intervalMs = 1500, timeoutMs = 90_000, onStatus } = options;

  const created = await api.post<JobRecord>(`/api/pdf/${op}`, body);
  if (created.StatusCode >= 400) {
    const data = created.Data as unknown;
    let detail = created.Description ?? "Job rejected";
    if (data && typeof data === "object" && "errors" in data) {
      const errs = (data as { errors: Record<string, string> }).errors;
      detail = Object.keys(errs)
        .map((k) => errs[k])
        .join("; ");
    }
    throw new Error(detail);
  }
  const jobId = (created.Data as JobRecord).id;
  onStatus?.((created.Data as JobRecord).status ?? "pending");

  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const polled = await api.get<JobRecord>(`/api/pdf/${op}/${jobId}`);
    const job = polled.Data as JobRecord;
    onStatus?.(job.status);
    if (job.status === "done") return job as T;
    if (job.status === "failed") {
      throw new Error(job.error || "Job failed");
    }
  }
  throw new Error("Job timed out");
}

/**
 * For the one PDF op that runs synchronously today: /api/pdf/inspect.
 * Returns the full job in a single round-trip — no polling.
 */
export async function runJobSync<T extends JobRecord = JobRecord>(
  op: string,
  body: unknown,
): Promise<T> {
  const res = await api.post<T>(`/api/pdf/${op}`, body);
  if (res.StatusCode >= 400) {
    throw new Error(res.Description ?? "Inspection failed");
  }
  return res.Data;
}

// ─── Cloud storage export ("Save to Dropbox / Drive / OneDrive") ────────────

export interface StorageProvider {
  name: "dropbox" | "gdrive" | "onedrive";
  display_name: string;
  /** True if the backend was launched with this provider's client ID/secret. */
  configured: boolean;
  /** True if the current user has finished the provider's OAuth flow. */
  connected: boolean;
}

export interface ExportResult {
  provider: string;
  path: string;
  size: number;
}

/** List every storage provider the backend offers, with per-user state. */
export async function getStorageProviders(): Promise<StorageProvider[]> {
  const res = await api.get<StorageProvider[]>("/api/storage/providers");
  return res.Data ?? [];
}

/**
 * Send the user to the provider's OAuth consent screen. The backend
 * redirects them back to /oauth/<provider>/callback once approved,
 * stores the token, and bounces them to /account/connections.
 */
export function connectStorageProviderUrl(provider: StorageProvider["name"]): string {
  // Backend AuthorizerMiddleware accepts ?token= as a fallback when the
  // Authorization header isn't available — needed here because the user
  // is about to be redirected away by window.location.href and browser
  // navigation can't set custom headers.
  const token = getAccessToken();
  const qs = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${API_BASE}/api/storage/${provider}/connect${qs}`;
}

/** Disconnect the user from a provider (revokes the stored token). */
export async function disconnectStorageProvider(
  provider: StorageProvider["name"],
): Promise<void> {
  await api.delete(`/api/storage/${provider}`);
}

/**
 * Push an already-generated output file to one of the user's connected
 * cloud providers. `path` is optional — backend writes to the provider's
 * root with an auto-generated name when omitted.
 */
export async function exportFileToCloud(
  fileId: string,
  provider: StorageProvider["name"],
  path?: string,
): Promise<ExportResult> {
  const res = await api.post<ExportResult>(`/file/${fileId}/export`, { provider, path });
  if (res.StatusCode >= 400) {
    throw new Error(res.Description ?? "Export failed");
  }
  return res.Data;
}

// ─── Public landing-page counters ───────────────────────────────────────────

export interface PublicCounts {
  total_users: number;
  total_files_uploaded: number;
  total_files_processed: number;
}

export async function getPublicStats(): Promise<PublicCounts> {
  const res = await api.get<PublicCounts>("/api/stats/public");
  return (
    res.Data ?? { total_users: 0, total_files_uploaded: 0, total_files_processed: 0 }
  );
}
