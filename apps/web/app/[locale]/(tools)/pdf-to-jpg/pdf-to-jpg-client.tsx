"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

/** Every page → one JPG, plus a ZIP of all of them. */
export function PdfToJpgClient() {
  return (
    <SimpleToolClient
      op="pdf-to-jpg"
      cta="Convert to JPG →"
      resultFilename={(f) => (f?.name ?? "result").replace(/\.pdf$/i, "") + ".zip"}
      downloadLabel="Download ZIP"
    />
  );
}
