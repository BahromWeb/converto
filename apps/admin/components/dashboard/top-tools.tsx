import { Card } from "@converto/ui/components/card";
import { mockToolUsage, tools } from "@converto/data";
import { formatNumber } from "@converto/utils";

export function TopTools() {
  const ranked = tools
    .map((t) => ({ ...t, uses: mockToolUsage[t.slug] ?? 0 }))
    .sort((a, b) => b.uses - a.uses)
    .slice(0, 6);

  const max = ranked[0]?.uses ?? 1;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Top tools
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-foreground">By total jobs · 7d</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground">Relative</span>
      </div>

      {/* Tool rows */}
      <ul className="divide-y divide-border">
        {ranked.map((tool, i) => {
          const pct = Math.round((tool.uses / max) * 100);
          return (
            <li key={tool.slug} className="px-6 py-4">
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-right text-xs font-bold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-semibold text-foreground">{tool.name}</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatNumber(tool.uses)}
                </span>
              </div>
              <div className="ml-8 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
