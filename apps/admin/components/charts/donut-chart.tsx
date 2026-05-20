"use client";

import { useEffect, useState } from "react";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
  showLegend?: boolean;
}

export function DonutChart({
  segments,
  size = 160,
  thickness = 28,
  centerLabel,
  centerSub,
  showLegend = true,
}: DonutChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setTimeout(() => setAnimated(true), 80));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.06"
            strokeWidth={thickness}
          />

          {segments.map((seg, i) => {
            const pct = seg.value / total;
            const dash = pct * circumference;
            const offset = -cumulative * circumference;
            cumulative += pct;

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${animated ? dash : 0} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                style={{ transition: `stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms` }}
              />
            );
          })}
        </svg>

        {/* Center text */}
        {(centerLabel || centerSub) && (
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ transform: "none" }}
          >
            {centerLabel && (
              <span className="text-xl font-bold text-foreground">{centerLabel}</span>
            )}
            {centerSub && (
              <span className="text-[10px] font-medium text-muted-foreground">{centerSub}</span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <ul className="min-w-0 flex-1 space-y-2.5">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="truncate font-medium text-foreground">{seg.label}</span>
              </span>
              <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground">
                {((seg.value / total) * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
