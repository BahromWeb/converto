"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getAccessToken } from "@/lib/api";
import { cvPreviewURL } from "@/lib/cv/api";

/**
 * Live HTML preview. We fetch the preview endpoint as authenticated
 * HTML and feed it into an iframe via srcDoc so the iframe doesn't need
 * its own access token. Re-fetches whenever the template changes or
 * after a 1.5s debounce — content updates are batched to keep the
 * preview from thrashing while the user types.
 */
export function PreviewPane({
  cvID,
  templateID,
}: {
  cvID: string;
  templateID: string;
}) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        const res = await fetch(cvPreviewURL(cvID), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.text();
        if (alive) setHtml(body);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Preview failed");
      } finally {
        if (alive) setLoading(false);
      }
    }, 600);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [cvID, templateID, refreshKey]);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b p-2 px-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Live preview
        </h2>
        <button
          type="button"
          onClick={() => setRefreshKey((k) => k + 1)}
          className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Refresh preview"
        >
          <RefreshCw className="size-3" />
        </button>
      </div>
      <div className="relative flex-1 bg-muted/30">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-sm">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !html && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span className="text-destructive">{error}</span>
            </div>
          </div>
        )}
        <iframe
          srcDoc={html}
          title="CV preview"
          className="h-full w-full border-0 bg-white"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
