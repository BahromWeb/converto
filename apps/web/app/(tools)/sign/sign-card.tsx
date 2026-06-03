"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
type PageMode = "this" | "all" | "picked";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

const SIG_W = 180; // signature width in PDF points — fits a standard signature line
const SIG_H_GUESS = 60; // rough height for preset positioning before the image loads
const MARGIN = 36; // breathing room from the page edges (~0.5")

// 9 quick positions on a page, named like CSS regions. X/Y are in PDF
// points from the page's bottom-left; we resolve them against the
// active page's actual width/height in resolvePreset() below.
type Preset = { id: string; label: string };
const PRESETS: Preset[] = [
  { id: "tl", label: "↖" }, { id: "tc", label: "↑" }, { id: "tr", label: "↗" },
  { id: "ml", label: "←" }, { id: "mc", label: "•" }, { id: "mr", label: "→" },
  { id: "bl", label: "↙" }, { id: "bc", label: "↓" }, { id: "br", label: "↘" },
];

function resolvePreset(id: string, pageW: number, pageH: number) {
  const left = MARGIN;
  const right = pageW - SIG_W - MARGIN;
  const centerX = (pageW - SIG_W) / 2;
  const bottom = MARGIN;
  const top = pageH - SIG_H_GUESS - MARGIN;
  const middle = (pageH - SIG_H_GUESS) / 2;
  switch (id) {
    case "tl": return { x: left,    y: top };
    case "tc": return { x: centerX, y: top };
    case "tr": return { x: right,   y: top };
    case "ml": return { x: left,    y: middle };
    case "mc": return { x: centerX, y: middle };
    case "mr": return { x: right,   y: middle };
    case "bl": return { x: left,    y: bottom };
    case "bc": return { x: centerX, y: bottom };
    case "br": return { x: right,   y: bottom };
    default:   return { x: centerX, y: bottom };
  }
}

export function SignCard() {
  // --- file state ---
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfID, setPdfID] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<string[] | null>(null);
  const [pageW, setPageW] = useState<number>(595);
  const [pageH, setPageH] = useState<number>(842);
  const [activePage, setActivePage] = useState<number>(1);

  // --- pages selection ---
  const [pageMode, setPageMode] = useState<PageMode>("this");
  const [pickedPages, setPickedPages] = useState<Set<number>>(new Set());

  // --- signature state ---
  const [sigMode, setSigMode] = useState<SigMode>("draw");
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
  const [typedName, setTypedName] = useState<string>("");
  const [placement, setPlacement] = useState<{ x: number; y: number; preset?: string } | null>(null);

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
    setPickedPages(new Set());
    setPlacement(null);
    setOutputID(null);
    setError(null);
  }

  useEffect(() => {
    if (!pdfFile) return;
    let alive = true;
    setBusy(true);
    uploadFile(pdfFile)
      .then(async (r) => {
        // setPdfID re-renders but doesn't retrigger this effect because the
        // deps below are [pdfFile] only — that's intentional, so the
        // thumbnail fetch below isn't stranded by the re-render.
        if (!alive) return;
        setPdfID(r.id);

        const res = await fetch(`${API_BASE}/api/pdf/thumbnails`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_id: r.id, max_pages: 50, max_width: 1200 }),
        });
        const txt = await res.text();
        if (!alive) return;
        if (!res.ok) {
          setError(`thumbnails failed (${res.status}): ${txt.slice(0, 80) || "empty"}`);
          setThumbs([]); // bail out of the loader; the user can pick a new PDF
          return;
        }
        let j: { Description?: string; Data?: { pages?: unknown[] } };
        try { j = txt ? JSON.parse(txt) : {}; }
        catch { setError("thumbnails returned invalid JSON"); setThumbs([]); return; }
        const data = j.Data;
        if (!data?.pages) {
          setError(j.Description ?? "thumbnail fetch failed");
          setThumbs([]);
          return;
        }
        type ThumbPage = { n?: number; data?: string };
        const list = (data.pages as ThumbPage[]).map((p) =>
          p.data ? "data:image/jpeg;base64," + p.data : ""
        );
        setThumbs(list);
        // Probe natural dimensions of the first thumb so the preview
        // container matches the real page aspect ratio.
        const firstSrc = list[0];
        if (firstSrc) {
          const img = new Image();
          img.onload = () => {
            const ratio = img.naturalHeight / img.naturalWidth;
            setPageW(595);
            setPageH(595 * ratio);
          };
          img.src = firstSrc;
        }
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "upload failed");
      })
      .finally(() => { if (alive) setBusy(false); });
    return () => { alive = false; };
  }, [pdfFile]);

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

  // ---------- Step 3: place + select pages + submit ----------
  function applyPreset(id: string) {
    const { x, y } = resolvePreset(id, pageW, pageH);
    setPlacement({ x, y, preset: id });
    setError(null);
  }

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
    const ratioX = pageW / rect.width;
    const ratioY = pageH / rect.height;
    const x = px * ratioX;
    const y = (rect.height - py) * ratioY - 30; // nudge so click point feels like centre
    setPlacement({ x, y });
  }

  // Toggle a page in the "Picked" selection mode.
  function togglePicked(p: number) {
    setPickedPages((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  }

  const pagesSelector = useMemo(() => {
    if (pageMode === "all") return "all";
    if (pageMode === "picked") {
      const picked = Array.from(pickedPages).sort((a, b) => a - b);
      return picked.length ? picked.join(",") : String(activePage);
    }
    return String(activePage);
  }, [pageMode, pickedPages, activePage]);

  async function submit() {
    if (!pdfID || !sigDataUrl || !placement) {
      setError("Pick a PDF, build a signature, and choose where to place it");
      return;
    }
    if (pageMode === "picked" && pickedPages.size === 0) {
      setError("Pick at least one page or switch to All / This page");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Defensive: re-upload PDF if its server-side copy might have expired
      // (auto-delete TTL is 1h, so on long sessions the old pdfID 500/404s).
      const sigBlob = await (await fetch(sigDataUrl)).blob();
      if (!sigBlob || sigBlob.size === 0) {
        throw new Error("signature image is empty — try drawing again");
      }
      const sigFile = new File([sigBlob], "signature.png", { type: "image/png" });
      const sigUp = await uploadFile(sigFile);
      if (!sigUp?.id) throw new Error("signature upload returned no id");

      const body = {
        input_file_id: pdfID,
        signature_file_id: sigUp.id,
        pages: pagesSelector,
        x: Math.max(0, Math.round(placement.x)),
        y: Math.max(0, Math.round(placement.y)),
        width: SIG_W,
      };
      const res = await fetch(`${API_BASE}/api/pdf/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const txt = await res.text();
      if (!res.ok) {
        // Surface validation details so the user sees WHY it failed
        // instead of a generic "Failed to fetch".
        let detail = txt || `HTTP ${res.status}`;
        try {
          const j = JSON.parse(txt);
          detail = j.Description ?? detail;
          if (j.Data && typeof j.Data === "object") {
            const errs = (j.Data as { errors?: Record<string, string> }).errors;
            if (errs) detail += ": " + Object.values(errs).join("; ");
          }
        } catch {}
        // If the PDF expired server-side, prompt for re-upload instead of
        // sending the user back to the dropzone with no explanation.
        if (detail.toLowerCase().includes("not found") || detail.toLowerCase().includes("file")) {
          throw new Error(detail + " — try re-uploading the PDF");
        }
        throw new Error(detail);
      }
      let j: { Data?: { id?: string }; Description?: string };
      try { j = JSON.parse(txt); } catch { throw new Error("server returned invalid JSON"); }
      const jobID = j.Data?.id;
      if (!jobID) throw new Error(j.Description ?? "sign failed");

      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const rr = await fetch(`${API_BASE}/api/pdf/sign/${jobID}`);
        const jj = await rr.json();
        const d = jj.Data;
        const status = d?.Status ?? d?.status;
        if (status === "done") {
          const out = d?.OutputFileID ?? d?.output_file_id;
          if (out) { setOutputID(out); return; }
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
    setPickedPages(new Set()); setPageMode("this");
    setSigDataUrl(null); setTypedName(""); setPlacement(null);
    setOutputID(null); setError(null);
  }

  // ---------- Render ----------
  return (
    <Card className="p-5 sm:p-8">
      <input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={onPDFChange} />
      <input ref={sigInputRef} type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" hidden onChange={onSigFileChange} />

      {!pdfFile ? (
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
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
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
            ) : thumbs.length === 0 ? (
              <div className="flex h-72 items-center justify-center rounded-xl border bg-background text-center text-sm text-muted-foreground">
                Couldn't load page previews. Try a different PDF.
              </div>
            ) : (
              <>
                <div
                  ref={previewWrapRef}
                  onClick={onPagePreviewClick}
                  className="relative cursor-crosshair overflow-hidden rounded-xl border bg-white shadow-sm"
                  style={{ aspectRatio: `${pageW}/${pageH}` }}
                >
                  {thumbs[activePage - 1] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbs[activePage - 1]} alt={`Page ${activePage}`} className="h-full w-full object-contain" />
                  )}
                  {placement && sigDataUrl && (
                    <div
                      className="pointer-events-none absolute"
                      style={{
                        left: `${(placement.x / pageW) * 100}%`,
                        bottom: `${(placement.y / pageH) * 100}%`,
                        width: `${(SIG_W / pageW) * 100}%`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sigDataUrl} alt="Signature preview" className="w-full" />
                    </div>
                  )}
                </div>

                {thumbs.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {thumbs.map((src, i) => {
                      const n = i + 1;
                      const isActive = activePage === n;
                      const isPicked = pickedPages.has(n);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (pageMode === "picked") togglePicked(n);
                            else { setActivePage(n); setPlacement(null); }
                          }}
                          className={`relative shrink-0 rounded-md border-2 transition-colors ${
                            isActive ? "border-primary"
                            : isPicked ? "border-emerald-500"
                            : "border-transparent hover:border-border"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`p${n}`} className="h-20 w-16 rounded object-cover" />
                          <span className="block text-center text-[10px] text-muted-foreground">{n}</span>
                          {isPicked && (
                            <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right column — signature + page choice + position presets */}
          <div className="flex flex-col gap-4">
            {/* Signature mode */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Signature</p>
              <div className="mt-2 flex gap-1 rounded-full border bg-secondary/40 p-1">
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

              <div className="mt-2">
                {sigMode === "draw" && (
                  <div>
                    <canvas
                      ref={drawCanvasRef}
                      width={300}
                      height={100}
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
                      <span className="text-muted-foreground">Sign with mouse or finger</span>
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
                      <img src={sigDataUrl} alt="Signature preview" className="h-12 w-full rounded border bg-white object-contain p-1" />
                    )}
                  </div>
                )}
                {sigMode === "upload" && (
                  <div>
                    <button
                      type="button"
                      onClick={pickSigFile}
                      className="w-full rounded-lg border-2 border-dashed border-border bg-secondary/20 p-4 text-center text-xs transition-colors hover:border-primary/40"
                    >
                      {sigDataUrl ? "Choose another image" : "Upload PNG/JPG"}
                    </button>
                    {sigDataUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sigDataUrl} alt="Uploaded signature" className="mt-2 h-12 w-full rounded border bg-white object-contain p-1" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Page selection */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pages</p>
              <div className="mt-2 flex gap-1 rounded-full border bg-secondary/40 p-1">
                {(["this", "all", "picked"] as PageMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPageMode(m)}
                    className={`inline-flex flex-1 items-center justify-center rounded-full px-2 py-1.5 text-xs font-semibold transition-colors ${
                      pageMode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "this" ? "This page" : m === "all" ? "All pages" : "Pick pages"}
                  </button>
                ))}
              </div>
              {pageMode === "picked" && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Tap thumbnails below to toggle — {pickedPages.size} selected.
                </p>
              )}
            </div>

            {/* Position presets */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick position</p>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {PRESETS.map((p) => {
                  const active = placement?.preset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p.id)}
                      className={`grid aspect-square place-items-center rounded-lg border text-base font-bold transition-colors ${
                        active ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 hover:bg-primary/5"
                      }`}
                      aria-label={`Position ${p.id}`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Or click anywhere on the page preview to place exactly.
              </p>
            </div>

            {/* Summary + submit */}
            <div className="rounded-xl border bg-secondary/30 p-3 text-xs text-muted-foreground">
              {!sigDataUrl ? (
                <span>Build a signature above.</span>
              ) : !placement ? (
                <span>Now pick a quick position or click the preview.</span>
              ) : (
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" />
                  {pageMode === "all" ? "All pages" : pageMode === "picked" ? `${pickedPages.size || 1} page(s)` : `Page ${activePage}`}
                </span>
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
