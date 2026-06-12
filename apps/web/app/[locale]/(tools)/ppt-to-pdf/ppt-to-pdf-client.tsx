"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

export function PptToPdfClient() {
  return (
    <SimpleToolClient
      op="ppt-to-pdf"
      cta="Convert to PDF →"
      accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      resultFilename={(f) => (f?.name ?? "result").replace(/\.pptx?$/i, "") + ".pdf"}
      downloadLabel="Download PDF"
    />
  );
}
