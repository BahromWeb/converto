"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

const positions = [
  { code: "top-left", label: "Top-left" },
  { code: "top-right", label: "Top-right" },
  { code: "bottom-left", label: "Bottom-left" },
  { code: "bottom-right", label: "Bottom-right" },
];

/** Drop a QR code onto every page. Content is free-form (URL, vCard, …). */
export function QrCodeClient() {
  const [content, setContent] = useState("https://convertpdfgo.com");
  const [position, setPosition] = useState("top-right");
  const [size, setSize] = useState(80);
  return (
    <SimpleToolClient
      op="qr-code"
      cta="Add QR code →"
      resultFilename={(f) => "qr-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download PDF"
      buildExtraBody={() => ({ qr_content: content, position, size })}
      extraFields={
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">QR content</span>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Position</span>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {positions.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">
                Size: <span className="text-muted-foreground">{size} px</span>
              </span>
              <input
                type="range"
                min={40}
                max={200}
                step={5}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                className="w-full accent-primary"
              />
            </label>
          </div>
        </div>
      }
    />
  );
}
