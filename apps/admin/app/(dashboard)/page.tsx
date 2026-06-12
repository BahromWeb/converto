"use client";

import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  Layers,
} from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { apiGet } from "@/lib/api";

interface BackendUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  created_at: string;
}

interface QueueInfo {
  pending?: number;
  active?: number;
  retry?: number;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [queues, setQueues] = useState<Record<string, QueueInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<{ items: BackendUser[]; total: number }>("/admin/users?limit=500")
      .then((d) => setUsers(d.items ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "failed to load"))
      .finally(() => setLoading(false));
    // Queue depth is best-effort — tolerate an unfamiliar shape.
    apiGet<{ queues?: Record<string, QueueInfo> }>("/admin/stats/overview")
      .then((d) => setQueues(d?.queues ?? {}))
      .catch(() => {});
  }, []);

  const now = Date.now();
  const total = users.length;
  const active = users.filter((u) => u.status === "active").length;
  const admins = users.filter((u) => u.role === "admin").length;
  const new7 = users.filter(
    (u) => new Date(u.created_at).getTime() >= now - 7 * 86_400_000,
  ).length;
  const queuePending = Object.values(queues).reduce((n, q) => n + (q.pending ?? 0), 0);

  const recent = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <>
      <Topbar
        title="Dashboard"
        description="Live overview of users and the job queue."
        crumbs={["Operations", "Overview"]}
      />

      <div className="space-y-6 p-8">
        {error && (
          <Card className="flex items-center gap-2 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="size-4" /> {error}
          </Card>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total users" value={loading ? "—" : total.toLocaleString()} hint="all accounts" icon={UsersIcon} />
          <KpiCard label="Active users" value={loading ? "—" : active.toLocaleString()} hint={total ? `${Math.round((active / total) * 100)}% of total` : ""} icon={UserCheck} />
          <KpiCard label="Admins" value={loading ? "—" : admins.toLocaleString()} hint="with console access" icon={ShieldCheck} />
          <KpiCard label="New · 7d" value={loading ? "—" : new7.toLocaleString()} hint="signups this week" icon={Sparkles} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Recent signups */}
          <Card className="overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent</p>
              <h3 className="mt-0.5 text-base font-bold text-foreground">Latest signups</h3>
            </div>
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </div>
            ) : recent.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">No users yet.</div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((u) => (
                  <li key={u.id} className="flex items-center gap-3 px-6 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">
                      {(u.name?.trim() || u.email)[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {u.name?.trim() || u.email.split("@")[0]}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {u.role}
                      </span>
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Job queue */}
          <Card className="overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Queue</p>
              <h3 className="mt-0.5 text-base font-bold text-foreground">Job pipeline</h3>
            </div>
            <div className="space-y-3 p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Layers className="size-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{queuePending}</p>
                  <p className="text-xs text-muted-foreground">pending jobs across all queues</p>
                </div>
              </div>
              {Object.keys(queues).length > 0 && (
                <ul className="space-y-1.5 pt-2">
                  {Object.entries(queues).map(([name, q]) => (
                    <li key={name} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{name}</span>
                      <span className="font-mono tabular-nums">
                        {q.pending ?? 0} pending · {q.active ?? 0} active
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
