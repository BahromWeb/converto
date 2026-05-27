"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload, X, FileText, Plus } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming);
    const oversized = arr.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setError(`${oversized.name} is over ${maxSizeMB} MB. Sign in for the higher tier.`);
      return;
    }
    setError(null);
    onChange(multiple ? [...files, ...arr] : arr.slice(0, 1));
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
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
