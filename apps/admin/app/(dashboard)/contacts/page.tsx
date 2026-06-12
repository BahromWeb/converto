"use client";

import { useEffect, useState } from "react";
import { Mail, Loader2, AlertCircle, User as UserIcon } from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Topbar } from "@/components/layout/topbar";
import { apiGet } from "@/lib/api";

interface ContactMessage {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  subject?: string;
  body: string;
  status: string; // new | replied | closed
  created_at: string;
}

const statusStyle: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  replied: "bg-emerald-50 text-emerald-700",
  closed: "bg-secondary text-muted-foreground",
};

function ago(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function ContactsPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ items: ContactMessage[]; total: number }>("/admin/contacts?limit=100")
      .then((d) => setItems(d.items ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const unread = items.filter((m) => m.status === "new").length;

  return (
    <>
      <Topbar
        title="Contacts"
        description={loading ? "loading…" : `${items.length} message${items.length === 1 ? "" : "s"} · ${unread} new`}
        crumbs={["People", "Contacts"]}
      />

      <div className="space-y-6 p-8">
        {error && (
          <Card className="flex items-center gap-2 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="size-4" /> {error}
          </Card>
        )}

        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading messages…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center text-sm text-muted-foreground">
              <Mail className="size-7 text-muted-foreground/40" />
              No contact messages yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((m) => {
                const expanded = open === m.id;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => setOpen(expanded ? null : m.id)}
                      className="flex w-full items-start gap-3 px-6 py-4 text-left transition-colors hover:bg-secondary/50"
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-secondary">
                        <UserIcon className="size-4 text-muted-foreground" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{m.name || m.email}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyle[m.status] ?? "bg-secondary text-muted-foreground"}`}>
                            {m.status}
                          </span>
                          {!m.user_id && (
                            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">guest</span>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                        {m.subject && <p className="mt-1 truncate text-sm font-medium text-foreground">{m.subject}</p>}
                        <p className={`mt-1 text-sm text-muted-foreground ${expanded ? "" : "truncate"}`}>{m.body}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{ago(m.created_at)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
