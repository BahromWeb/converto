"use client";

import { useState } from "react";
import { X, Loader2, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { runATSCheck } from "@/lib/cv/api";
import type { CVATSRun } from "@/lib/cv/types";

export function ATSModal({
  cvID,
  onClose,
  onRunComplete,
}: {
  cvID: string;
  onClose: () => void;
  onRunComplete: () => void;
}) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [run, setRun] = useState<CVATSRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    if (jobDesc.trim().length < 30) {
      setError("Paste at least 30 characters of the job description.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const r = await runATSCheck(cvID, {
        job_title: jobTitle || undefined,
        job_description: jobDesc,
      });
      setRun(r);
      onRunComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to score");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            <h2 className="text-lg font-bold">ATS Compatibility Check</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {!run && (
            <>
              <p className="text-sm text-muted-foreground">
                Paste the job description you&apos;re applying to — we&apos;ll score how
                well your CV matches the keywords and conventions ATS scanners
                care about.
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
              <button
                type="button"
                disabled={busy}
                onClick={check}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Scoring…
                  </>
                ) : (
                  <>Score this CV</>
                )}
              </button>
            </>
          )}

          {run && <ATSResult run={run} onReset={() => setRun(null)} />}
        </div>
      </div>
    </div>
  );
}

function ATSResult({ run, onReset }: { run: CVATSRun; onReset: () => void }) {
  const fb = run.feedback;
  const tone =
    run.score >= 80 ? "emerald" : run.score >= 60 ? "amber" : "rose";
  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          className={`grid size-20 place-items-center rounded-full ${
            tone === "emerald"
              ? "bg-emerald-500/15 text-emerald-700"
              : tone === "amber"
                ? "bg-amber-500/15 text-amber-700"
                : "bg-rose-500/15 text-rose-700"
          }`}
        >
          <span className="text-2xl font-bold">{run.score}</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ATS score
          </p>
          <p className="text-lg font-bold">
            {run.score >= 80
              ? "Strong match"
              : run.score >= 60
                ? "Decent match"
                : "Needs work"}
          </p>
          {run.job_title && (
            <p className="text-xs text-muted-foreground">vs {run.job_title}</p>
          )}
        </div>
      </div>

      {/* Sub-scores */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Keywords", val: fb.keyword_score },
          { label: "Format", val: fb.format_score },
          { label: "Content", val: fb.content_score },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-secondary/30 p-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="text-base font-bold">{s.val ?? "—"}</p>
          </div>
        ))}
      </div>

      {/* Missing keywords */}
      {fb.missing_keywords && fb.missing_keywords.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Missing keywords
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {fb.missing_keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Format issues */}
      {fb.format_issues && fb.format_issues.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Format issues
          </h3>
          <ul className="mt-2 space-y-1">
            {fb.format_issues.map((iss, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                {iss}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {fb.suggestions && fb.suggestions.length > 0 && (
        <div className="mt-4 rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
            AI suggestions
          </h3>
          <ul className="mt-2 space-y-1.5">
            {fb.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-4 text-xs font-semibold text-primary hover:underline"
      >
        Check against another job
      </button>
    </div>
  );
}
