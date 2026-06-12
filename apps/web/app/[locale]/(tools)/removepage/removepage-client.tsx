"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

export function RemovePageClient() {
  const [pages, setPages] = useState("");
  return (
    <SimpleToolClient
      op="removepage"
      cta="Remove pages →"
      resultFilename={(f) => "trimmed-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download trimmed PDF"
      buildExtraBody={() => ({ pages_to_remove: pages })}
      extraFields={
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Pages to remove</span>
          <input
            type="text"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="1,4-6"
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <span className="text-xs text-muted-foreground">
            Comma-separated single pages or ranges. Example: <code>1,4-6,12</code>.
          </span>
        </label>
      }
    />
  );
}
