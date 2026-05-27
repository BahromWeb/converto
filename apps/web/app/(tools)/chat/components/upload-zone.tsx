"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload, Loader2, FileText } from "lucide-react";

export function UploadZone({
  onFileSelected,
  busy = false,
  busyMessage = "Uploading…",
  accept = "application/pdf,.pdf",
  prompt = "Drop a PDF to chat with it",
  hint = "PDF documents only",
}: {
  onFileSelected: (file: File) => void;
  busy?: boolean;
  busyMessage?: string;
  /** MIME / extension filter passed straight to <input type="file"> */
  accept?: string;
  /** Big heading on the drop card. */
  prompt?: string;
  /** Small chip under the upload button. */
  hint?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick() {
    inputRef.current?.click();
  }

  function handleFiles(fl: FileList | null) {
    if (!fl || fl.length === 0) return;
    const f = fl[0];
    if (f) onFileSelected(f);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (!busy) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        onClick={busy ? undefined : pick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) pick();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex w-full max-w-xl cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
          dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-card hover:border-primary/40"
        } ${busy ? "pointer-events-none opacity-70" : ""}`}
      >
        {busy ? (
          <>
            <Loader2 className="size-12 animate-spin text-primary" />
            <div>
              <p className="text-lg font-bold">{busyMessage}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This may take a few seconds…
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="grid size-16 place-items-center rounded-2xl bg-primary/10">
              <Upload className="size-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold">{prompt}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse · up to 30 MB
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-lg border bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              {hint}
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
          disabled={busy}
        />
      </div>
    </div>
  );
}
