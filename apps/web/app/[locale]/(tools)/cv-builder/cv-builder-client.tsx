"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { CVLanding } from "./components/landing";
import { CVEditor } from "./components/editor";
import {
  createCVSession,
  getCVSession,
  
} from "@/lib/cv/api";
import type { CVSessionDetail } from "@/lib/cv/types";
import { uploadFile } from "@/lib/api";

/**
 * Top-level orchestrator for the /cv-builder tool. Three modes are
 * routed through query params (?session=, ?mode=) so refresh + share
 * links keep the user on the same step. Component states:
 *
 *  - landing: no ?session= yet — show the three CTA cards.
 *  - editor:  ?session=<id> — load the detail + render the 3-column UI.
 *  - polling: ?session=<id> but status=parsing — wait + show a spinner.
 */
export function CVBuilderClient() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionParam = params.get("session");
  const modeParam = params.get("mode") as
    | "scratch"
    | "import"
    | "voice"
    | null;

  const [detail, setDetail] = useState<CVSessionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ─── Load detail when session ID present ────────────────────────────
  useEffect(() => {
    if (!sessionParam) {
      setDetail(null);
      return;
    }
    let alive = true;
    setLoadingDetail(true);
    setError(null);
    getCVSession(sessionParam)
      .then((d) => {
        if (alive) setDetail(d);
      })
      .catch((e: unknown) => {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load CV");
      })
      .finally(() => {
        if (alive) setLoadingDetail(false);
      });
    return () => {
      alive = false;
    };
  }, [sessionParam]);

  // ─── Poll while parsing ─────────────────────────────────────────────
  useEffect(() => {
    if (!detail || detail.status !== "parsing") return;
    const t = setInterval(async () => {
      try {
        const d = await getCVSession(detail.id);
        setDetail(d);
        if (d.status !== "parsing") clearInterval(t);
      } catch {
        /* keep polling */
      }
    }, 2_000);
    return () => clearInterval(t);
  }, [detail]);

  // ─── Navigate to a session (push query param) ───────────────────────
  const goSession = useCallback(
    (id: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set("session", id);
      url.searchParams.delete("mode");
      router.replace(url.pathname + "?" + url.searchParams.toString());
    },
    [router],
  );

  // ─── Handlers from landing page ─────────────────────────────────────
  const handleScratch = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const s = await createCVSession({ mode: "scratch", title: "My CV" });
      goSession(s.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setBusy(false);
    }
  }, [goSession]);

  const handleImport = useCallback(
    async (file: File) => {
      setBusy(true);
      setError(null);
      try {
        const up = await uploadFile(file);
        const s = await createCVSession({
          mode: "import",
          source_file_id: up.id,
          title: file.name.replace(/\.[^/.]+$/, "") || "Imported CV",
        });
        goSession(s.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to import");
      } finally {
        setBusy(false);
      }
    },
    [goSession],
  );

  const handleVoice = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const s = await createCVSession({ mode: "voice", title: "Voice CV" });
      const url = new URL(window.location.href);
      url.searchParams.set("session", s.id);
      url.searchParams.set("mode", "voice");
      router.replace(url.pathname + "?" + url.searchParams.toString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start voice mode");
    } finally {
      setBusy(false);
    }
  }, [router]);

  // ─── Render branches ────────────────────────────────────────────────

  if (sessionParam && loadingDetail) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sessionParam && error && !detail) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto size-6 text-destructive" />
          <h2 className="mt-3 text-lg font-bold text-destructive">
            Couldn&apos;t open this CV
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (sessionParam && detail) {
    return (
      <CVEditor
        detail={detail}
        voiceMode={modeParam === "voice"}
        onRefresh={async () => {
          try {
            setDetail(await getCVSession(detail.id));
          } catch {
            /* ignore */
          }
        }}
      />
    );
  }

  // No session yet — landing page.
  return (
    <CVLanding
      busy={busy}
      error={error}
      onScratch={handleScratch}
      onImport={handleImport}
      onVoice={handleVoice}
    />
  );
}
