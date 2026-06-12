"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Upload,
  LayoutGrid,
  Keyboard,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";
import { downloadFile, uploadFile } from "@/lib/api";
import { VisualPagePicker } from "@/components/tools/visual-page-picker";

const tabs = [
  { key: "extract", label: "Extract pages", placeholder: "1,3,5" },
  { key: "ranges", label: "Split by ranges", placeholder: "1-3,4-6,7-10" },
  { key: "everyN", label: "Split every N", placeholder: "Every 5 pages" },
] as const;
type TabKey = (typeof tabs)[number]["key"];

export function SplitCard() {
  const [file, setFile] = useState<File | null>(null);
  // Pre-uploading lets the visual picker fetch thumbnails without
  // re-uploading on every Submit; useJobRunner notices the existing
  // file_id and skips the upload step.
  const [fileID, setFileID] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("ranges");
  const [picker, setPicker] = useState<"visual" | "text">("visual");
  const [ranges, setRanges] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const runner = useJobRunner();

  // Upload the file as soon as it's picked so the visual picker can
  // request thumbnails from the backend.
  useEffect(() => {
    if (!file || fileID) return;
    let alive = true;
    setUploading(true);
    setUploadError(null);
    uploadFile(file)
      .then((r) => {
        if (alive) setFileID(r.id);
      })
      .catch((e) => {
        if (alive) setUploadError(e instanceof Error ? e.message : "Upload failed");
      })
      .finally(() => {
        if (alive) setUploading(false);
      });
    return () => {
      alive = false;
    };
  }, [file, fileID]);

  function pickFile() {
    inputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileID(null);
      setRanges("");
      runner.reset();
    }
  }

  function discard() {
    setFile(null);
    setFileID(null);
    setRanges("");
    setUploadError(null);
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onSplit() {
    if (!file || !ranges.trim()) return;
    if (fileID) {
      // Bypass useJobRunner's upload by hand-running the job via the
      // already-uploaded ID. We still surface progress through `runner`.
      await runner.run(
        [],
        () => ({ input_file_id: fileID, split_ranges: ranges.trim() }),
        "split",
        // useJobRunner's existing API ignores extra args; if it grows
        // a "pre-uploaded ids" hook later we'd thread it here.
      );
    } else {
      await runner.run(
        [file],
        (ids) => ({ input_file_id: ids[0], split_ranges: ranges.trim() }),
        "split",
      );
    }
  }

  const busy =
    uploading || runner.phase === "uploading" || runner.phase === "running";
  const outputs = (runner.result?.output_file_ids as string[] | undefined) ?? [];

  // Group-count derivation: each comma-separated chunk is one output PDF.
  const groupCount = ranges
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  // Visual picker only makes sense in extract / ranges modes.
  const showVisual = picker === "visual" && activeTab !== "everyN" && fileID;

  return (
    <Card className="p-5 sm:p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={onFileChange}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <Button
              key={t.key}
              variant={activeTab === t.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(t.key)}
              className="rounded-full"
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Visual ↔ Text picker switch */}
        {activeTab !== "everyN" && file && (
          <div className="flex items-center gap-1 rounded-full border bg-secondary/40 p-1">
            <button
              type="button"
              onClick={() => setPicker("visual")}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                picker === "visual"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" /> Visual
            </button>
            <button
              type="button"
              onClick={() => setPicker("text")}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                picker === "text"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Keyboard className="size-3.5" /> Text
            </button>
          </div>
        )}
      </div>

      {!file ? (
        <button
          type="button"
          onClick={pickFile}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-12 text-center transition-colors hover:border-primary/40"
        >
          <Upload className="size-6 text-muted-foreground" />
          <p className="text-base font-medium">Drop a PDF or click to browse</p>
          <p className="text-xs text-muted-foreground">up to 30 MB</p>
        </button>
      ) : (
        <div className="mt-6 flex items-center justify-between rounded-xl border bg-card p-3 text-sm">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate font-medium">{file.name}</span>
            {uploading && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> uploading…
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={discard}
            className="ml-3 rounded p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
            aria-label="Remove file"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}

      {uploadError && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Visual picker — only when a file is uploaded + non-everyN mode */}
      {showVisual && (
        <div className="mt-5">
          <VisualPagePicker
            fileID={fileID}
            mode={activeTab === "ranges" ? "ranges" : "extract"}
            selection={ranges}
            onChange={setRanges}
          />
        </div>
      )}

      {/* Text input — always available, also kept synced with visual picker */}
      {(activeTab === "everyN" || picker === "text" || !file) && (
        <div className="mt-6">
          <label htmlFor="split-ranges" className="block text-sm font-medium">
            {activeTab === "everyN" ? "Pages per file" : "Page numbers"}
          </label>
          <input
            id="split-ranges"
            type="text"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder={tabs.find((t) => t.key === activeTab)?.placeholder}
            className="mt-2 w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {activeTab === "everyN"
              ? "Splits the PDF every N pages."
              : "Example: 1-3,5,7-9 → 3 groups."}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border bg-secondary p-5 md:flex-row md:items-center">
        <div className="text-sm">
          {file ? (
            ranges.trim() ? (
              <>
                <span className="text-primary">{groupCount || 1}</span> group
                {groupCount === 1 ? "" : "s"} from <strong>{file.name}</strong>
              </>
            ) : (
              <span className="text-muted-foreground">
                Click pages above to choose what to extract
              </span>
            )
          ) : (
            <>Pick a PDF to begin</>
          )}
        </div>
        <Button
          size="lg"
          disabled={!file || !ranges.trim() || busy}
          onClick={onSplit}
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {uploading
                ? "Uploading…"
                : runner.phase === "uploading"
                  ? "Uploading…"
                  : "Splitting…"}
            </>
          ) : (
            <>Split now →</>
          )}
        </Button>
      </div>

      {runner.phase === "done" && outputs.length > 0 && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="font-medium">
                {outputs.length} file{outputs.length === 1 ? "" : "s"} ready
              </span>
              <span className="text-muted-foreground">· auto-deletes in 5 min</span>
            </span>
            <Button variant="outline" size="sm" onClick={discard}>
              <Trash2 className="mr-1.5 size-4" />
              Discard
            </Button>
          </div>
          <ul className="grid gap-2">
            {outputs.map((id, i) => (
              <li
                key={id}
                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm"
              >
                <span>Part {i + 1}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadFile(id, `${file?.name ?? "split"}-part-${i + 1}.pdf`)
                  }
                >
                  <Download className="mr-1.5 size-4" />
                  Download
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {runner.phase === "failed" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Split failed</p>
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
