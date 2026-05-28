"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

const positions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function AddPageNumbersClient() {
  const [firstNumber, setFirstNumber] = useState(1);
  const [pageRange, setPageRange] = useState("all");
  const [position, setPosition] = useState("bottom-right");
  const [color, setColor] = useState("black");
  const [fontSize, setFontSize] = useState(12);

  return (
    <SimpleToolClient
      op="add-page-numbers"
      cta="Add page numbers →"
      resultFilename={(f) => "numbered-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download numbered PDF"
      buildExtraBody={() => ({
        first_number: firstNumber,
        page_range: pageRange.trim() || "all",
        position,
        color,
        font_size: fontSize,
      })}
      extraFields={
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Start at</span>
            <input
              type="number"
              min={1}
              value={firstNumber}
              onChange={(e) => setFirstNumber(parseInt(e.target.value, 10) || 1)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Pages</span>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="all  ·  1-10"
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Position</span>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Colour</span>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="black  ·  #ff0000"
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
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
        </div>
      }
    />
  );
}
