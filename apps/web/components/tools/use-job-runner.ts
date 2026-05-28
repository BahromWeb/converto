"use client";

import { useState, useCallback } from "react";
import { uploadFile, runJob, downloadFile, type JobRecord, type JobStatus } from "@/lib/api";

export type Phase = "idle" | "uploading" | "running" | "done" | "failed";

export interface UseJobRunnerResult {
  phase: Phase;
  status: JobStatus | null;
  error: string | null;
  result: JobRecord | null;
  /** Upload files then enqueue the job. `buildBody` maps uploaded IDs → request body. */
  run: (
    files: File[],
    buildBody: (uploadedIds: string[]) => unknown,
    op: string,
  ) => Promise<void>;
  /** Trigger the browser download for the job's output file. */
  download: (filename?: string) => Promise<void>;
  reset: () => void;
}

/**
 * Glue between FileDropzone, tool-specific form state and the backend's
 * async PDF job pipeline. Every tool client component uses this hook so
 * pending / processing / done / failed states render the same way and we
 * keep the wiring in one place.
 */
export function useJobRunner(): UseJobRunnerResult {
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobRecord | null>(null);

  const reset = useCallback(() => {
    setPhase("idle");
    setStatus(null);
    setError(null);
    setResult(null);
  }, []);

  const run = useCallback(
    async (
      files: File[],
      buildBody: (uploadedIds: string[]) => unknown,
      op: string,
    ): Promise<void> => {
      setPhase("uploading");
      setError(null);
      setResult(null);
      setStatus(null);
      try {
        const uploaded: string[] = [];
        for (const f of files) {
          const r = await uploadFile(f);
          uploaded.push(r.id);
        }
        setPhase("running");
        const job = await runJob(op, buildBody(uploaded), {
          onStatus: setStatus,
        });
        setResult(job);
        setPhase("done");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        setPhase("failed");
      }
    },
    [],
  );

  const download = useCallback(
    async (filename = "result.pdf"): Promise<void> => {
      if (!result?.output_file_id) return;
      await downloadFile(result.output_file_id, filename);
    },
    [result],
  );

  return { phase, status, error, result, run, download, reset };
}
