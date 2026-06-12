"use client";

import { useRef, useState } from "react";
import {
  FileText,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";

const features = [
  "Preserves fonts, tables, and layouts",
  "Editable .docx output",
  "No watermarks",
];

/**
 * Single integrated card for PDF→Word. Keeps Bahrom's marketing layout
 * (left = upload zone, right = features + format ribbon + CTA) and
 * wires the buttons to the real backend job pipeline. Replaces the
 * previous two-card setup (static mockup + separate functional widget)
 * — having both confused users who tried the bottom one and wondered
 * why the top one did nothing.
 */
export function PdfToWordCard() {
  const [file, setFile] = useState<File | null>(null);
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

  async function onConvert() {
    if (!file) return;
    await runner.run([file], (ids) => ({ input_file_id: ids[0] }), "pdf-to-word");
  }

  const busy = runner.phase === "uploading" || runner.phase === "running";
  const done = runner.phase === "done";
  const failed = runner.phase === "failed";

  return (
    <Card className="p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={onFileChange}
      />

      <div className="grid gap-10 md:grid-cols-2">
        {/* Upload zone */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={pickFile}
            className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-10 text-center transition-colors hover:border-primary/40"
          >
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50">
              <FileText className="size-7 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                {file ? file.name : "Drop your PDF here"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(1)} MB · click to replace`
                  : "or click to browse · up to 30 MB"}
              </p>
            </div>
            {!file && (
              <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Select PDF
              </span>
            )}
          </button>

          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                runner.reset();
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="flex items-center justify-center gap-1.5 self-start rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" /> Remove file
            </button>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col justify-center gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              What you get
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-2xl bg-foreground p-5 text-background">
            <div className="text-center">
              <p className="font-mono text-xs uppercase text-background/60">Input</p>
              <p className="mt-1 font-bold">.PDF</p>
            </div>
            <ArrowRight className="size-5 text-primary" />
            <div className="text-center">
              <p className="font-mono text-xs uppercase text-background/60">Output</p>
              <p className="mt-1 font-bold text-primary">.DOCX</p>
            </div>
          </div>

          <Button size="lg" className="w-full" disabled={!file || busy} onClick={onConvert}>
            {busy ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {runner.phase === "uploading" ? "Uploading…" : "Converting…"}
              </>
            ) : (
              <>Convert to Word →</>
            )}
          </Button>
        </div>
      </div>

      {(done || failed) && (
        <div className="mt-6 border-t pt-6">
          {done && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-primary" />
                <span className="font-medium">Done.</span>
                <span className="text-muted-foreground">
                  Auto-deleted in 5 minutes — save it now.
                </span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    runner.reset();
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <Trash2 className="mr-1.5 size-4" />
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    runner.download(
                      (file?.name ?? "result").replace(/\.pdf$/i, "") + ".docx",
                    )
                  }
                >
                  <Download className="mr-1.5 size-4" />
                  Download .docx
                </Button>
              </div>
            </div>
          )}
          {failed && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <AlertCircle className="mt-0.5 size-4 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Conversion failed</p>
                <p className="mt-1 text-muted-foreground">{runner.error}</p>
              </div>
              <Button size="sm" variant="outline" onClick={runner.reset}>
                Try again
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
