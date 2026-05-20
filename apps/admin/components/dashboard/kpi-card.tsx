import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@converto/ui/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: LucideIcon;
  spark?: number[];
}

export function KpiCard({ label, value, delta, hint, icon: Icon, spark }: KpiCardProps) {
  const positive = (delta ?? 0) > 0;
  const negative = (delta ?? 0) < 0;
  const neutral = !positive && !negative;

  return (
    <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>

      {/* Value + delta */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {typeof delta === "number" ? (
          <span
            className={cn(
              "mb-0.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              positive && "bg-emerald-50 text-emerald-700",
              negative && "bg-rose-50 text-rose-700",
              neutral && delta === 0 && "bg-secondary text-muted-foreground",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : negative ? (
              <ArrowDownRight className="size-3" />
            ) : null}
            {positive ? "+" : ""}
            {delta}%
          </span>
        ) : null}
      </div>

      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}

      {/* Sparkline */}
      {spark && spark.length > 1 ? (
        <div className="mt-5 flex h-10 items-end gap-px">
          {spark.map((v, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-sm transition-colors duration-200",
                i === spark.length - 1
                  ? "bg-primary"
                  : "bg-secondary group-hover:bg-border",
              )}
              style={{ height: `${Math.max(10, v * 100)}%` }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
