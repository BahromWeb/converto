"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

export function ExcelToPdfClient() {
  return (
    <SimpleToolClient
      op="excel-to-pdf"
      cta="Convert to PDF →"
      accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      resultFilename={(f) => (f?.name ?? "result").replace(/\.xlsx?$/i, "") + ".pdf"}
      downloadLabel="Download PDF"
    />
  );
}
