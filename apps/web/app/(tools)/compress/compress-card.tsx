"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Upload,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";
import { fileDownloadUrl, type JobRecord } from "@/lib/api";

const presets = [
  { key: "low", name: "Light", desc: "~30% smaller", pct: 30 },
  { key: "medium", name: "Recommended", desc: "~75% smaller", pct: 75 },
  { key: "high", name: "Extreme", desc: "~92% smaller", pct: 92 },
] as const;
type Preset = (typeof presets)[number]["key"];

export function CompressCard() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<Preset>("medium");
  const [outSize, setOutSize] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const runner = useJobRunner();

  const active = presets.find((p) => p.key === preset)!;
  const origMb = file ? file.size / 1024 / 1024 : 24.6;
  const outMb = outSize !== null ? outSize / 1024 / 1024 : origMb * (1 - active.pct / 100);
  const reductionPct =
    file && outSize !== null
      ? Math.max(0, Math.round((1 - outSize / file.size) * 100))
      : active.pct;

  function pickFile() {
    inputRef.current?.click();
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setOutSize(null);
      runner.reset();
    }
  }
  function discard() {
    setFile(null);
    setOutSize(null);
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  async function onCompress() {
    if (!file) return;
    setOutSize(null);
    await runner.run(
      [file],
      (ids) => ({ input_file_id: ids[0], compression: preset }),
      "compress",
    );
  }

  // After the job lands, fetch the output's size so we can show the real ratio.
  async function fetchOutputSize(job: JobRecord) {
    if (!job.output_file_id) return;
    try {
      const r = await fetch(fileDownloadUrl(job.output_file_id), { method: "HEAD" });
      const len = r.headers.get("content-length");
      if (len) setOutSize(parseInt(len, 10));
    } catch {
      /* swallow — the cosmetic ratio just won't update */
    }
  }
  if (runner.phase === "done" && runner.result && outSize === null) {
    fetchOutputSize(runner.result);
  }

  const busy = runner.phase === "uploading" || runner.phase === "running";

  return (
    <Card className="grid gap-8 p-8 md:grid-cols-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={onFileChange}
      />

      {/* LEFT — quality presets + file picker */}
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          → output quality
        </p>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-serif text-4xl sm:text-5xl md:text-6xl text-primary">{reductionPct}</span>
          <span className="font-serif text-2xl text-primary">%</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{active.name}</span>
        </p>

        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(100, reductionPct)}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {presets.map((p) => (
            <Button
              key={p.key}
              variant={preset === p.key ? "default" : "outline"}
              size="sm"
              onClick={() => setPreset(p.key)}
              className="flex h-auto flex-col gap-0.5 rounded-xl py-3"
            >
              <span className="text-sm font-semibold">{p.name}</span>
              <span className="text-[11px] opacity-70">{p.desc}</span>
            </Button>
          ))}
        </div>

        {!file ? (
          <button
            type="button"
            onClick={pickFile}
            className="mt-6 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-6 text-center transition-colors hover:border-primary/40"
          >
            <Upload className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">Drop a PDF or click to browse</span>
            <span className="text-xs text-muted-foreground">up to 30 MB</span>
          </button>
        ) : (
          <div className="mt-6 flex items-center justify-between rounded-xl border bg-card p-3 text-sm">
            <span className="truncate font-medium">{file.name}</span>
            <button
              type="button"
              onClick={discard}
              className="ml-3 shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
              aria-label="Remove file"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT — before/after panel + CTA */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 items-center gap-6 rounded-2xl bg-foreground p-6 text-background">
          <div>
            <p className="font-mono text-xs uppercase text-background/60">→ original</p>
            <p className="mt-2 font-serif text-4xl">
              {origMb.toFixed(1)}
              <span className="text-base">MB</span>
            </p>
          </div>
          <div className="text-center">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-background/30">
              <ArrowRight className="size-4" />
            </span>
            <p className="mt-2 font-serif text-lg text-primary">−{reductionPct}%</p>
            <p className="font-mono text-[10px] uppercase text-background/60">reduction</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase text-background/60">→ after</p>
            <p className="mt-2 font-serif text-4xl text-primary">
              {outMb.toFixed(1)}
              <span className="text-base">MB</span>
            </p>
          </div>
        </div>

        <Button size="lg" className="w-full" disabled={!file || busy} onClick={onCompress}>
          {busy ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {runner.phase === "uploading" ? "Uploading…" : "Compressing…"}
            </>
          ) : (
            <>Compress now →</>
          )}
        </Button>

        {runner.phase === "done" && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
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
                  runner.download(`compressed-${file?.name ?? "result.pdf"}`)
                }
              >
                <Download className="mr-1.5 size-4" />
                Download
              </Button>
            </div>
          </div>
        )}

        {runner.phase === "failed" && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <AlertCircle className="mt-0.5 size-4 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Couldn&apos;t compress</p>
              <p className="text-muted-foreground">{runner.error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={runner.reset}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
