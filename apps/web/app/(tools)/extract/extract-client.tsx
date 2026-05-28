"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

/** Extract a subset of pages into a new PDF. */
export function ExtractClient() {
  const [pageRanges, setPageRanges] = useState("1-3");
  return (
    <SimpleToolClient
      op="extract"
      cta="Extract pages →"
      resultFilename={(f) => "extracted-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download extracted PDF"
      buildExtraBody={() => ({ page_ranges: pageRanges })}
      extraFields={
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Page ranges</span>
          <input
            type="text"
            value={pageRanges}
            onChange={(e) => setPageRanges(e.target.value)}
            placeholder="1-3,5,7-9"
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <span className="text-xs text-muted-foreground">
            Output keeps only the listed pages, in order.
          </span>
        </label>
      }
    />
  );
}
