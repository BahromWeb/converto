"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

const langs = [
  { code: "eng", label: "English" },
  { code: "rus", label: "Russian" },
  { code: "uzb", label: "Uzbek (Latin)" },
  { code: "uzb_cyrl", label: "Uzbek (Cyrillic)" },
  { code: "kir", label: "Kyrgyz" },
];

/** Photos of paper → searchable PDF. */
export function ScanToPdfClient() {
  const [lang, setLang] = useState("eng");
  return (
    <SimpleToolClient
      op="scan-to-pdf"
      cta="Build searchable PDF →"
      accept="image/jpeg,image/png,.jpg,.jpeg,.png"
      multiple
      resultFilename={() => "scanned.pdf"}
      downloadLabel="Download searchable PDF"
      buildExtraBody={() => ({ lang })}
      extraFields={
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Language</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {langs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      }
    />
  );
}
