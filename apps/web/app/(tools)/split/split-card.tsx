"use client";

import { useRef, useState } from "react";
import {
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
import { downloadFile } from "@/lib/api";

const tabs = [
  { key: "extract", label: "Extract pages", placeholder: "1,3,5" },
  { key: "ranges", label: "Split by ranges", placeholder: "1-3,4-6,7-10" },
  { key: "everyN", label: "Split every N", placeholder: "Every 5 pages" },
] as const;
type TabKey = (typeof tabs)[number]["key"];

export function SplitCard() {
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("ranges");
  const [ranges, setRanges] = useState("1-3,4-5");
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
  async function onSplit() {
    if (!file || !ranges.trim()) return;
    await runner.run(
      [file],
      (ids) => ({ input_file_id: ids[0], split_ranges: ranges.trim() }),
      "split",
    );
  }

  const busy = runner.phase === "uploading" || runner.phase === "running";
  const outputs = (runner.result?.output_file_ids as string[] | undefined) ?? [];

  return (
    <Card className="p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={onFileChange}
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <Button
            key={t.key}
            variant={activeTab === t.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(t.key)}
            className="rounded-full"
          >
            <span className="mr-1 font-mono text-[10px] opacity-60">0{i + 1}</span> {t.label}
          </Button>
        ))}
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
        <div className="mt-8 flex items-center justify-between rounded-xl border bg-card p-3 text-sm">
          <span className="truncate font-medium">{file.name}</span>
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

      <div className="mt-6">
        <label htmlFor="split-ranges" className="block text-sm font-medium">
          Page ranges
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
          Each group becomes its own PDF. Example: <code>1-3,5,7-9</code> → 3 files.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border bg-secondary p-5 md:flex-row md:items-center">
        <div className="text-sm">
          {file ? (
            <>
              <span className="text-primary">{ranges.split(",").length}</span> group
              {ranges.split(",").length === 1 ? "" : "s"} from{" "}
              <strong>{file.name}</strong>
            </>
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
              {runner.phase === "uploading" ? "Uploading…" : "Splitting…"}
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
              <span className="font-medium">{outputs.length} file{outputs.length === 1 ? "" : "s"} ready</span>
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
