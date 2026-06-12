"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

const counts = [2, 4, 6, 9] as const;

export function NupClient() {
  const [n, setN] = useState<(typeof counts)[number]>(4);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [border, setBorder] = useState(true);
  return (
    <SimpleToolClient
      op="nup"
      cta={`Make ${n}-up PDF →`}
      resultFilename={(f) => `${n}up-${f?.name ?? "result.pdf"}`}
      downloadLabel={`Download ${n}-up PDF`}
      buildExtraBody={() => ({ n, orientation, border })}
      extraFields={
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Pages per sheet</span>
            <div className="flex gap-2">
              {counts.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setN(c)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    n === c
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border bg-card"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Orientation</span>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={border}
              onChange={(e) => setBorder(e.target.checked)}
              className="size-4 accent-primary"
            />
            <span>Draw borders between pages</span>
          </label>
        </div>
      }
    />
  );
}
