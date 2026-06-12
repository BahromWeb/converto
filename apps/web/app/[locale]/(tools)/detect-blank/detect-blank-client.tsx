"use client";

import { SimpleToolClient } from "@/components/tools/simple-tool-client";

/** Returns blank page numbers in the job record — show alongside results. */
export function DetectBlankClient() {
  return (
    <SimpleToolClient
      op="detect-blank"
      cta="Detect blank pages →"
      resultFilename={(f) => "blank-report-" + (f?.name ?? "result.json")}
      downloadLabel="Download report"
    />
  );
}
