"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Loader2,
  AlertCircle,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAccessToken } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

export interface PdfViewerHandle {
  /** Navigate the embedded PDF to the given 1-indexed page. */
  jumpToPage: (page: number) => void;
}

// PDF Open Parameter zoom percentages most browsers (Chromium PDFium,
// Firefox PDF.js, Safari Preview) honour. Keep the list tight — adding
// more just clutters the toolbar without giving the user a meaningful
// new option.
const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200] as const;

/**
 * Embedded PDF previewer. Fetches the file as a blob (with auth header)
 * and feeds an object URL into a plain <iframe>. Page + zoom navigation
 * piggybacks on the standard PDF Open Parameters fragment (#page=N&zoom=N)
 * which is honoured by Chromium PDFium, Firefox PDF.js, and Safari.
 *
 * The iframe gets a `key` derived from page+zoom so React fully tears
 * it down and recreates it whenever either changes — without that,
 * browsers ignore fragment-only updates once the PDF is loaded.
 *
 * react-pdf/pdfjs-dist would give richer features (search, highlight),
 * but they'd add ~200 KB to the bundle for no functional benefit at v1.
 * Native browser PDF rendering ships zero JS and is what 99 % of users
 * already trust.
 */
export const PdfViewer = forwardRef<PdfViewerHandle, {
  fileId: string;
  fileName?: string;
  pageCount?: number;
}>(function PdfViewer({ fileId, fileName, pageCount }, ref) {
  // We store the raw Blob (not just the URL) because Chromium's embedded
  // PDFium viewer caches the rendered state per object URL — changing
  // only the `#page=N` fragment doesn't re-scroll it. So on every page
  // change we mint a fresh object URL from the same Blob, which forces
  // a clean load + honours the fragment.
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // ─── Fetch PDF as blob whenever the file changes ─────────────────────
  useEffect(() => {
    let alive = true;
    setBlob(null);
    setError(null);
    setPage(1);
    setZoom(100);

    const token = getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(`${API_BASE}/file/${fileId}/download`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((raw) => {
        if (!alive) return;
        // /file/<id>/download still serves some legacy uploads with the
        // wrong Content-Type (".pdf"). Wrap in a fresh blob with the
        // right MIME so the iframe renders it as a PDF.
        setBlob(new Blob([raw], { type: "application/pdf" }));
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Couldn't load PDF");
      });

    return () => {
      alive = false;
    };
  }, [fileId]);

  // Re-mint a fresh object URL every time the page or zoom changes so
  // the embedded viewer treats it as a brand-new document and respects
  // the #page=N fragment on (re-)load.
  useEffect(() => {
    if (!blob) {
      setBlobUrl(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob, page, zoom]);

  useImperativeHandle(ref, () => ({
    jumpToPage(p: number) {
      const max = pageCount && pageCount > 0 ? pageCount : p;
      setPage(Math.max(1, Math.min(p, max)));
    },
  }));

  const clampedPage = Math.max(1, pageCount ? Math.min(page, pageCount) : page);
  const prevDisabled = clampedPage <= 1;
  const nextDisabled = pageCount != null && clampedPage >= pageCount;

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () =>
    setPage((p) => (pageCount ? Math.min(pageCount, p + 1) : p + 1));

  const zoomIn = () => {
    const idx = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    const next = ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, idx + 1)] ?? zoom;
    setZoom(next);
  };
  const zoomOut = () => {
    const idx = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    const prev = ZOOM_LEVELS[Math.max(0, idx - 1)] ?? zoom;
    setZoom(prev);
  };
  const zoomFit = () => setZoom(100);

  // ─── Render states ───────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Couldn&apos;t load PDF</p>
            <p className="mt-1 text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm">Loading PDF…</p>
      </div>
    );
  }

  // Open-parameter URL. We also include a `t` cache-buster so even if
  // the browser collapses fragment-only navigation, swapping the iframe
  // key (below) still forces a fresh load.
  const src = `${blobUrl}#page=${clampedPage}&zoom=${zoom}&toolbar=0&navpanes=0&t=${clampedPage}-${zoom}`;
  const iframeKey = `${fileId}-${clampedPage}-${zoom}`;

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="size-4 shrink-0 text-primary" />
          <h2 className="truncate text-sm font-semibold">
            {fileName || "Document"}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {/* Page nav */}
          <button
            type="button"
            onClick={goPrev}
            disabled={prevDisabled}
            className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="px-1 font-mono text-xs text-muted-foreground">
            {clampedPage}
            {pageCount ? ` / ${pageCount}` : ""}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={nextDisabled}
            className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight className="size-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-border" />

          {/* Zoom */}
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_LEVELS[0]!}
            className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-xs text-muted-foreground">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]!}
            className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={zoomFit}
            className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Fit to width"
            title="Reset zoom (100%)"
          >
            <Maximize2 className="size-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-border" />

          <a
            href={blobUrl}
            download={fileName || "document.pdf"}
            className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Download PDF"
            aria-label="Download PDF"
          >
            <Download className="size-3.5" />
          </a>
        </div>
      </div>

      <iframe
        key={iframeKey}
        ref={iframeRef}
        src={src}
        title="PDF preview"
        className="flex-1 border-0 bg-muted/40"
      />

      {/* Page navigation strip (only if pageCount known and > 1) */}
      {pageCount != null && pageCount > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto border-t bg-background p-2">
          {Array.from({ length: Math.min(pageCount, 50) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`grid size-7 shrink-0 place-items-center rounded text-[11px] font-semibold transition-colors ${
                  p === clampedPage
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </button>
            ),
          )}
          {pageCount > 50 && (
            <span className="px-2 text-xs text-muted-foreground">
              + {pageCount - 50} more
            </span>
          )}
        </div>
      )}
    </div>
  );
});
