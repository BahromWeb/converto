"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

export function PdfToExcelClient() {
  return (
    <SimpleToolClient
      op="pdf-to-excel"
      cta="Convert to Excel →"
      resultFilename={(f) => (f?.name ?? "result").replace(/\.pdf$/i, "") + ".xlsx"}
      downloadLabel="Download .xlsx"
    />
  );
}
