"use client";

import { useState } from "react";
import { Switch } from "@converto/ui/components/switch";
import { Badge } from "@converto/ui/components/badge";
import { cn } from "@converto/ui/lib/utils";
import type { Tool } from "@converto/types";
import { formatNumber } from "@converto/utils";

export interface ToolManagementCardProps {
  tool: Tool;
  usage: number;
}

export function ToolManagementCard({ tool, usage }: ToolManagementCardProps) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition-all duration-200",
        enabled ? "border-border" : "border-border/50 opacity-60",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground">{tool.name}</h3>
            {tool.badge ? (
              <Badge
                variant="outline"
                className={cn(
                  "capitalize text-[10px] font-bold",
                  tool.badge === "popular" && "border-primary/20 bg-primary/10 text-primary",
                  (tool.badge === "new" || tool.badge === "ai") &&
                    "border-primary/20 bg-primary/10 text-primary",
                )}
              >
                {tool.badge === "new" ? "AI · New" : tool.badge}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label={`Toggle ${tool.name}`}
        />
      </div>

      {/* Footer stats */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            7d uses
          </p>
          <p className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">
            {formatNumber(usage)}
          </p>
        </div>
        <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground">
          /{tool.slug}
        </span>
      </div>
    </div>
  );
}
