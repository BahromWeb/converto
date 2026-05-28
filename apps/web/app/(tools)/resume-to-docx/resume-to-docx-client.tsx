"use client";

import { useEffect, useState } from "react";
import { Loader2, FileType, CheckCircle2, AlertCircle, RotateCcw, Download } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { ResumeDropzone } from "@/components/cv/dropzone";
import { useCVImport } from "@/lib/cv/use-cv-import";
import { exportCV, listCVTemplates } from "@/lib/cv/api";
import type { CVTemplate } from "@/lib/cv/types";

/**
 * Standalone "Resume to DOCX" — different from the generic /pdf-to-word
 * tool because we route the file through the CV parser first, so the
 * DOCX comes back as a clean, recruiter-ready resume in a chosen
 * template rather than a pixel-perfect copy of whatever the original
 * looked like.
 */
export function ResumeToDocxClient() {
  return (
    <AuthGate>
      <Inner />
    </AuthGate>
  );
}

function Inner() {
  const cv = useCVImport();
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [templateID, setTemplateID] = useState("modern");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCVTemplates().then(setTemplates).catch(() => {});
  }, []);

  async function exportDocx() {
    if (!cv.detail) return;
    setError(null);
    setBusy(true);
    try {
      await exportCV(cv.detail.id, { format: "docx", template_id: templateID });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    cv.reset();
    setDone(false);
    setError(null);
  }

  if (cv.stage === "idle") {
    return <ResumeDropzone onFile={cv.start} label="Drop the resume PDF you want as DOCX" />;
  }
  if (cv.stage === "uploading" || cv.stage === "parsing") {
    return <Progress label={cv.stage === "uploading" ? "Uploading…" : "AI reading your resume…"} percent={cv.progress} />;
  }
  if (cv.stage === "failed") {
    return <ErrorCard error={cv.error} onRetry={startOver} />;
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold">Your DOCX is being generated</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Word documents render in the background. Find the finished file in your library.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a
            href="/account/files"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Download className="size-4" /> Open My Files
          </a>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            <RotateCcw className="size-3.5" /> Convert another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-2">
        <FileType className="size-5 text-primary" />
        <h2 className="text-lg font-bold">Pick the template</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Your DOCX will be rendered with the template you pick — fully editable in Word, Google Docs, or LibreOffice.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => {
          const active = t.id === templateID;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateID(t.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 ${
                active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{t.name}</p>
                {active && <CheckCircle2 className="size-4 text-primary" />}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{error}</p>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={busy}
          onClick={exportDocx}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? <><Loader2 className="size-4 animate-spin" />Sending to renderer…</> : <>Generate DOCX</>}
        </button>
        <button
          type="button"
          onClick={startOver}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
        >
          <RotateCcw className="size-3.5" /> Different file
        </button>
      </div>
    </div>
  );
}

function Progress({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="rounded-2xl border bg-card p-8">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <p className="text-sm font-semibold">{label}</p>
        <p className="ml-auto text-xs text-muted-foreground">{percent}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary/50">
        <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ErrorCard({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertCircle className="mx-auto size-6 text-destructive" />
      <h2 className="mt-3 text-lg font-bold text-destructive">We couldn&apos;t read that file</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error || "Try a different PDF or DOCX."}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        <RotateCcw className="size-3.5" /> Try another file
      </button>
    </div>
  );
}
