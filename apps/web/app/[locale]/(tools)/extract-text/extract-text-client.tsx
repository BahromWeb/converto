"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

/** Plain-text extraction from PDFs that already have a text layer. */
export function ExtractTextClient() {
  const [format, setFormat] = useState<"txt" | "json">("txt");
  return (
    <SimpleToolClient
      op="extract-text"
      cta="Extract text →"
      resultFilename={(f) => (f?.name ?? "result").replace(/\.pdf$/i, "") + "." + format}
      downloadLabel={"Download ." + format}
      buildExtraBody={() => ({ format })}
      extraFields={
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Format</span>
          <div className="flex gap-2">
            {(["txt", "json"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  format === f
                    ? "border-primary bg-primary/5 font-medium"
                    : "border-border bg-card"
                }`}
              >
                .{f}
              </button>
            ))}
          </div>
        </label>
      }
    />
  );
}
