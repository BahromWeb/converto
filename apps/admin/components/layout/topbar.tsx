import { Bell, Search } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { UserMenu } from "./user-menu";

export interface TopbarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  crumbs?: string[];
}

export function Topbar({ title, description, actions, crumbs }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-6 px-6">
        {/* Title + breadcrumbs */}
        <div className="min-w-0 flex-1">
          {crumbs && crumbs.length > 0 ? (
            <div className="mb-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              {crumbs.map((c, i) => (
                <span key={c} className="inline-flex items-center gap-1.5">
                  {i > 0 ? <span className="text-border">/</span> : null}
                  {c}
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
            {description ? (
              <p className="hidden truncate text-sm text-muted-foreground md:block">
                — {description}
              </p>
            ) : null}
          </div>
        </div>

        {/* Search */}
        <div className="relative hidden w-60 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything…"
            className="h-9 w-full rounded-lg border border-border bg-secondary pl-9 pr-14 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 flex h-5 -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-card px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {actions}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative size-9 rounded-lg"
          >
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
