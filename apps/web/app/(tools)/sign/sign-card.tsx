"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Download,
  Trash2,
  Pen,
  Type as TypeIcon,
  Upload as UploadIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { uploadFile, downloadFile } from "@/lib/api";

type SigMode = "draw" | "type" | "upload";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

/**
 * Sign PDF — three-step flow:
 *   1. Upload a PDF (we render page thumbnails server-side so the user
 *      can pick which page to sign without shipping pdfjs to the
 *      browser);
 *   2. Build a signature in one of three modes (draw on a canvas /
 *      type a name in a cursive font / upload a PNG of your own);
 *   3. Click anywhere on the page preview to place the signature; we
 *      POST {input_file_id, signature_file_id, page, x, y, width} to
 *      /api/pdf/sign and wait for the worker to finish.
 *
 * X/Y are in PDF points measured from the page's bottom-left; we
 * convert from preview-image coordinates by reading the rendered
 * thumbnail's natural width and the PDF's nominal width-in-points.
 */
export function SignCard() {
  // --- file state ---
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfID, setPdfID] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<string[] | null>(null); // base64 data URLs
  const [pageW, setPageW] = useState<number>(595); // PDF points
  const [pageH, setPageH] = useState<number>(842);
  const [activePage, setActivePage] = useState<number>(1);

  // --- signature state ---
  const [sigMode, setSigMode] = useState<SigMode>("draw");
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null); // PNG data URL
  const [typedName, setTypedName] = useState<string>("");
  const [placement, setPlacement] = useState<{ x: number; y: number } | null>(null);

  // --- job state ---
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputID, setOutputID] = useState<string | null>(null);

  // --- refs ---
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);

  // ---------- Step 1: upload PDF + fetch thumbnails ----------
  function pickPDF() { pdfInputRef.current?.click(); }
  function onPDFChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPdfFile(f);
    setPdfID(null);
    setThumbs(null);
    setActivePage(1);
    setPlacement(null);
    setOutputID(null);
    setError(null);
  }

  useEffect(() => {
    if (!pdfFile || pdfID) return;
    let alive = true;
    setBusy(true);
    uploadFile(pdfFile)
      .then(async (r) => {
        if (!alive) return;
        setPdfID(r.id);
        // Fetch thumbnails so the user can pick a page.
        const res = await fetch(`${API_BASE}/api/pdf/thumbnails`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_id: r.id, max_pages: 50, max_width: 320 }),
        });
        const j = await res.json();
        if (!alive) return;
        const data = j.Data;
        if (!data?.pages) {
          setError(j.Description ?? "thumbnail fetch failed");
          return;
        }
        // pages: [{index, data_url, page_w_pts, page_h_pts}]
        type ThumbPage = { index?: number; data_url?: string; thumb?: string; page_w_pts?: number; page_w?: number; page_h_pts?: number; page_h?: number };
        const list = (data.pages as ThumbPage[]).map((p) => p.data_url ?? p.thumb ?? "");
        setThumbs(list);
        const first = data.pages[0] as ThumbPage | undefined;
        if (first?.page_w_pts) setPageW(first.page_w_pts);
        if (first?.page_h_pts) setPageH(first.page_h_pts);
        if (first?.page_w) setPageW(first.page_w);
        if (first?.page_h) setPageH(first.page_h);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "upload failed");
      })
      .finally(() => { if (alive) setBusy(false); });
    return () => { alive = false; };
  }, [pdfFile, pdfID]);

  // ---------- Step 2a: drawing canvas ----------
  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const c = drawCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0d1b2a";
    const { x, y } = pointerXY(e, c);
    ctx.beginPath();
    ctx.moveTo(x, y);
    (c as HTMLCanvasElement & { __drawing?: boolean }).__drawing = true;
  }
  function moveDraw(e: React.MouseEvent | React.TouchEvent) {
    const c = drawCanvasRef.current as HTMLCanvasElement & { __drawing?: boolean } | null;
    if (!c || !c.__drawing) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointerXY(e, c);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  function endDraw() {
    const c = drawCanvasRef.current as HTMLCanvasElement & { __drawing?: boolean } | null;
    if (!c) return;
    c.__drawing = false;
    setSigDataUrl(c.toDataURL("image/png"));
  }
  function clearDraw() {
    const c = drawCanvasRef.current;
    if (!c) return;
    c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setSigDataUrl(null);
  }

  // ---------- Step 2b: typed signature ----------
  function commitTyped(name: string) {
    setTypedName(name);
    if (!name.trim()) { setSigDataUrl(null); return; }
    // Render the name into a canvas so the upstream flow only ever deals
    // with PNG bytes.
    const c = document.createElement("canvas");
    c.width = 640; c.height = 160;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.font = '600 64px "Brush Script MT", "Lucida Handwriting", cursive';
    ctx.fillStyle = "#0d1b2a";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 20, 80);
    setSigDataUrl(c.toDataURL("image/png"));
  }

  // ---------- Step 2c: uploaded image ----------
  function pickSigFile() { sigInputRef.current?.click(); }
  function onSigFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setSigDataUrl(String(reader.result));
    reader.readAsDataURL(f);
  }

  // ---------- Step 3: click to place + submit ----------
  function onPagePreviewClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!sigDataUrl) {
      setError("Build a signature first");
      return;
    }
    setError(null);
    const wrap = previewWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Convert from screen coords (origin top-left) to PDF coords
    // (origin bottom-left) at the page's nominal point size.
    const ratioX = pageW / rect.width;
    const ratioY = pageH / rect.height;
    const x = px * ratioX;
    // Anchor is bottom-left of signature; subtract signature height roughly.
    const y = (rect.height - py) * ratioY - 30; // 30pt nudge so click point ≈ centre
    setPlacement({ x, y });
  }

  async function submit() {
    if (!pdfID || !sigDataUrl || !placement) {
      setError("Pick a PDF, build a signature, and click where to place it");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Upload the signature as a real file the backend can read.
      const sigBlob = await (await fetch(sigDataUrl)).blob();
      const sigFile = new File([sigBlob], "signature.png", { type: "image/png" });
      const sigUp = await uploadFile(sigFile);

      const res = await fetch(`${API_BASE}/api/pdf/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input_file_id: pdfID,
          signature_file_id: sigUp.id,
          page: activePage,
          x: Math.max(0, Math.round(placement.x)),
          y: Math.max(0, Math.round(placement.y)),
          width: 180,
        }),
      });
      const j = await res.json();
      const jobID = j.Data?.id;
      if (!jobID) throw new Error(j.Description ?? "sign failed");

      // Poll for completion.
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const rr = await fetch(`${API_BASE}/api/pdf/sign/${jobID}`);
        const jj = await rr.json();
        const d = jj.Data;
        const status = d?.Status ?? d?.status;
        if (status === "done") {
          const out = d?.OutputFileID ?? d?.output_file_id;
          if (out) {
            setOutputID(out);
            return;
          }
          throw new Error("done but no output");
        }
        if (status === "failed") throw new Error("sign failed on server");
      }
      throw new Error("timed out waiting for signature");
    } catch (e) {
      setError(e instanceof Error ? e.message : "sign failed");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPdfFile(null); setPdfID(null); setThumbs(null); setActivePage(1);
    setSigDataUrl(null); setTypedName(""); setPlacement(null);
    setOutputID(null); setError(null);
  }

  // ---------- Render ----------
  return (
    <Card className="p-5 sm:p-8">
      <input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={onPDFChange} />
      <input ref={sigInputRef} type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" hidden onChange={onSigFileChange} />

      {!pdfFile ? (
        // Empty state — drop a PDF.
        <button
          type="button"
          onClick={pickPDF}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-12 text-center transition-colors hover:border-primary/40"
        >
          <UploadIcon className="size-6 text-muted-foreground" />
          <p className="text-base font-medium">Drop a PDF or click to browse</p>
          <p className="text-xs text-muted-foreground">up to 30 MB</p>
        </button>
      ) : !outputID ? (
        // Working state — page picker + page preview + signature pad + place.
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Page preview + thumbnails */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate font-medium">{pdfFile.name}</span>
              <button type="button" onClick={reset} className="text-xs text-muted-foreground hover:text-destructive">
                Reset
              </button>
            </div>

            {!thumbs ? (
              <div className="flex h-72 items-center justify-center rounded-xl border bg-background">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Active page */}
                <div
                  ref={previewWrapRef}
                  onClick={onPagePreviewClick}
                  className="relative cursor-crosshair overflow-hidden rounded-xl border bg-white shadow-sm"
                  style={{ aspectRatio: `${pageW}/${pageH}` }}
                >
                  {thumbs[activePage - 1] && (
                    // Disable next/image because we have base64 data URLs from the API
                    // and an aspect-ratio container — no width/height needed.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbs[activePage - 1]} alt={`Page ${activePage}`} className="h-full w-full object-contain" />
                  )}
                  {placement && sigDataUrl && (
                    <div
                      className="pointer-events-none absolute"
                      style={{
                        // Show preview at click point. Same X/Y -> screen conversion
                        // is implicit because we placed at click coords.
                        left: `${(placement.x / pageW) * 100}%`,
                        bottom: `${(placement.y / pageH) * 100}%`,
                        width: `${(180 / pageW) * 100}%`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sigDataUrl} alt="Signature preview" className="w-full" />
                    </div>
                  )}
                  {!placement && sigDataUrl && (
                    <div className="absolute inset-0 grid place-items-center bg-foreground/10 text-xs font-semibold text-foreground">
                      Click anywhere on the page to place your signature
                    </div>
                  )}
                </div>

                {/* Page selector */}
                {thumbs.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {thumbs.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setActivePage(i + 1); setPlacement(null); }}
                        className={`shrink-0 rounded-md border-2 transition-colors ${
                          activePage === i + 1 ? "border-primary" : "border-transparent hover:border-border"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`p${i + 1}`} className="h-20 w-16 rounded object-cover" />
                        <span className="block text-center text-[10px] text-muted-foreground">{i + 1}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Signature pad */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Signature</p>

            {/* Mode tabs */}
            <div className="flex gap-1 rounded-full border bg-secondary/40 p-1">
              {(["draw", "type", "upload"] as SigMode[]).map((m) => {
                const Icon = m === "draw" ? Pen : m === "type" ? TypeIcon : UploadIcon;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setSigMode(m); setSigDataUrl(null); }}
                    className={`inline-flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold transition-colors ${
                      sigMode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" /> {m}
                  </button>
                );
              })}
            </div>

            {sigMode === "draw" && (
              <div>
                <canvas
                  ref={drawCanvasRef}
                  width={300}
                  height={120}
                  className="w-full cursor-crosshair touch-none rounded-lg border bg-white"
                  onMouseDown={startDraw}
                  onMouseMove={moveDraw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={moveDraw}
                  onTouchEnd={endDraw}
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sign with your mouse or finger</span>
                  <button type="button" onClick={clearDraw} className="font-medium text-primary hover:underline">Clear</button>
                </div>
              </div>
            )}

            {sigMode === "type" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => commitTyped(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  maxLength={40}
                />
                {sigDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sigDataUrl} alt="Typed signature preview" className="h-16 w-full rounded border bg-white object-contain p-2" />
                )}
              </div>
            )}

            {sigMode === "upload" && (
              <div>
                <button
                  type="button"
                  onClick={pickSigFile}
                  className="w-full rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6 text-center text-sm transition-colors hover:border-primary/40"
                >
                  {sigDataUrl ? "Choose another image" : "Upload PNG of your signature"}
                </button>
                {sigDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sigDataUrl} alt="Uploaded signature" className="mt-2 h-16 w-full rounded border bg-white object-contain p-2" />
                )}
              </div>
            )}

            <div className="rounded-xl border bg-secondary/30 p-3 text-xs text-muted-foreground">
              {placement ? (
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Placed on page {activePage}</span>
              ) : sigDataUrl ? (
                <span>Now click the page preview to place this signature.</span>
              ) : (
                <span>Build a signature in draw, type, or upload mode.</span>
              )}
            </div>

            <Button size="lg" disabled={busy || !sigDataUrl || !placement} onClick={submit}>
              {busy ? (<><Loader2 className="mr-2 size-4 animate-spin" /> Signing…</>) : <>Sign PDF →</>}
            </Button>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Done state — let the user download or sign another.
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle2 className="size-10 text-primary" />
          <div>
            <p className="text-lg font-bold">Signed</p>
            <p className="mt-1 text-sm text-muted-foreground">auto-deletes in 1 hour</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => downloadFile(outputID!, `signed-${pdfFile?.name ?? "result.pdf"}`)}>
              <Download className="mr-2 size-4" /> Download signed PDF
            </Button>
            <Button variant="outline" onClick={reset}>
              <Trash2 className="mr-2 size-4" /> Sign another
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// Pointer helper — translates touch / mouse events to canvas coords
function pointerXY(e: React.MouseEvent | React.TouchEvent, c: HTMLCanvasElement) {
  const r = c.getBoundingClientRect();
  const sx = c.width / r.width;
  const sy = c.height / r.height;
  if ("touches" in e) {
    const t = e.touches[0] ?? e.changedTouches[0];
    if (!t) return { x: 0, y: 0 };
    return { x: (t.clientX - r.left) * sx, y: (t.clientY - r.top) * sy };
  }
  return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
}
