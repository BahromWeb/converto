"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

/** Margin-trim crop. All four inset values are in pixels. */
export function CropClient() {
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState(0);
  const [pages, setPages] = useState("all");
  return (
    <SimpleToolClient
      op="crop"
      cta="Crop pages →"
      resultFilename={(f) => "cropped-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download cropped PDF"
      buildExtraBody={() => ({ top, right, bottom, left, pages: pages.trim() || "all" })}
      extraFields={
        <div className="grid gap-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Top", v: top, set: setTop },
              { label: "Right", v: right, set: setRight },
              { label: "Bottom", v: bottom, set: setBottom },
              { label: "Left", v: left, set: setLeft },
            ].map((c) => (
              <label key={c.label} className="grid gap-1">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {c.label}
                </span>
                <input
                  type="number"
                  min={0}
                  value={c.v}
                  onChange={(e) => c.set(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-lg border bg-card px-2 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>
            ))}
          </div>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Pages</span>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="all  ·  1-3,5"
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        </div>
      }
    />
  );
}
