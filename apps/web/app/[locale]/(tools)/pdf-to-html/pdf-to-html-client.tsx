"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

export function PdfToHtmlClient() {
  return (
    <SimpleToolClient
      op="pdf-to-html"
      cta="Convert to HTML →"
      resultFilename={(f) => (f?.name ?? "result").replace(/\.pdf$/i, "") + ".html"}
      downloadLabel="Download .html"
    />
  );
}
