"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";

export function MergeCard() {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const runner = useJobRunner();

  function pickFile() {
    inputRef.current?.click();
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    setFiles((prev) => [...prev, ...picked].slice(0, 50));
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  function removeAt(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    runner.reset();
  }
  function discardAll() {
    setFiles([]);
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  async function onMerge() {
    if (files.length < 2) return;
    await runner.run(files, (ids) => ({ input_file_ids: ids }), "merge");
  }

  const busy = runner.phase === "uploading" || runner.phase === "running";
  const totalMb = (files.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);
  const hint =
    files.length < 2
      ? "Pick at least 2 PDFs"
      : files.length > 50
      ? "Max 50 PDFs"
      : "Output keeps drop order — drop in the order you want";

  return (
    <Card className="p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        hidden
        onChange={onFileChange}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {files.map((f, i) => (
          <div
            key={`${f.name}-${i}`}
            className="group relative aspect-[3/4] rounded-lg border bg-background p-3 text-xs"
          >
            <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -right-2 -top-2 hidden h-6 w-6 place-items-center rounded-full bg-destructive text-background group-hover:grid"
              aria-label={`Remove ${f.name}`}
            >
              <Trash2 className="size-3" />
            </button>
            <FileText className="size-5 text-muted-foreground" />
            <p className="mt-2 truncate font-medium">{f.name}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {(f.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        ))}
        {/* placeholder mockup tiles when nothing's added yet */}
        {files.length === 0 &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="relative aspect-[3/4] rounded-lg border bg-background p-3 text-xs opacity-40"
            >
              <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">
                {i + 1}
              </span>
              <div className="mt-4 h-1 w-full rounded bg-muted" />
              <div className="mt-1 h-1 w-3/4 rounded bg-muted" />
              <div className="mt-1 h-1 w-5/6 rounded bg-muted" />
            </div>
          ))}
        <button
          type="button"
          onClick={pickFile}
          className="grid aspect-[3/4] place-items-center rounded-lg border-2 border-dashed text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <span className="flex flex-col items-center gap-1">
            <Plus className="size-5" />
            {files.length === 0 ? "Add files" : "Add more"}
          </span>
        </button>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-foreground p-5 text-background md:flex-row md:items-center">
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider">
          <span>
            <span className="text-primary">{files.length}</span> files
          </span>
          <span>
            <span className="text-primary">{totalMb}</span> MB total
          </span>
          <span className="text-background/60">{hint}</span>
        </div>
        <Button
          size="lg"
          disabled={files.length < 2 || files.length > 50 || busy}
          onClick={onMerge}
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {runner.phase === "uploading" ? "Uploading…" : "Merging…"}
            </>
          ) : (
            <>Merge now →</>
          )}
        </Button>
      </div>

      {runner.phase === "done" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Done · auto-deletes in 5 min
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={discardAll}>
              <Trash2 className="mr-1.5 size-4" />
              Discard
            </Button>
            <Button size="sm" onClick={() => runner.download("merged.pdf")}>
              <Download className="mr-1.5 size-4" />
              Download merged PDF
            </Button>
          </div>
        </div>
      )}

      {runner.phase === "failed" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Merge failed</p>
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
