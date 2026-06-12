"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { cn } from "@converto/ui/lib/utils";
import { adminNav } from "@/lib/nav";
import { getIcon } from "@/lib/icons";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
          <span className="block h-3 w-3 rounded-sm bg-white" />
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">convertpdfgo</span>
        <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {adminNav.map((section, sectionIdx) => (
          <div key={section.title} className={cn(sectionIdx > 0 && "mt-6")}>
            <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = getIcon(item.icon);
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {Icon ? (
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                      ) : null}
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            active
                              ? "bg-primary/20 text-primary"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems normal
          </span>
          <span className="text-xs text-muted-foreground">v0.1</span>
        </div>
        <Link
          href={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-5 py-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View public site
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
