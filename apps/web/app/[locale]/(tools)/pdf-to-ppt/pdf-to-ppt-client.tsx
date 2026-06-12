"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

export function PdfToPptClient() {
  return (
    <SimpleToolClient
      op="pdf-to-ppt"
      cta="Convert to PowerPoint →"
      resultFilename={(f) => (f?.name ?? "result").replace(/\.pdf$/i, "") + ".pptx"}
      downloadLabel="Download .pptx"
    />
  );
}
