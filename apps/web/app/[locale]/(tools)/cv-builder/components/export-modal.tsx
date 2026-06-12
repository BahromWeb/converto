"use client";

import { useState } from "react";
import { X, FileText, FileType, FileCode, Loader2, Download } from "lucide-react";
import { exportCV, getCVSession } from "@/lib/cv/api";

/**
 * Export modal. The backend enqueues an asynq job; we poll for the
 * session's last_pdf_id to know when the rendering is done. For DOCX/
 * TXT exports we don't get a direct file_id field in the session, so
 * the user is told to find the result in their files page.
 */
export function ExportModal({
  cvID,
  onClose,
}: {
  cvID: string;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<"pdf" | "docx" | "txt">("pdf");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadID, setDownloadID] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    setDownloadID(null);
    try {
      await exportCV(cvID, { format });
      // Poll the session row up to ~30s for last_pdf_id.
      if (format === "pdf") {
        for (let i = 0; i < 15; i++) {
          await new Promise((r) => setTimeout(r, 2000));
          const d = await getCVSession(cvID);
          if (d.last_pdf_id) {
            setDownloadID(d.last_pdf_id);
            break;
          }
        }
      } else {
        // Non-PDF formats land in the user's files list; we don't poll.
        setDownloadID("see-files");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Export your CV</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <FormatCard
              icon={FileText}
              label="PDF"
              hint="Best for sharing + ATS"
              active={format === "pdf"}
              onClick={() => setFormat("pdf")}
            />
            <FormatCard
              icon={FileType}
              label="DOCX"
              hint="Editable in Word"
              active={format === "docx"}
              onClick={() => setFormat("docx")}
            />
            <FormatCard
              icon={FileCode}
              label="TXT"
              hint="Plain text, ATS-perfect"
              active={format === "txt"}
              onClick={() => setFormat("txt")}
            />
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
              {error}
            </p>
          )}

          {downloadID === "see-files" && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">
              File generated — find it in{" "}
              <a href="/account/files" className="font-semibold text-primary hover:underline">
                My Files
              </a>
              .
            </div>
          )}
          {downloadID && downloadID !== "see-files" && (
            <a
              href={`/file/${downloadID}/download`}
              download
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <Download className="size-4" />
              Download {format.toUpperCase()}
            </a>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={run}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Rendering…
              </>
            ) : (
              <>
                <Download className="size-4" />
                Generate {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormatCard({
  icon: Icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:-translate-y-0.5 ${
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <Icon className={`size-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-sm font-bold">{label}</p>
      <p className="text-[10px] text-muted-foreground">{hint}</p>
    </button>
  );
}
