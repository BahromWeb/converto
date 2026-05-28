"use client";

import { useState } from "react";
import { Loader2, Mail, CheckCircle2, AlertCircle, RotateCcw, Copy } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { ResumeDropzone } from "@/components/cv/dropzone";
import { useCVImport } from "@/lib/cv/use-cv-import";
import { generateCoverLetter } from "@/lib/cv/api";

const TONES: Array<{ id: "formal" | "enthusiastic" | "conversational"; label: string; hint: string }> = [
  { id: "formal",         label: "Formal",         hint: "Traditional, corporate, safe choice." },
  { id: "enthusiastic",   label: "Enthusiastic",   hint: "Energetic, startup-friendly." },
  { id: "conversational", label: "Conversational", hint: "Warm, natural, modern teams." },
];

export function CoverLetterClient() {
  return (
    <AuthGate>
      <Inner />
    </AuthGate>
  );
}

function Inner() {
  const cv = useCVImport();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [tone, setTone] = useState<"formal" | "enthusiastic" | "conversational">("formal");
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!cv.detail) return;
    if (jobDesc.trim().length < 30) {
      setError("Paste at least 30 characters of the job description so we can tailor it.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const r = await generateCoverLetter(cv.detail.id, {
        job_title: jobTitle || undefined,
        job_description: jobDesc,
        tone,
      });
      setText(r.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function startOver() {
    cv.reset();
    setJobTitle("");
    setJobDesc("");
    setTone("formal");
    setText(null);
    setError(null);
  }

  if (cv.stage === "idle") {
    return <ResumeDropzone onFile={cv.start} label="Drop your CV so we know what to highlight" />;
  }
  if (cv.stage === "uploading" || cv.stage === "parsing") {
    return <Progress label={cv.stage === "uploading" ? "Uploading…" : "AI reading your resume…"} percent={cv.progress} />;
  }
  if (cv.stage === "failed") {
    return <ErrorCard error={cv.error} onRetry={startOver} />;
  }

  if (text) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <h2 className="text-lg font-bold">Your cover letter</h2>
          <button
            type="button"
            onClick={copy}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
          >
            <Copy className="size-3.5" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl border bg-secondary/30 p-5 font-sans text-sm leading-relaxed">
{text}
        </pre>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setText(null)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Try a different tone / role
          </button>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            <RotateCcw className="size-3.5" /> Different CV
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-2">
        <Mail className="size-5 text-primary" />
        <h2 className="text-lg font-bold">Tell us about the role</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Read on <strong>{cv.detail?.title || "your resume"}</strong>. AI will pull real achievements from
        it and tailor the letter to the role you&apos;re applying to.
      </p>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job title (optional)</span>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Senior Product Designer"
          className="mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job description</span>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={8}
          placeholder="Paste the full posting. Bullet points, responsibilities, the &apos;you have&apos; list — all of it helps."
          className="mt-1 w-full resize-y rounded-lg border bg-card px-3 py-2 text-sm leading-relaxed"
        />
      </label>

      <div className="mt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tone</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {TONES.map((t) => {
            const active = tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 ${
                  active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-sm font-bold">{t.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.hint}</p>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{error}</p>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={busy}
          onClick={generate}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? <><Loader2 className="size-4 animate-spin" />Writing your letter…</> : <>Generate cover letter</>}
        </button>
        <button
          type="button"
          onClick={startOver}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
        >
          <RotateCcw className="size-3.5" /> Different CV
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
