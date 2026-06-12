"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

/** Returns `{ detected_lang, confidence }` — readable on the job record. */
export function OcrDetectLangClient() {
  return (
    <SimpleToolClient
      op="ocr-detect-lang"
      cta="Detect language →"
      resultFilename={(f) => "lang-" + (f?.name ?? "result.json")}
      downloadLabel="Download report"
    />
  );
}
