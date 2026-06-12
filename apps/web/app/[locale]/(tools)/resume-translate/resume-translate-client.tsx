"use client";

import { useState } from "react";
import { Loader2, Languages, CheckCircle2, AlertCircle, RotateCcw, Download } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { ResumeDropzone } from "@/components/cv/dropzone";
import { useCVImport } from "@/lib/cv/use-cv-import";
import { translateCV, exportCV, getCVSession } from "@/lib/cv/api";

const LANGUAGES: Array<{ code: string; label: string; native: string }> = [
  { code: "en", label: "English",   native: "English" },
  { code: "ru", label: "Russian",   native: "Русский" },
  { code: "uz", label: "Uzbek",     native: "O'zbek" },
  { code: "de", label: "German",    native: "Deutsch" },
  { code: "fr", label: "French",    native: "Français" },
  { code: "es", label: "Spanish",   native: "Español" },
  { code: "it", label: "Italian",   native: "Italiano" },
  { code: "pt", label: "Portuguese",native: "Português" },
  { code: "nl", label: "Dutch",     native: "Nederlands" },
  { code: "pl", label: "Polish",    native: "Polski" },
  { code: "tr", label: "Turkish",   native: "Türkçe" },
  { code: "ar", label: "Arabic",    native: "العربية" },
  { code: "zh", label: "Chinese",   native: "中文" },
  { code: "ja", label: "Japanese",  native: "日本語" },
  { code: "ko", label: "Korean",    native: "한국어" },
  { code: "hi", label: "Hindi",     native: "हिन्दी" },
  { code: "id", label: "Indonesian",native: "Bahasa" },
  { code: "vi", label: "Vietnamese",native: "Tiếng Việt" },
  { code: "th", label: "Thai",      native: "ไทย" },
  { code: "uk", label: "Ukrainian", native: "Українська" },
];

export function ResumeTranslateClient() {
  return (
    <AuthGate>
      <Inner />
    </AuthGate>
  );
}

function Inner() {
  const cv = useCVImport();
  const [target, setTarget] = useState("en");
  const [busy, setBusy] = useState<"translating" | "exporting" | null>(null);
  const [pdfID, setPdfID] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function translateAndExport() {
    if (!cv.detail) return;
    setError(null);
    setPdfID(null);
    try {
      setBusy("translating");
      await translateCV(cv.detail.id, target);

      setBusy("exporting");
      await exportCV(cv.detail.id, { format: "pdf" });

      // Poll the session for last_pdf_id (up to ~30s).
      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const d = await getCVSession(cv.detail.id);
        if (d.last_pdf_id) {
          setPdfID(d.last_pdf_id);
          break;
        }
      }
      if (!pdfID) {
        // Fall back: invite user to /account/files
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed");
    } finally {
      setBusy(null);
    }
  }

  function startOver() {
    cv.reset();
    setPdfID(null);
    setError(null);
    setTarget("en");
  }

  if (cv.stage === "idle") {
    return <ResumeDropzone onFile={cv.start} label="Drop the CV you want translated" />;
  }
  if (cv.stage === "uploading" || cv.stage === "parsing") {
    return <Progress label={cv.stage === "uploading" ? "Uploading…" : "AI reading your resume…"} percent={cv.progress} />;
  }
  if (cv.stage === "failed") {
    return <ErrorCard error={cv.error} onRetry={startOver} />;
  }

  if (pdfID) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold">Your translated CV is ready</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Translated to <strong>{LANGUAGES.find((l) => l.code === target)?.label}</strong> and re-rendered with your current template.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a
            href={`/file/${pdfID}/download`}
            download
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Download className="size-4" /> Download PDF
          </a>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            <RotateCcw className="size-3.5" /> Translate another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-2">
        <Languages className="size-5 text-primary" />
        <h2 className="text-lg font-bold">Pick the target language</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        We translate every section in one AI call — company names, dates, and contact details stay intact.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setTarget(l.code)}
            className={`rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 ${
              target === l.code ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
          >
            <p className="text-sm font-bold">{l.label}</p>
            <p className="text-xs text-muted-foreground">{l.native}</p>
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{error}</p>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={busy !== null}
          onClick={translateAndExport}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? <><Loader2 className="size-4 animate-spin" />{busy === "translating" ? "Translating…" : "Rendering PDF…"}</> : <>Translate & download PDF</>}
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
