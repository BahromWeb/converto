"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Mail, Inbox } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { apiGet } from "@/lib/api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  body: string;
  status: string; // new | replied | closed
  created_at: string;
}

function ago(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

/**
 * Bell in the topbar. Polls the real contacts inbox and badges the count of
 * unread ("new") messages a user has sent us. Clicking opens a preview and
 * links through to the Contacts inbox.
 */
export function NotificationBell() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      apiGet<{ items: ContactMessage[]; total: number }>("/admin/contacts?limit=20")
        .then((d) => {
          if (alive) setItems(d.items ?? []);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 30_000); // refresh every 30s
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  // Close on outside click.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const newOnes = items.filter((m) => m.status === "new");
  const count = newOnes.length;

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notifications${count ? ` (${count} new)` : ""}`}
        className="relative size-9 rounded-lg"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="size-4" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-4 text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-bold text-foreground">Notifications</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {count} new
            </span>
          </div>

          {newOnes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
              <Inbox className="size-6 opacity-50" />
              You&apos;re all caught up.
            </div>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {newOnes.slice(0, 8).map((m) => (
                <li key={m.id}>
                  <Link
                    href="/contacts"
                    onClick={() => setOpen(false)}
                    className="flex gap-3 px-4 py-3 hover:bg-secondary/50"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">{m.name || m.email}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{ago(m.created_at)}</span>
                      </div>
                      {m.subject && (
                        <p className="truncate text-xs font-medium text-foreground/80">{m.subject}</p>
                      )}
                      <p className="truncate text-xs text-muted-foreground">{m.body}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/contacts"
            onClick={() => setOpen(false)}
            className="block border-t border-border px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-secondary/50"
          >
            Open inbox
          </Link>
        </div>
      )}
    </div>
  );
}
