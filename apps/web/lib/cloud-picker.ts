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
