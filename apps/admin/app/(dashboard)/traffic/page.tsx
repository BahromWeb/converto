"use client";

import { useEffect, useState } from "react";
import { Activity, Globe2, Users as UsersIcon, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Topbar } from "@/components/layout/topbar";
import { apiGet } from "@/lib/api";

interface Entry {
  created_at: string;
  ip: string;
  country: string;
  method: string;
  path: string;
  status: number;
  user_id?: string;
  user_agent: string;
}
interface Bucket {
  label: string;
  count: number;
}
interface Summary {
  total: number;
  unique_ips: number;
  countries: Bucket[];
  paths: Bucket[];
  window_h: number;
}

function ago(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
function device(ua: string) {
  if (!ua) return "—";
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  if (/bot|crawl|spider|slurp|bing|google/i.test(ua)) return "Bot";
  return "Desktop";
}
function statusColor(s: number) {
  if (s >= 500) return "text-rose-600";
  if (s >= 400) return "text-amber-600";
  if (s >= 300) return "text-blue-600";
  return "text-emerald-600";
}

export default function TrafficPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recent, setRecent] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([
      apiGet<Summary>("/admin/traffic/summary?hours=24").then(setSummary),
      apiGet<{ items: Entry[] }>("/admin/traffic?limit=100").then((d) => setRecent(d.items ?? [])),
    ])
      .then((rs) => {
        const e = rs.find((r) => r.status === "rejected");
        if (e && e.status === "rejected") setError(String(e.reason?.message ?? ""));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar title="Traffic" description="Real requests · last 24h" crumbs={["Overview", "Traffic"]} />

      <div className="space-y-6 p-8">
        {error && (
          <Card className="flex items-center gap-2 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="size-4" /> {error}
          </Card>
        )}

        <section className="grid grid-cols-2 gap-4">
          <Card className="p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Activity className="size-5" /></span>
            <p className="mt-3 text-2xl font-bold tabular-nums">{loading ? "—" : (summary?.total ?? 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Requests · 24h</p>
          </Card>
          <Card className="p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><UsersIcon className="size-5" /></span>
            <p className="mt-3 text-2xl font-bold tabular-nums">{loading ? "—" : (summary?.unique_ips ?? 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Unique IPs · 24h</p>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <Globe2 className="size-4 text-muted-foreground" />
              <h3 className="text-base font-bold text-foreground">Top countries</h3>
            </div>
            {!summary?.countries?.length ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {loading ? "Loading…" : "No data yet (country needs CF proxy / geoip — shown as —)."}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {summary.countries.map((b) => (
                  <li key={b.label} className="flex items-center justify-between px-6 py-2.5 text-sm">
                    <span className="font-medium">{b.label}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">{b.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <Activity className="size-4 text-muted-foreground" />
              <h3 className="text-base font-bold text-foreground">Top actions (paths)</h3>
            </div>
            {!summary?.paths?.length ? (
              <div className="p-8 text-center text-sm text-muted-foreground">{loading ? "Loading…" : "No data yet."}</div>
            ) : (
              <ul className="divide-y divide-border">
                {summary.paths.map((b) => (
                  <li key={b.label} className="flex items-center justify-between gap-3 px-6 py-2.5 text-sm">
                    <span className="truncate font-mono text-xs">{b.label}</span>
                    <span className="shrink-0 font-mono tabular-nums text-muted-foreground">{b.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-base font-bold text-foreground">Recent requests</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          ) : recent.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No requests logged yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-semibold">When</th>
                    <th className="px-4 py-3 font-semibold">IP</th>
                    <th className="px-4 py-3 font-semibold">Country</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Who</th>
                    <th className="px-4 py-3 font-semibold">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recent.map((e, i) => (
                    <tr key={i} className="hover:bg-secondary/40">
                      <td className="whitespace-nowrap px-6 py-2.5 text-muted-foreground">{ago(e.created_at)} ago</td>
                      <td className="px-4 py-2.5 font-mono text-xs">{e.ip}</td>
                      <td className="px-4 py-2.5">{e.country || "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-xs">
                          <span className="font-semibold text-muted-foreground">{e.method}</span> {e.path}
                        </span>
                      </td>
                      <td className={`px-4 py-2.5 font-mono tabular-nums ${statusColor(e.status)}`}>{e.status}</td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${e.user_id ? "bg-emerald-50 text-emerald-700" : "bg-secondary text-muted-foreground"}`}>
                          {e.user_id ? "user" : "guest"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{device(e.user_agent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
