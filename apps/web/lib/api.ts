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
