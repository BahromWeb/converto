"use client";

import { useRef, useState } from "react";
import {
  Layers,
  Type,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";

const positions = [
  { code: "c", label: "Center" },
  { code: "tl", label: "Top-left" },
  { code: "tr", label: "Top-right" },
  { code: "bl", label: "Bottom-left" },
  { code: "br", label: "Bottom-right" },
];

export function WatermarkCard() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState("c");
  const [opacity, setOpacity] = useState(0.15);
  const [rotation, setRotation] = useState(-35);
  const inputRef = useRef<HTMLInputElement>(null);
  const runner = useJobRunner();

  function pickFile() {
    inputRef.current?.click();
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      runner.reset();
    }
  }
  function discard() {
    setFile(null);
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  async function onApply() {
    if (!file || !text.trim()) return;
    await runner.run(
      [file],
      (ids) => ({
        input_file_id: ids[0],
        mode: "text",
        text,
        position,
        opacity,
        rotation,
        pages: "all",
      }),
      "watermark",
    );
  }

  const busy = runner.phase === "uploading" || runner.phase === "running";

  return (
    <Card className="p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={onFileChange}
      />

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-4">
          <div className="relative min-h-80 flex-1 overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded bg-muted"
                  style={{ width: `${60 + (i * 7) % 35}%` }}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p
                className="select-none text-5xl font-black uppercase tracking-widest text-foreground/10"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  opacity: Math.max(opacity * 2, 0.08),
                }}
              >
                {text || "DRAFT"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={pickFile}
            className="flex w-full items-center justify-between rounded-lg border-2 border-dashed border-border bg-secondary/20 px-4 py-3 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex items-center gap-3">
              <Upload className="size-4 text-muted-foreground" />
              <span className="truncate text-sm font-medium">
                {file ? file.name : "Drop a PDF or click to browse"}
              </span>
            </span>
            {file ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  discard();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    discard();
                  }
                }}
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
                aria-label="Remove file"
              >
                <Trash2 className="size-4" />
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">up to 30 MB</span>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary"
            >
              <Type className="size-4" /> Text
            </button>
          </div>

          <div>
            <label htmlFor="wm-text" className="block text-sm font-semibold text-foreground">
              Watermark text
            </label>
            <input
              id="wm-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="wm-opacity" className="block text-sm font-semibold text-foreground">
              Opacity
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="wm-opacity"
                type="range"
                min={5}
                max={100}
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(parseInt(e.target.value, 10) / 100)}
                className="flex-1"
              />
              <span className="font-mono text-sm font-semibold text-primary">
                {Math.round(opacity * 100)}%
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="wm-rotation" className="block text-sm font-semibold text-foreground">
              Rotation
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="wm-rotation"
                type="range"
                min={-90}
                max={90}
                step={5}
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="flex-1"
              />
              <span className="font-mono text-sm font-semibold text-primary">
                {rotation > 0 ? `+${rotation}` : rotation}°
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="wm-position" className="block text-sm font-semibold text-foreground">
              Position
            </label>
            <select
              id="wm-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {positions.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!file || !text.trim() || busy}
            onClick={onApply}
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {runner.phase === "uploading" ? "Uploading…" : "Applying…"}
              </>
            ) : (
              <>
                <Layers className="mr-1.5 size-4" />
                Apply watermark →
              </>
            )}
          </Button>
        </div>
      </div>

      {runner.phase === "done" && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Done · auto-deletes in 5 min
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={discard}>
              <Trash2 className="mr-1.5 size-4" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={() =>
                runner.download(`watermarked-${file?.name ?? "result.pdf"}`)
              }
            >
              <Download className="mr-1.5 size-4" />
              Download watermarked PDF
            </Button>
          </div>
        </div>
      )}

      {runner.phase === "failed" && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Watermark failed</p>
            <p className="text-muted-foreground">{runner.error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={runner.reset}>
            Try again
          </Button>
        </div>
      )}
    </Card>
  );
}
