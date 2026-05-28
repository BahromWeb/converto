"use client";

import { useState } from "react";
import { Loader2, Target, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { ResumeDropzone } from "@/components/cv/dropzone";
import { useCVImport } from "@/lib/cv/use-cv-import";
import { runATSCheck } from "@/lib/cv/api";
import type { CVATSRun } from "@/lib/cv/types";

export function ATSCheckClient() {
  return (
    <AuthGate>
      <ATSInner />
    </AuthGate>
  );
}

function ATSInner() {
  const cv = useCVImport();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [scoring, setScoring] = useState(false);
  const [run, setRun] = useState<CVATSRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function score() {
    if (!cv.detail) return;
    if (jobDesc.trim().length < 30) {
      setError("Paste at least 30 characters of the job description.");
      return;
    }
    setScoring(true);
    setError(null);
    try {
      const r = await runATSCheck(cv.detail.id, {
        job_title: jobTitle || undefined,
        job_description: jobDesc,
      });
      setRun(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scoring failed");
    } finally {
      setScoring(false);
    }
  }

  function startOver() {
    cv.reset();
    setJobTitle("");
    setJobDesc("");
    setRun(null);
    setError(null);
  }

  // ── 1. No file yet ──────────────────────────────────────────────
  if (cv.stage === "idle") {
    return <ResumeDropzone onFile={cv.start} />;
  }

  // ── 2. Uploading / parsing ──────────────────────────────────────
  if (cv.stage === "uploading" || cv.stage === "parsing") {
    return <StageProgress label={cv.stage === "uploading" ? "Uploading…" : "AI reading your resume…"} percent={cv.progress} />;
  }

  // ── 3. Parse failed ─────────────────────────────────────────────
  if (cv.stage === "failed") {
    return <StageError error={cv.error} onRetry={startOver} />;
  }

  // ── 4. Ready — show score result or scoring form ────────────────
  if (run) {
    return <ATSResultCard run={run} onRetry={startOver} onAnother={() => setRun(null)} />;
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-2">
        <Target className="size-5 text-primary" />
        <h2 className="text-lg font-bold">Score against a job description</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        We parsed <strong>{cv.detail?.title || "your resume"}</strong>. Paste the role you&apos;re
        applying for and we&apos;ll score how well your CV matches.
      </p>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Job title (optional)
        </span>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Senior Backend Engineer"
          className="mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Job description
        </span>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={8}
          placeholder="Paste the full posting here. The more we see, the better the score."
          className="mt-1 w-full resize-y rounded-lg border bg-card px-3 py-2 text-sm leading-relaxed"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={scoring}
          onClick={score}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {scoring ? <><Loader2 className="size-4 animate-spin" />Scoring…</> : <>Score this CV</>}
        </button>
        <button
          type="button"
          onClick={startOver}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
        >
          <RotateCcw className="size-3.5" />Different resume
        </button>
      </div>
    </div>
  );
}

function ATSResultCard({ run, onRetry, onAnother }: { run: CVATSRun; onRetry: () => void; onAnother: () => void }) {
  const fb = run.feedback;
  const tone = run.score >= 80 ? "emerald" : run.score >= 60 ? "amber" : "rose";
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <div
          className={`grid size-20 place-items-center rounded-full ${
            tone === "emerald" ? "bg-emerald-500/15 text-emerald-700"
              : tone === "amber" ? "bg-amber-500/15 text-amber-700"
              : "bg-rose-500/15 text-rose-700"
          }`}
        >
          <span className="text-2xl font-bold">{run.score}</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ATS Score
          </p>
          <p className="text-xl font-bold">
            {run.score >= 80 ? "Strong match" : run.score >= 60 ? "Decent match" : "Needs work"}
          </p>
          {run.job_title && (
            <p className="text-xs text-muted-foreground">vs {run.job_title}</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Keywords", val: fb.keyword_score },
          { label: "Format", val: fb.format_score },
          { label: "Content", val: fb.content_score },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-secondary/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-xl font-bold">{(s.val as number | undefined) ?? "—"}</p>
          </div>
        ))}
      </div>

      {Array.isArray(fb.missing_keywords) && (fb.missing_keywords as string[]).length > 0 && (
        <Block title="Missing keywords">
          <div className="flex flex-wrap gap-1.5">
            {(fb.missing_keywords as string[]).map((kw) => (
              <span key={kw} className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {kw}
              </span>
            ))}
          </div>
        </Block>
      )}

      {Array.isArray(fb.format_issues) && (fb.format_issues as string[]).length > 0 && (
        <Block title="Format issues">
          <ul className="space-y-1">
            {(fb.format_issues as string[]).map((iss, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600" /> {iss}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {Array.isArray(fb.suggestions) && (fb.suggestions as string[]).length > 0 && (
        <div className="mt-4 rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">AI suggestions</h3>
          <ul className="mt-2 space-y-1.5">
            {(fb.suggestions as string[]).map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onAnother}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Score against another job
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
        >
          <RotateCcw className="size-3.5" /> Different resume
        </button>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function StageProgress({ label, percent }: { label: string; percent: number }) {
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

function StageError({ error, onRetry }: { error: string | null; onRetry: () => void }) {
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
