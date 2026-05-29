"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Page {
  n: number;
  data: string; // base64 JPEG
}

interface ThumbnailsResponse {
  count: number;
  page_count: number;
  pages: Page[];
}

/**
 * Visual picker for PDF pages. Fetches thumbnails for every page in the
 * uploaded file, lets the user click-to-select, and serialises the
 * choice back into the comma-and-range syntax our split / extract /
 * remove endpoints accept (e.g. 1-3,5,7-9). Keeps the same wire format
 * so we don't need to fork the backend for a "visual" mode.
 */
export function VisualPagePicker({
  fileID,
  mode,
  selection,
  onChange,
}: {
  fileID: string;
  /** "single" = pages, "ranges" = ranges, "everyN" hidden. */
  mode: "extract" | "ranges";
  selection: string;
  onChange: (rangeString: string) => void;
}) {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(() => parseRanges(selection));
  // Track the page the user last clicked for shift-click range selection.
  const [anchor, setAnchor] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    api
      .post<ThumbnailsResponse>("/api/pdf/thumbnails", {
        file_id: fileID,
        max_width: 180,
        max_pages: 200,
      })
      .then((res) => {
        if (!alive) return;
        if (res.StatusCode >= 400) {
          setError(res.Description ?? "Couldn't render previews");
          return;
        }
        setPages(res.Data.pages);
        setPageCount(res.Data.page_count || res.Data.count);
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [fileID]);

  // Keep the text-input value in sync whenever selection changes.
  useEffect(() => {
    onChange(formatRanges(selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function togglePage(n: number, e: React.MouseEvent) {
    const next = new Set(selected);
    if (e.shiftKey && anchor !== null) {
      const [lo, hi] = anchor < n ? [anchor, n] : [n, anchor];
      for (let i = lo; i <= hi; i++) next.add(i);
    } else {
      if (next.has(n)) next.delete(n);
      else next.add(n);
      setAnchor(n);
    }
    setSelected(next);
  }

  function selectAll() {
    if (!pageCount) return;
    const all = new Set<number>();
    for (let i = 1; i <= pageCount; i++) all.add(i);
    setSelected(all);
  }

  function clearAll() {
    setSelected(new Set());
    setAnchor(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border bg-card p-8 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Rendering page previews…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>{error}. Use the text input below to enter page numbers manually.</span>
      </div>
    );
  }

  if (pages.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Header / actions */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-muted-foreground">
          Click a page to {mode === "ranges" ? "include it in a group" : "extract it"}.
          <span className="hidden sm:inline"> Shift-click for a range.</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="rounded-md border px-2.5 py-1 text-xs font-semibold hover:bg-accent"
          >
            Select all {pageCount}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md border px-2.5 py-1 text-xs font-semibold hover:bg-accent"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Page grid */}
      <div className="max-h-[420px] overflow-y-auto rounded-xl border bg-secondary/20 p-3">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
          {pages.map((p) => {
            const isOn = selected.has(p.n);
            return (
              <button
                key={p.n}
                type="button"
                onClick={(e) => togglePage(p.n, e)}
                className={`group relative overflow-hidden rounded-lg border-2 bg-white transition-all hover:-translate-y-0.5 ${
                  isOn ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/jpeg;base64,${p.data}`}
                  alt={`Page ${p.n}`}
                  className="aspect-[3/4] w-full object-cover"
                />
                <span className={`absolute bottom-1 right-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  isOn ? "bg-primary text-primary-foreground" : "bg-black/70 text-white"
                }`}>
                  {p.n}
                </span>
                {isOn && (
                  <span className="absolute left-1 top-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status summary */}
      <div className="mt-3 text-xs text-muted-foreground">
        {selected.size === 0 ? (
          <>No pages selected yet.</>
        ) : (
          <>
            <span className="font-semibold text-foreground">{selected.size}</span> page
            {selected.size === 1 ? "" : "s"} selected — encoded as{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5">{formatRanges(selected)}</code>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * "1-3,5,7-9" → Set{1,2,3,5,7,8,9}. Tolerant of whitespace and stray
 * commas; ignores anything non-numeric so the text input + visual
 * picker can stay in sync mid-typing.
 */
function parseRanges(s: string): Set<number> {
  const out = new Set<number>();
  for (const chunk of s.split(",")) {
    const t = chunk.trim();
    if (!t) continue;
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(t);
    if (!m) continue;
    const lo = parseInt(m[1]!, 10);
    const hi = m[2] ? parseInt(m[2]!, 10) : lo;
    if (Number.isNaN(lo) || Number.isNaN(hi)) continue;
    for (let i = Math.min(lo, hi); i <= Math.max(lo, hi); i++) out.add(i);
  }
  return out;
}

/**
 * Set{1,2,3,5,7,8,9} → "1-3,5,7-9". Always sorted; consecutive runs of
 * 2+ pages collapse into a range so split-by-ranges sees the natural
 * grouping a user would expect.
 */
function formatRanges(set: Set<number>): string {
  const sorted = Array.from(set).sort((a, b) => a - b);
  if (sorted.length === 0) return "";
  const groups: string[] = [];
  let runStart = sorted[0]!;
  let prev = sorted[0]!;
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
      continue;
    }
    groups.push(runStart === prev ? `${runStart}` : `${runStart}-${prev}`);
    if (cur === undefined) break;
    runStart = cur;
    prev = cur;
  }
  return groups.join(",");
}
