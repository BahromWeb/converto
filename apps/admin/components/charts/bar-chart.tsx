"use client";

import { useEffect, useState } from "react";
import { cn } from "@converto/ui/lib/utils";

export interface BarChartProps {
  data: number[];
  /** Labels for x-axis — shown at first and last bar */
  xLabels?: [string, string];
  /** Color for bars (Tailwind bg class or CSS color string) */
  className?: string;
  height?: number;
}

export function BarChart({ data, xLabels, className, height = 180 }: BarChartProps) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data, 1);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTimeout(() => setAnimated(true), 60);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={cn("select-none", className)}>
      <div className="relative flex items-end gap-1" style={{ height }}>
        {/* Y-axis grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <div
            key={pct}
            className="pointer-events-none absolute inset-x-0 border-t border-border/40"
            style={{ bottom: `${pct * 100}%` }}
          />
        ))}

        {data.map((v, i) => {
          const targetPct = Math.max(2, (v / max) * 100);
          const isHovered = hovered === i;
          const isLast = i === data.length - 1;

          return (
            <div
              key={i}
              className="group relative z-10 flex-1 cursor-default"
              style={{ height: "100%" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-md"
                  style={{ opacity: isHovered ? 1 : 0, transition: "opacity 0.1s" }}
                >
                  Day {i + 1} · {v.toLocaleString()}
                </div>
              )}

              {/* Bar */}
              <div
                className="absolute bottom-0 left-0 right-0 origin-bottom rounded-t-sm transition-colors"
                style={{
                  height: animated ? `${targetPct}%` : "2px",
                  backgroundColor:
                    isHovered
                      ? "hsl(14 80% 48%)"
                      : isLast
                      ? "hsl(14 80% 53%)"
                      : `hsl(14 80% 53% / ${0.4 + (i / data.length) * 0.6})`,
                  transition: `height 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 16}ms, background-color 0.15s ease`,
                }}
              />
            </div>
          );
        })}
      </div>

      {xLabels && (
        <div className="mt-3 flex justify-between text-xs font-medium text-muted-foreground">
          <span>{xLabels[0]}</span>
          <span>{xLabels[1]}</span>
        </div>
      )}
    </div>
  );
}
