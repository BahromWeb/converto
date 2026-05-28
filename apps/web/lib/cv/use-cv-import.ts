"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadFile } from "@/lib/api";
import { createCVSession, getCVSession } from "@/lib/cv/api";
import type { CVSessionDetail } from "@/lib/cv/types";

type Stage =
  | "idle"
  | "uploading"
  | "parsing"
  | "ready"
  | "failed";

/**
 * Shared file→CV pipeline used by every standalone CAREER tool that
 * needs a parsed CV before running its specific action (ATS check,
 * translate, export, cover letter). Callers get a single `start(file)`
 * function plus the staged status of the underlying CV session.
 *
 * Lifecycle:
 *   1. uploadFile() → file_id
 *   2. createCVSession({ mode: "import", source_file_id }) → CV row
 *   3. poll getCVSession until status leaves "parsing"
 *   4. when status = "ready" the caller can use detail.id for the next
 *      step (translate / ats / export / cover-letter).
 */
export function useCVImport() {
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0); // 0..100 estimate
  const [detail, setDetail] = useState<CVSessionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stop polling on unmount.
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStage("idle");
    setProgress(0);
    setDetail(null);
    setError(null);
  }, []);

  const start = useCallback(async (file: File, locale = "en") => {
    if (pollRef.current) clearInterval(pollRef.current);
    setError(null);
    setDetail(null);
    setStage("uploading");
    setProgress(10);
    try {
      const up = await uploadFile(file);
      setProgress(40);

      const sess = await createCVSession({
        mode: "import",
        source_file_id: up.id,
        locale,
        title: file.name.replace(/\.[^.]+$/, ""),
      });
      setProgress(55);
      setStage("parsing");

      // First fetch immediately, then poll every 2s.
      const fetchOnce = async () => {
        const d = await getCVSession(sess.id);
        setDetail(d);
        if (d.status === "ready") {
          if (pollRef.current) clearInterval(pollRef.current);
          setProgress(100);
          setStage("ready");
        } else if (d.status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setError(d.parse_error || "Couldn't parse this file. Try a clean PDF.");
          setStage("failed");
        } else {
          setProgress((p) => Math.min(95, p + 5));
        }
      };
      await fetchOnce();
      pollRef.current = setInterval(fetchOnce, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setStage("failed");
    }
  }, []);

  return { stage, progress, detail, error, start, reset };
}
