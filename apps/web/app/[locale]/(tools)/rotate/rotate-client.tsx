"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

const angles = [90, 180, 270] as const;

/**
 * Rotate every page or a custom range. `pages` defaults to "all" which
 * the backend honours; otherwise free-text "1-3,5" gets passed through
 * as-is.
 */
export function RotateClient() {
  const [angle, setAngle] = useState<(typeof angles)[number]>(90);
  const [pages, setPages] = useState("all");
  return (
    <SimpleToolClient
      op="rotate"
      cta="Rotate now →"
      resultFilename={(f) => "rotated-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download rotated PDF"
      buildExtraBody={() => ({ angle, pages: pages.trim() || "all" })}
      extraFields={
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Angle</span>
            <div className="flex gap-2">
              {angles.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAngle(a)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    angle === a
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border bg-card"
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </label>
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
