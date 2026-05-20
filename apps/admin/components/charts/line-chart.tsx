"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@converto/ui/lib/utils";

export interface LineChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
  color?: string;
  /** Show filled area under the line */
  area?: boolean;
  /** Show horizontal grid lines */
  grid?: boolean;
  /** Show dot + tooltip on hover */
  interactive?: boolean;
}

export function LineChart({
  data,
  labels,
  height = 200,
  className,
  color = "hsl(14 80% 53%)",
  area = true,
  grid = true,
  interactive = true,
}: LineChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 600, h: height });

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setSize({ w: entry.contentRect.width, h: height });
    });
    if (svgRef.current?.parentElement) ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, [height]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setTimeout(() => setAnimated(true), 60));
    return () => cancelAnimationFrame(id);
  }, []);

  if (data.length < 2) return null;

  const padX = 8;
  const padY = 12;
  const w = size.w;
  const h = size.h;
  const max = Math.max(...data) * 1.05;
  const min = Math.min(...data) * 0.9;
  const range = max - min || 1;

  const px = (i: number) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const py = (v: number) => padY + (1 - (v - min) / range) * (h - padY * 2 - 20);

  // Smooth bezier path
  const points = data.map((v, i) => ({ x: px(i), y: py(v) }));

  function buildPath(pts: { x: number; y: number }[]) {
    let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]!;
      const curr = pts[i]!;
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }

  const linePath = buildPath(points);
  const areaPath =
    linePath +
    ` L ${points[points.length - 1]!.x} ${h - 20} L ${points[0]!.x} ${h - 20} Z`;

  const gradId = `lg-${Math.random().toString(36).slice(2, 7)}`;

  const gridLines = [0.25, 0.5, 0.75, 1];

  function getMouseIndex(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const mx = e.clientX - rect.left;
    let closest = 0;
    let minDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - mx);
      if (d < minDist) { minDist = d; closest = i; }
    });
    return closest;
  }

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <svg
        ref={svgRef}
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        onMouseMove={interactive ? (e) => setHovered(getMouseIndex(e)) : undefined}
        onMouseLeave={interactive ? () => setHovered(null) : undefined}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          {/* Clip path for animation */}
          <clipPath id={`clip-${gradId}`}>
            <rect
              x="0"
              y="0"
              width={animated ? w : 0}
              height={h}
              style={{ transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)" }}
            />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {grid &&
          gridLines.map((pct) => {
            const y = padY + (1 - pct) * (h - padY * 2 - 20);
            return (
              <line
                key={pct}
                x1={padX}
                y1={y}
                x2={w - padX}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
            );
          })}

        <g clipPath={`url(#clip-${gradId})`}>
          {/* Area fill */}
          {area && (
            <path d={areaPath} fill={`url(#${gradId})`} />
          )}

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Hover elements */}
        {interactive && hovered !== null && points[hovered] && (
          <>
            {/* Vertical rule */}
            <line
              x1={points[hovered]!.x}
              y1={padY}
              x2={points[hovered]!.x}
              y2={h - 20}
              stroke={color}
              strokeOpacity="0.3"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            {/* Dot */}
            <circle
              cx={points[hovered]!.x}
              cy={points[hovered]!.y}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
            {/* Tooltip */}
            <foreignObject
              x={Math.min(points[hovered]!.x - 40, w - 100)}
              y={Math.max(points[hovered]!.y - 42, 0)}
              width="90"
              height="34"
              style={{ overflow: "visible" }}
            >
              <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-center text-xs font-semibold text-foreground shadow-md">
                {labels?.[hovered] && (
                  <span className="block text-[10px] text-muted-foreground">{labels[hovered]}</span>
                )}
                {data[hovered]?.toLocaleString()}
              </div>
            </foreignObject>
          </>
        )}

        {/* X-axis labels */}
        {labels && labels.length > 0 && (
          <>
            <text
              x={padX}
              y={h - 2}
              fontSize="10"
              fill="currentColor"
              fillOpacity="0.45"
              fontFamily="inherit"
            >
              {labels[0]}
            </text>
            <text
              x={w - padX}
              y={h - 2}
              fontSize="10"
              fill="currentColor"
              fillOpacity="0.45"
              textAnchor="end"
              fontFamily="inherit"
            >
              {labels[labels.length - 1]}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
