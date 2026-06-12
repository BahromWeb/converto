"use client";

import { useEffect, useState } from "react";
import { TrendingUp, HardDrive, Activity, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Topbar } from "@/components/layout/topbar";
import { LineChart } from "@/components/charts/line-chart";
import { apiGet } from "@/lib/api";

interface DailyCount {
  day: string;
  count: number;
}
interface DiskUser {
  user_id: string;
  email?: string;
  file_count: number;
  total_size_bytes: number;
}
interface AuditEvent {
  id: string;
  email?: string;
  event: string;
  ip?: string;
  created_at: string;
}

function fmtBytes(n: number) {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), u.length - 1);
  return `${(n / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`;
}
function ago(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function AnalyticsPage() {
  const [signups, setSignups] = useState<DailyCount[]>([]);
  const [disk, setDisk] = useState<DiskUser[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([
      apiGet<{ items: DailyCount[] }>("/admin/stats/users?days=30").then((d) => setSignups(d.items ?? [])),
      apiGet<{ items: DiskUser[] }>("/admin/stats/storage?limit=8").then((d) => setDisk(d.items ?? [])),
      apiGet<{ items: AuditEvent[] }>("/admin/audit/recent?limit=12").then((d) => setEvents(d.items ?? [])),
    ])
      .then((rs) => {
        const firstErr = rs.find((r) => r.status === "rejected");
        if (firstErr && firstErr.status === "rejected") setError(String(firstErr.reason?.message ?? ""));
      })
      .finally(() => setLoading(false));
  }, []);

  const signupSeries = signups.map((d) => d.count);
  const signupTotal = signupSeries.reduce((a, b) => a + b, 0);

  return (
    <>
      <Topbar
        title="Analytics"
        description="Real signups, storage and auth activity."
        crumbs={["Operations", "Analytics"]}
      />

      <div className="space-y-6 p-8">
        {error && (
          <Card className="flex items-center gap-2 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="size-4" /> {error}
          </Card>
        )}

        {/* Signups (real, last 30 days) */}
        <Card className="overflow-hidden">
          <div className="flex items-start justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Growth</p>
              <h3 className="mt-0.5 text-base font-bold text-foreground">New signups · last 30 days</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <TrendingUp className="size-3" />
              {signupTotal} total
            </span>
          </div>
          <div className="px-5 pb-5 pt-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </div>
            ) : (
              <LineChart data={signupSeries.length ? signupSeries : [0, 0]} labels={["30d ago", "today"]} height={160} color="hsl(221 83% 53%)" area />
            )}
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top storage consumers (real) */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <HardDrive className="size-4 text-muted-foreground" />
              <h3 className="text-base font-bold text-foreground">Top storage consumers</h3>
            </div>
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </div>
            ) : disk.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">No stored files.</div>
            ) : (
              <ul className="divide-y divide-border">
                {disk.map((u) => (
                  <li key={u.user_id} className="flex items-center justify-between px-6 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{u.email || u.user_id}</p>
                      <p className="text-xs text-muted-foreground">{u.file_count} files</p>
                    </div>
                    <span className="font-mono text-sm tabular-nums">{fmtBytes(u.total_size_bytes)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Recent auth activity (real) */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <Activity className="size-4 text-muted-foreground" />
              <h3 className="text-base font-bold text-foreground">Recent activity</h3>
            </div>
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </div>
            ) : events.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">No activity yet.</div>
            ) : (
              <ul className="divide-y divide-border">
                {events.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 px-6 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">
                        <span className="font-medium">{e.email || "—"}</span>{" "}
                        <span className="text-muted-foreground">· {e.event}</span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{e.ip}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{ago(e.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </>
  );
}
