"use client";

import { Loader2, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import type { Phase } from "./use-job-runner";
import { SaveToCloud } from "./save-to-cloud";

export interface JobStatusProps {
  phase: Phase;
  error: string | null;
  onDownload?: () => void;
  onReset?: () => void;
  /** Hide the download button — useful for tools that return multiple files. */
  hideDownload?: boolean;
  /** Custom label for the action — "Download merged PDF", "Download ZIP", ... */
  downloadLabel?: string;
  /** Output file id — drives the Save-to-cloud buttons. */
  outputFileId?: string | null;
  /** Filename used when the user picks "Save to Dropbox / Drive". */
  filename?: string;
}

/**
 * Visual companion to useJobRunner. Renders the right widget for the
 * current phase so individual tool clients don't reinvent the spinner +
 * error + download-button trio.
 */
export function JobStatusPanel({
  phase,
  error,
  onDownload,
  onReset,
  hideDownload = false,
  downloadLabel = "Download result",
  outputFileId,
  filename,
}: JobStatusProps) {
  if (phase === "idle") return null;

  if (phase === "uploading" || phase === "running") {
    const text = phase === "uploading" ? "Uploading…" : "Processing…";
    return (
      <div className="mt-6 flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>{text}</span>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <AlertCircle className="mt-0.5 size-4 text-destructive" />
        <div className="flex-1">
          <p className="font-medium text-destructive">Job failed</p>
          <p className="mt-1 text-muted-foreground">{error ?? "Unknown error"}</p>
        </div>
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  // done
  return (
    <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex flex-1 min-w-0 items-center gap-2">
          <CheckCircle2 className="size-4 text-primary" />
          <span className="font-medium">Done.</span>
          <span className="truncate text-muted-foreground">File expires in 5 min</span>
        </span>
        {!hideDownload && onDownload && (
          <Button size="sm" onClick={onDownload}>
            <Download className="mr-1.5 size-4" />
            {downloadLabel}
          </Button>
        )}
      </div>
      {outputFileId && <SaveToCloud fileId={outputFileId} filename={filename} />}
    </div>
  );
}
