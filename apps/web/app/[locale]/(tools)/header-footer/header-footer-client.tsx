"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

export function HeaderFooterClient() {
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("black");
  const [position, setPosition] = useState<"left" | "center" | "right">("center");
  return (
    <SimpleToolClient
      op="header-footer"
      cta="Apply header/footer →"
      resultFilename={(f) => "hf-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download PDF"
      buildExtraBody={() => ({
        header_text: header,
        footer_text: footer,
        font_size: fontSize,
        font_color: color,
        position,
      })}
      extraFields={
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Header text</span>
            <input
              type="text"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Footer text</span>
            <input
              type="text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">
                Font size: <span className="text-muted-foreground">{fontSize} px</span>
              </span>
              <input
                type="range"
                min={6}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-full accent-primary"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Colour</span>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="black"
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Position</span>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as "left" | "center" | "right")}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
        </div>
      }
    />
  );
}
