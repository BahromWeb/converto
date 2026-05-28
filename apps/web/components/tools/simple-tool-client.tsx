"use client";

import { useState } from "react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { FileDropzone } from "./file-dropzone";
import { JobStatusPanel } from "./job-status";
import { useJobRunner } from "./use-job-runner";

export interface SimpleToolClientProps {
  /** Backend op slug — segment after /api/pdf/ */
  op: string;
  /** Body shape: just `{ input_file_id }` for most conversions. */
  bodyKey?: "input_file_id" | "file_id";
  /** Allowed file types (default = PDF). Override for word/excel/jpg input. */
  accept?: string;
  /** Multi-file mode (jpg-to-pdf) */
  multiple?: boolean;
  /** Button label, e.g. "Convert", "Run OCR", "Detect blank pages". */
  cta: string;
  /** Filename for the downloaded result. */
  resultFilename: (input: File | undefined) => string;
  /** Download button label. */
  downloadLabel?: string;
  /** Extra fields beyond input_file_id — e.g. password, language. */
  extraFields?: React.ReactNode;
  /** Maps uploaded ids + extra state into the request body. */
  buildExtraBody?: () => Record<string, unknown>;
}

/**
 * Catch-all client for "single file in → single file out" tools where
 * the only variable is the upload itself. compress / merge / split need
 * their own components because they have richer forms; everything else
 * (rotate, crop, watermark, ocr, jpg-to-pdf, pdf-to-word, etc.) is
 * structurally identical and routes through this.
 */
export function SimpleToolClient({
  op,
  bodyKey = "input_file_id",
  accept = "application/pdf,.pdf",
  multiple = false,
  cta,
  resultFilename,
  downloadLabel = "Download result",
  extraFields,
  buildExtraBody,
}: SimpleToolClientProps) {
  const [files, setFiles] = useState<File[]>([]);
  const runner = useJobRunner();
  const file = files[0];

  async function onSubmit() {
    if (!files.length) return;
    await runner.run(
      files,
      (ids) => {
        const base = multiple
          ? { input_file_ids: ids }
          : { [bodyKey]: ids[0] };
        return { ...base, ...(buildExtraBody?.() ?? {}) };
      },
      op,
    );
  }

  return (
    <Card className="grid gap-8 p-8">
      <FileDropzone
        files={files}
        onChange={setFiles}
        accept={accept}
        multiple={multiple}
        maxSizeMB={30}
      />

      {extraFields}

      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={
            !files.length || runner.phase === "uploading" || runner.phase === "running"
          }
          onClick={onSubmit}
        >
          {cta}
        </Button>
      </div>

      <JobStatusPanel
        phase={runner.phase}
        error={runner.error}
        onDownload={() => runner.download(resultFilename(file))}
        onReset={runner.reset}
        downloadLabel={downloadLabel}
        outputFileId={runner.result?.output_file_id ?? null}
        filename={resultFilename(file)}
      />
    </Card>
  );
}
