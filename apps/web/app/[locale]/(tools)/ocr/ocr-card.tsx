"use client";

import { useRef, useState } from "react";
import {
  Eye,
  Sparkles,
  Languages,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";

const langs = [
  { code: "eng", label: "English" },
  { code: "rus", label: "Russian" },
  { code: "uzb", label: "Uzbek (Latin)" },
  { code: "uzb_cyrl", label: "Uzbek (Cyrillic)" },
  { code: "kir", label: "Kyrgyz" },
  { code: "eng+rus", label: "English + Russian" },
  { code: "eng+uzb", label: "English + Uzbek" },
];

export function OcrCard() {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [forceOcr, setForceOcr] = useState(false);
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
  async function onRun() {
    if (!file) return;
    await runner.run(
      [file],
      (ids) => ({ input_file_id: ids[0], lang, force_ocr: forceOcr }),
      "ocr",
    );
  }

  const busy = runner.phase === "uploading" || runner.phase === "running";

  return (
    <Card className="p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf,image/jpeg,image/png,image/tiff,.jpg,.jpeg,.png,.tif,.tiff"
        hidden
        onChange={onFileChange}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <button
            type="button"
            onClick={pickFile}
            className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-10 text-center transition-colors hover:border-primary/40"
          >
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10">
              <Eye className="size-7 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                {file ? file.name : "Drop your scanned PDF"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(1)} MB · click to replace`
                  : "or an image (JPG, PNG, TIFF)"}
              </p>
            </div>
            {!file && (
              <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Select file
              </span>
            )}
          </button>

          <div>
            <label htmlFor="ocr-lang" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Languages className="size-4" /> Document language
            </label>
            <select
              id="ocr-lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {langs.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={forceOcr}
              onChange={(e) => setForceOcr(e.target.checked)}
              className="size-4 accent-primary"
            />
            <span>Re-OCR pages that already have text</span>
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Extracted text preview</p>
          </div>
          <div className="flex-1 rounded-xl border bg-secondary/20 p-5">
            <div className="space-y-2 opacity-40">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded bg-foreground"
                  style={{ width: `${50 + (i * 13) % 45}%` }}
                />
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              {file ? "Click Run OCR to process this file" : "Upload a file to see the extracted text"}
            </p>
          </div>

          <Button size="lg" className="w-full" disabled={!file || busy} onClick={onRun}>
            {busy ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {runner.phase === "uploading" ? "Uploading…" : "Reading…"}
              </>
            ) : (
              <>Run OCR →</>
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
              onClick={() => runner.download(`ocr-${file?.name ?? "result.pdf"}`)}
            >
              <Download className="mr-1.5 size-4" />
              Download searchable PDF
            </Button>
          </div>
        </div>
      )}

      {runner.phase === "failed" && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">OCR failed</p>
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
