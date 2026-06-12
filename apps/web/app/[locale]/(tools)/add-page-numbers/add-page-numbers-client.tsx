"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

const positions = [
  { key: "top-left",      label: "Top left"      },
  { key: "top-center",    label: "Top center"    },
  { key: "top-right",     label: "Top right"     },
  { key: "bottom-left",   label: "Bottom left"   },
  { key: "bottom-center", label: "Bottom center" },
  { key: "bottom-right",  label: "Bottom right"  },
] as const;

const presetColors: Array<{ name: string; hex: string }> = [
  { name: "black",   hex: "#000000" },
  { name: "white",   hex: "#FFFFFF" },
  { name: "red",     hex: "#E11D48" },
  { name: "blue",    hex: "#2563EB" },
  { name: "green",   hex: "#16A34A" },
  { name: "orange",  hex: "#EA580C" },
  { name: "purple",  hex: "#7C3AED" },
  { name: "gray",    hex: "#6B7280" },
];

const rangeShortcuts: Array<{ value: string; label: string; hint: string }> = [
  { value: "all",   label: "All pages",    hint: "Number every page" },
  { value: "1-",    label: "From page 1",  hint: "Skip the cover only if you set Start to 2" },
  { value: "2-",    label: "From page 2",  hint: "Skip the cover page" },
  { value: "odd",   label: "Odd pages",    hint: "1, 3, 5 …" },
  { value: "even",  label: "Even pages",   hint: "2, 4, 6 …" },
];

export function AddPageNumbersClient() {
  const [firstNumber, setFirstNumber] = useState(1);
  const [pageRange, setPageRange] = useState("all");
  const [position, setPosition] = useState("bottom-right");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(12);

  const rangeWarning = warnAboutRange(pageRange);

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
        <div className="grid gap-5">
          {/* Row 1: numbering + range */}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Start counting from</span>
              <input
                type="number"
                min={1}
                value={firstNumber}
                onChange={(e) => setFirstNumber(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <span className="text-xs text-muted-foreground">
                What number to print on the first numbered page.
              </span>
            </label>

            <div className="grid gap-1.5">
              <span className="text-sm font-medium">Apply to which pages</span>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="all"
                className={`w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none ${
                  rangeWarning ? "border-amber-500/50" : ""
                }`}
              />
              {rangeWarning ? (
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠ {rangeWarning}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Type <code>all</code>, a range like <code>1-10</code>, a list like{" "}
                  <code>1,3,5</code>, or <code>odd</code> / <code>even</code>.
                </span>
              )}
              <div className="mt-1 flex flex-wrap gap-1">
                {rangeShortcuts.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setPageRange(s.value)}
                    title={s.hint}
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                      pageRange === s.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: position + colour */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <span className="text-sm font-medium">Position on the page</span>
              <div className="grid grid-cols-3 gap-1.5 rounded-xl border bg-card p-1.5">
                {positions.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPosition(p.key)}
                    className={`rounded-lg px-1 py-2 text-[11px] font-semibold transition-colors ${
                      position === p.key
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1.5">
              <span className="text-sm font-medium">Colour</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border bg-card p-0.5"
                  aria-label="Pick a colour"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="mt-0.5 flex flex-wrap gap-1.5">
                {presetColors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                    className={`size-6 rounded-full border-2 ${
                      color.toLowerCase() === c.hex.toLowerCase()
                        ? "border-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: font size */}
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">
              Font size{" "}
              <span className="text-muted-foreground">— {fontSize} px</span>
            </span>
            <input
              type="range"
              min={6}
              max={24}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>6 px (subtle)</span>
              <span>24 px (bold)</span>
            </div>
          </label>
        </div>
      }
    />
  );
}

// warnAboutRange surfaces a friendly note when the user types something
// that will silently number very few pages — the classic "I typed 1 and
// only page 1 got numbered" footgun.
function warnAboutRange(s: string): string | null {
  const t = s.trim();
  if (!t || t === "all" || t === "odd" || t === "even") return null;
  // A single page like "1" or "3"
  if (/^\d+$/.test(t)) {
    return `This will only number page ${t}. Use "all" for every page, or "${t}-" to number from page ${t} onward.`;
  }
  return null;
}
