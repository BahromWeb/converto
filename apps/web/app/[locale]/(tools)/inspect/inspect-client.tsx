"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { uploadFile, api } from "@/lib/api";

interface InspectResult {
  id: string;
  status: string;
  page_count?: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
}

/**
 * Inspect is the one synchronous PDF op — POST returns the full
 * InspectJob (id, page_count, title, author, ...) in a single
 * round-trip, no polling. Rendered separately from SimpleToolClient
 * because there's no output file to download, just a structured
 * result to display.
 */
export function InspectClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "failed">("idle");
  const [result, setResult] = useState<InspectResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const file = files[0];

  async function onSubmit() {
    if (!file) return;
    setPhase("running");
    setError(null);
    setResult(null);
    try {
      const up = await uploadFile(file);
      const res = await api.post<InspectResult>("/api/pdf/inspect", { file_id: up.id });
      if (res.StatusCode >= 400) {
        throw new Error(res.Description ?? "Inspection failed");
      }
      setResult(res.Data);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inspection failed");
      setPhase("failed");
    }
  }

  return (
    <Card className="grid gap-6 p-8">
      <FileDropzone files={files} onChange={setFiles} maxSizeMB={30} />

      <div className="flex justify-end">
        <Button size="lg" disabled={!file || phase === "running"} onClick={onSubmit}>
          Inspect →
        </Button>
      </div>

      {phase === "running" && (
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Reading metadata…</span>
        </div>
      )}

      {phase === "failed" && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Couldn&apos;t read the PDF</p>
            <p className="mt-1 text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {phase === "done" && result && (
        <dl className="grid grid-cols-2 gap-3 rounded-xl border bg-card p-4 text-sm md:grid-cols-3">
          <Row label="Pages" value={result.page_count != null ? String(result.page_count) : "—"} />
          <Row label="Title" value={result.title || "—"} />
          <Row label="Author" value={result.author || "—"} />
          <Row label="Subject" value={result.subject || "—"} />
          <Row label="Keywords" value={result.keywords || "—"} />
        </dl>
      )}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
