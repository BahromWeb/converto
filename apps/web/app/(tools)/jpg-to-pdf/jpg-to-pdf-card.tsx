"use client";

import { useRef, useState } from "react";
// eslint-disable-next-line @next/next/no-img-element
import {
  Image as ImageIcon,
  ArrowRight,
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

export function JpgToPdfCard() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const runner = useJobRunner();

  function pickFile() {
    inputRef.current?.click();
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    setFiles((prev) => {
      const next = [...prev, ...picked].slice(0, 50);
      setPreviews(next.map((f) => URL.createObjectURL(f)));
      return next;
    });
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  function removeAt(i: number) {
    setFiles((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      setPreviews(next.map((f) => URL.createObjectURL(f)));
      return next;
    });
    runner.reset();
  }
  function discardAll() {
    setFiles([]);
    setPreviews([]);
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  async function onConvert() {
    if (!files.length) return;
    await runner.run(files, (ids) => ({ input_file_ids: ids }), "jpg-to-pdf");
  }

  const busy = runner.phase === "uploading" || runner.phase === "running";

  return (
    <Card className="p-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        hidden
        onChange={onFileChange}
      />

      <button
        type="button"
        onClick={pickFile}
        className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-10 text-center transition-colors hover:border-primary/40"
      >
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50">
          <ImageIcon className="size-7 text-emerald-600" />
        </div>
        <div>
          <p className="font-bold text-foreground">Drop your images here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            JPG, PNG, WEBP — up to 50 images at once
          </p>
        </div>
        <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Select images
        </span>
      </button>

      <div className="mt-8 grid grid-cols-4 gap-3 md:grid-cols-6">
        {files.map((f, i) => (
          <div
            key={`${f.name}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-secondary"
          >
            {previews[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previews[i]}
                alt={f.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="size-6 text-muted-foreground/40" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 hidden h-6 w-6 place-items-center rounded-full bg-destructive text-background group-hover:grid"
              aria-label={`Remove ${f.name}`}
            >
              <Trash2 className="size-3" />
            </button>
            <span className="absolute bottom-1 right-1 rounded bg-foreground/70 px-1.5 py-0.5 font-mono text-[10px] text-background">
              {i + 1}
            </span>
          </div>
        ))}
        {/* placeholder mockup tiles when empty */}
        {files.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="relative aspect-square overflow-hidden rounded-lg border bg-secondary opacity-40"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="size-6 text-muted-foreground/40" />
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-foreground/70 px-1.5 py-0.5 font-mono text-[10px] text-background">
                {i + 1}
              </span>
            </div>
          ))}
        <button
          type="button"
          onClick={pickFile}
          className="grid aspect-square place-items-center rounded-lg border-2 border-dashed text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <span className="flex flex-col items-center gap-1">
            <Plus className="size-5" />
            Add
          </span>
        </button>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-foreground p-5 text-background md:flex-row md:items-center">
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider">
          <span>
            <span className="text-primary">{files.length}</span> images
          </span>
          <span className="flex items-center gap-2">
            <ArrowRight className="size-3" />
            <span className="text-primary">1</span> PDF
          </span>
        </div>
        <Button
          size="lg"
          disabled={!files.length || files.length > 50 || busy}
          onClick={onConvert}
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {runner.phase === "uploading" ? "Uploading…" : "Building…"}
            </>
          ) : (
            <>Create PDF →</>
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
            <Button size="sm" onClick={() => runner.download("images.pdf")}>
              <Download className="mr-1.5 size-4" />
              Download PDF
            </Button>
          </div>
        </div>
      )}

      {runner.phase === "failed" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Build failed</p>
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
