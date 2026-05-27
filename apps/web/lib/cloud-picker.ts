// lib/cloud-picker.ts
//
// Shared cloud-picker integration for Hero + every tool's FileDropzone.
// One module so the SDK only loads once and the config endpoint is hit
// at most once per page load.
//
// Dropbox Chooser: drop-in JS dialog, no per-user OAuth needed — the
// user signs in inside the dialog if they aren't already. Returns a
// short-lived direct download link the backend then fetches.
//
// Google Drive Picker arrives in the next sprint — same shape, needs
// the Google API key + OAuth scope `drive.file` from the existing
// Google sign-in flow. Stubbed here so wiring it later is mechanical.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

export interface CloudPickerConfig {
  dropbox_app_key?: string;
  google_api_key?: string;
  google_client_id?: string;
}

let configPromise: Promise<CloudPickerConfig> | null = null;

/** Fetch + memoise the public picker config. */
export function getPickerConfig(): Promise<CloudPickerConfig> {
  if (!configPromise) {
    configPromise = fetch(`${API_BASE}/api/cloud-picker/config`)
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
  }
  return configPromise;
}

// ─── Dropbox Chooser ─────────────────────────────────────────────────

declare global {
  interface Window {
    Dropbox?: {
      choose: (options: DropboxChooseOptions) => void;
      isBrowserSupported?: () => boolean;
    };
  }
}

interface DropboxFile {
  id: string;
  name: string;
  link: string;
  bytes: number;
  icon: string;
  thumbnailLink?: string;
  isDir: boolean;
}

interface DropboxChooseOptions {
  success: (files: DropboxFile[]) => void;
  cancel?: () => void;
  linkType?: "preview" | "direct";
  multiselect?: boolean;
  extensions?: string[];
  folderselect?: boolean;
  sizeLimit?: number; // bytes
}

let dropboxLoaderPromise: Promise<void> | null = null;

/**
 * Inject the Dropbox Chooser script (idempotent). The official approach
 * is a <script> tag with data-app-key — we generate that programmatically
 * once we know the key from the config endpoint.
 */
async function loadDropboxSDK(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Dropbox SDK is browser-only");
  }
  if (window.Dropbox?.choose) return;
  if (dropboxLoaderPromise) return dropboxLoaderPromise;

  const cfg = await getPickerConfig();
  if (!cfg.dropbox_app_key) {
    throw new Error("Dropbox not configured on this server");
  }

  dropboxLoaderPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "dropboxjs";
    script.src = "https://www.dropbox.com/static/api/2/dropins.js";
    script.dataset.appKey = cfg.dropbox_app_key!;
    script.async = true;
    script.onload = () => {
      // SDK exposes window.Dropbox on load.
      if (window.Dropbox?.choose) resolve();
      else reject(new Error("Dropbox SDK loaded but window.Dropbox is missing"));
    };
    script.onerror = () => reject(new Error("Failed to load Dropbox Chooser SDK"));
    document.head.appendChild(script);
  });

  return dropboxLoaderPromise;
}

/**
 * One-shot picker: open Dropbox, let the user pick a single file,
 * resolve with what they chose. Rejects on error / cancel-as-error;
 * resolves with `null` when the user cancels.
 */
export async function pickFromDropbox(opts?: {
  extensions?: string[];
  sizeLimit?: number;
}): Promise<DropboxFile | null> {
  await loadDropboxSDK();
  return new Promise((resolve, reject) => {
    window.Dropbox!.choose({
      success: (files) => resolve(files[0] ?? null),
      cancel: () => resolve(null),
      // `direct` returns a CDN URL the backend can GET without OAuth.
      // Token in URL is short-lived (~4h) which is fine for our flow.
      linkType: "direct",
      multiselect: false,
      extensions: opts?.extensions,
      sizeLimit: opts?.sizeLimit,
    });
  });
}

// ─── Google Drive Picker ─────────────────────────────────────────────

declare global {
  interface Window {
    gapi?: {
      load: (api: string, callback: () => void) => void;
    };
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: (overrideConfig?: { prompt?: string }) => void };
        };
      };
      picker?: {
        PickerBuilder: new () => GooglePickerBuilder;
        ViewId: { DOCS: string; DOCS_IMAGES: string; PDFS: string; FOLDERS: string };
        Action: { PICKED: string; CANCEL: string; LOADED: string };
        DocsView: new (viewId?: string) => GoogleDocsView;
      };
    };
  }
}

interface GoogleDocsView {
  setIncludeFolders: (b: boolean) => GoogleDocsView;
  setSelectFolderEnabled: (b: boolean) => GoogleDocsView;
  setMode: (m: string) => GoogleDocsView;
}

interface GooglePickerBuilder {
  addView: (view: GoogleDocsView | string) => GooglePickerBuilder;
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  setCallback: (cb: (data: GooglePickerResponse) => void) => GooglePickerBuilder;
  setAppId: (id: string) => GooglePickerBuilder;
  build: () => { setVisible: (v: boolean) => void };
}

export interface GooglePickerFile {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes?: number;
  url?: string;
}

interface GooglePickerResponse {
  action: string;
  docs?: Array<{
    id: string;
    name: string;
    mimeType: string;
    sizeBytes?: number;
    url?: string;
  }>;
}

let gapiLoaderPromise: Promise<void> | null = null;
let gisLoaderPromise: Promise<void> | null = null;
let cachedGoogleToken: { token: string; expiresAt: number } | null = null;

async function injectScript(src: string, id: string): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("browser-only");
  }
  if (document.getElementById(id)) return;
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function loadGapiPicker(): Promise<void> {
  if (gapiLoaderPromise) return gapiLoaderPromise;
  gapiLoaderPromise = injectScript("https://apis.google.com/js/api.js", "gapi-script").then(
    () =>
      new Promise<void>((resolve, reject) => {
        if (!window.gapi) {
          reject(new Error("gapi missing after script load"));
          return;
        }
        window.gapi.load("picker", () => resolve());
      }),
  );
  return gapiLoaderPromise;
}

async function loadGoogleIdentityServices(): Promise<void> {
  if (gisLoaderPromise) return gisLoaderPromise;
  gisLoaderPromise = injectScript("https://accounts.google.com/gsi/client", "gis-script");
  return gisLoaderPromise;
}

/**
 * Pop the Google sign-in consent dialog (or use a still-valid cached
 * token) and resolve with an access_token that has Drive read scope.
 */
async function getGoogleAccessToken(clientId: string): Promise<string> {
  if (cachedGoogleToken && cachedGoogleToken.expiresAt > Date.now() + 30_000) {
    return cachedGoogleToken.token;
  }
  await loadGoogleIdentityServices();
  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google Identity Services not available");
  }
  return new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts!.oauth2!.initTokenClient({
      client_id: clientId,
      // drive.file is the narrow scope: the app sees only the files the
      // user explicitly picks via the Picker, not their whole Drive.
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error || "Sign-in cancelled"));
          return;
        }
        // GIS tokens are short-lived (~1 hour). Cache so a second
        // Picker click in the same session doesn't re-prompt.
        cachedGoogleToken = {
          token: resp.access_token,
          expiresAt: Date.now() + 55 * 60 * 1000,
        };
        resolve(resp.access_token);
      },
    });
    client.requestAccessToken({ prompt: "" });
  });
}

/**
 * Open Google Drive Picker. Resolves with the chosen file (downloaded
 * as a Blob and wrapped in a File so callers can drop it straight into
 * the upload pipeline) or `null` if the user cancels.
 */
export async function pickFromGoogleDrive(): Promise<File | null> {
  const cfg = await getPickerConfig();
  if (!cfg.google_client_id) {
    throw new Error("Google Drive not configured on this server");
  }

  const token = await getGoogleAccessToken(cfg.google_client_id);
  await loadGapiPicker();
  if (!window.google?.picker) {
    throw new Error("Google Picker SDK missing");
  }

  return new Promise<File | null>((resolve, reject) => {
    const view = new window.google!.picker!.DocsView();
    view.setIncludeFolders(false);
    const builder = new window.google!.picker!.PickerBuilder()
      .addView(view)
      .setOAuthToken(token)
      .setCallback((data) => {
        if (data.action === window.google!.picker!.Action.CANCEL) {
          resolve(null);
          return;
        }
        if (data.action !== window.google!.picker!.Action.PICKED) return;
        const doc = data.docs?.[0];
        if (!doc) {
          resolve(null);
          return;
        }
        // Drive download endpoint — works with the same OAuth token
        // we already have. alt=media returns raw bytes.
        const downloadUrl = `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`;
        fetch(downloadUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(async (res) => {
            if (!res.ok) throw new Error(`Drive download HTTP ${res.status}`);
            const blob = await res.blob();
            resolve(
              new File([blob], doc.name, {
                type: doc.mimeType || blob.type || "application/octet-stream",
              }),
            );
          })
          .catch(reject);
      });
    // Optional setDeveloperKey skipped — Picker works without it for
    // user-authenticated flows, just with stricter quota. Wire up an
    // API key here if you hit "developer key not valid" in production.
    if (cfg.google_api_key) builder.setDeveloperKey(cfg.google_api_key);
    builder.build().setVisible(true);
  });
}

// ─── Backend import (provider-agnostic) ──────────────────────────────

/**
 * Hand a cloud URL off to the backend so it can download the file and
 * register it as a regular upload. Returns the new file_id, identical
 * in shape to uploadFile() in lib/api.ts so the rest of the pipeline
 * (session create, indexer, etc) doesn't care which source the file
 * came from.
 */
export async function importFromCloud(payload: {
  provider: "dropbox" | "gdrive" | "url";
  url: string;
  name?: string;
}): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/file/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      typeof json?.Description === "string"
        ? json.Description
        : typeof json?.error === "string"
          ? json.error
          : `HTTP ${res.status}`;
    throw new Error(detail);
  }
  // handleResponse wraps in { StatusCode, Description, Data }
  const data = (json?.Data ?? json) as { id: string };
  if (!data.id) throw new Error("import succeeded but no file_id returned");
  return data;
}
