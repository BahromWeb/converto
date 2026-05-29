"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { Upload, X, FileText, Plus, Cloud } from "lucide-react";
import {
  getPickerConfig,
  pickFromDropbox,
  pickFromGoogleDrive,
} from "@/lib/cloud-picker";

export interface FileDropzoneProps {
  /** Accept string for the underlying <input>. Defaults to PDFs only. */
  accept?: string;
  /** Allow more than one file at a time (merge / jpg-to-pdf flows). */
  multiple?: boolean;
  /** Soft cap shown in the helper text. Backend still enforces its own limit. */
  maxSizeMB?: number;
  /** Current files in the form's state. Dropzone is controlled. */
  files: File[];
  /** Called when the user adds / removes / replaces files. */
  onChange: (files: File[]) => void;
  /** Optional override for the prompt. */
  label?: string;
  /** Hide the file list (when caller renders a custom grid below). */
  hideFileList?: boolean;
}

/**
 * Drag-and-drop file picker. Shared by every tool — single-file forms
 * (compress, rotate, OCR) and multi-file ones (merge, jpg-to-pdf) just
 * toggle `multiple`. Validation runs against the soft cap in the UI so
 * the user gets a useful message before the backend rejects with 401.
 *
 * UX: when files are selected, the dropzone collapses into a compact
 * card list showing each file with an inline X (consistent with the
 * card-style tools — compress/watermark/merge etc.). Multi-file mode
 * adds a small "+ Add more" button next to the list.
 */
export function FileDropzone({
  accept = "application/pdf,.pdf",
  multiple = false,
  maxSizeMB = 30,
  files,
  onChange,
  label,
  hideFileList = false,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropboxOn, setDropboxOn] = useState(false);
  const [googleOn, setGoogleOn] = useState(false);
  const [cloudBusy, setCloudBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only render the cloud buttons when the server tells us their
  // public keys are configured — otherwise they'd be dead UI on
  // self-hosted deploys that didn't wire the envs.
  useEffect(() => {
    let alive = true;
    getPickerConfig()
      .then((cfg) => {
        if (!alive) return;
        setDropboxOn(Boolean(cfg.dropbox_app_key));
        setGoogleOn(Boolean(cfg.google_client_id));
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  // Consume a file the homepage Hero may have staged in sessionStorage.
  // Lets the user drop a file on the landing page, get routed to the
  // right tool, and have it auto-populate here instead of having to
  // re-select it. Runs once on mount.
  useEffect(() => {
    if (typeof window === "undefined" || files.length > 0) return;
    const raw = sessionStorage.getItem("pendingUpload");
    if (!raw) return;
    try {
      const staged = JSON.parse(raw) as {
        name: string;
        type: string;
        data: string;
        stagedAt: number;
      };
      // 60-second staleness window — don't surface ancient leftovers.
      if (Date.now() - staged.stagedAt > 60_000) {
        sessionStorage.removeItem("pendingUpload");
        return;
      }
      const byteString = atob(staged.data.split(",")[1] ?? "");
      const bytes = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
      const f = new File([bytes], staged.name, { type: staged.type });
      onChange([f]);
      sessionStorage.removeItem("pendingUpload");
    } catch {
      sessionStorage.removeItem("pendingUpload");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function addFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming);
    const oversized = arr.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setError(`${oversized.name} is over ${maxSizeMB} MB. Sign in for the higher tier.`);
      return;
    }
    // Catch obviously-broken files at the dropzone (a 0-byte stub, a
    // saved 404 page renamed to .pdf, an image picked into a docx slot)
    // so the user gets immediate feedback instead of having to wait for
    // the upload + worker round-trip.
    for (const f of arr) {
      const reason = await validateLocalFile(f);
      if (reason) {
        setError(`${f.name}: ${reason}`);
        return;
      }
    }
    setError(null);
    onChange(multiple ? [...files, ...arr] : arr.slice(0, 1));
  }

  /**
   * Reads the first few bytes of a freshly-picked file and checks the
   * signature matches the extension. Resolves to a human-readable error
   * reason, or null if the file looks OK. Mirrors the magic-byte sniffer
   * the API runs server-side so the UX stays consistent on both sides.
   */
  async function validateLocalFile(file: File): Promise<string | null> {
    if (file.size === 0) return "this file is empty (0 bytes)";
    if (file.size < 64) return "this file is suspiciously small — it may be a saved error page, not a real document";
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    let head: Uint8Array;
    try {
      head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
    } catch {
      return null; // browsers that fail the slice get a free pass
    }
    const startsWith = (sig: number[]) =>
      sig.every((b, i) => head[i] === b);
    const asciiAt = (start: number, str: string) =>
      str.split("").every((c, i) => head[start + i] === c.charCodeAt(0));
    switch (ext) {
      case "pdf":
        return asciiAt(0, "%PDF-")
          ? null
          : "this isn't a real PDF — it may be a saved error page or a 0-byte stub. Try a different file.";
      case "docx": case "xlsx": case "pptx":
      case "odt":  case "ods":  case "odp":
        return startsWith([0x50, 0x4b]) ? null : "this doesn't look like a real Office / OpenDocument file.";
      case "doc": case "xls": case "ppt":
        return startsWith([0xd0, 0xcf, 0x11, 0xe0])
          ? null
          : "this doesn't look like a real legacy Office file.";
      case "jpg": case "jpeg":
        return startsWith([0xff, 0xd8, 0xff]) ? null : "this doesn't look like a real JPEG.";
      case "png":
        return startsWith([0x89, 0x50, 0x4e, 0x47]) ? null : "this doesn't look like a real PNG.";
      case "gif":
        return startsWith([0x47, 0x49, 0x46]) ? null : "this doesn't look like a real GIF.";
      case "webp":
        return asciiAt(0, "RIFF") && asciiAt(8, "WEBP")
          ? null
          : "this doesn't look like a real WebP.";
      default:
        return null; // unknown extension — let the backend decide.
    }
  }

  /**
   * Open the Google Drive Picker. cloud-picker.ts already returns the
   * chosen file as a File (it downloads via the Drive API with the
   * user's OAuth token), so we just drop it into addFiles.
   */
  async function handleGoogleDrive() {
    setError(null);
    try {
      setCloudBusy(true);
      const file = await pickFromGoogleDrive();
      if (!file) return;
      addFiles([file]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't import from Google Drive");
    } finally {
      setCloudBusy(false);
    }
  }

  /**
   * Open the Dropbox Chooser, fetch the chosen file via its direct
   * link (Dropbox direct links are CORS-friendly), and feed the
   * resulting Blob through addFiles so the rest of the form treats it
   * like any other local pick.
   */
  async function handleDropbox() {
    setError(null);
    try {
      setCloudBusy(true);
      const picked = await pickFromDropbox({
        sizeLimit: maxSizeMB * 1024 * 1024,
      });
      if (!picked) return; // user cancelled
      const resp = await fetch(picked.link);
      if (!resp.ok) throw new Error(`Dropbox download failed (HTTP ${resp.status})`);
      const blob = await resp.blob();
      const file = new File([blob], picked.name, {
        type: blob.type || "application/octet-stream",
      });
      addFiles([file]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't import from Dropbox");
    } finally {
      setCloudBusy(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }

  function removeAt(i: number) {
    const next = files.slice();
    next.splice(i, 1);
    onChange(next);
  }

  const hasFiles = !hideFileList && files.length > 0;

  // Compact card view when files are selected — replaces the big dropzone
  // so the X button is visually prominent (matches the card-style tools).
  if (hasFiles) {
    return (
      <div className="space-y-3">
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-xl border bg-card px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-3">
                <FileText className="size-5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{f.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {(f.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="ml-3 flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${f.name}`}
                title="Remove file"
              >
                <X className="size-5" />
              </button>
            </li>
          ))}
        </ul>

        {multiple && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/10 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="size-4" />
            Add more files
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/40 hover:bg-primary/[0.02]"
        }`}
      >
        <Upload className="mb-3 size-8 text-muted-foreground" />
        <p className="text-base font-medium text-foreground">
          {label ?? (multiple ? "Drop files here" : "Drop a file here")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click to browse · up to {maxSizeMB} MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        {/* Cloud picker row — only renders providers the server has
            keys for. Click-bubbling is stopped so the cloud picker
            doesn't also re-open the local file dialog. */}
        {(dropboxOn || googleOn) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>or import from</span>
            {dropboxOn && (
              <button
                type="button"
                disabled={cloudBusy}
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDropbox();
                }}
                className="inline-flex items-center gap-1 rounded-md border bg-card px-2.5 py-1 font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                <Cloud className="size-3" />
                Dropbox
              </button>
            )}
            {googleOn && (
              <button
                type="button"
                disabled={cloudBusy}
                onClick={(e) => {
                  e.stopPropagation();
                  void handleGoogleDrive();
                }}
                className="inline-flex items-center gap-1 rounded-md border bg-card px-2.5 py-1 font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                <Cloud className="size-3" />
                Google Drive
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
