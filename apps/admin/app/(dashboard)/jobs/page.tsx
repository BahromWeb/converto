"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Clock, RotateCcw, Archive, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@converto/ui/components/card";
import { apiGet } from "@/lib/api";

interface QueueInfo {
  active?: number;
  pending?: number;
  retry?: number;
  failed?: number;
  completed?: number;
  archived?: number;
}

const STATES: { key: keyof QueueInfo; label: string; icon: typeof Clock; color: string; bg: string }[] = [
  { key: "active", label: "Active", icon: Loader2, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "pending", label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "retry", label: "Retry", icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "failed", label: "Failed", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
  { key: "archived", label: "Archived", icon: Archive, color: "text-muted-foreground", bg: "bg-secondary" },
];

export default function JobsPage() {
  const [queues, setQueues] = useState<Record<string, QueueInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<{ queues?: Record<string, QueueInfo> }>("/admin/stats/overview")
      .then((d) => setQueues(d?.queues ?? {}))
      .catch((e) => setError(e instanceof Error ? e.message : "failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const sum = (k: keyof QueueInfo) => Object.values(queues).reduce((n, q) => n + (q[k] ?? 0), 0);

  return (
    <>
      <Topbar
        title="Jobs"
        description="Live Asynq queue pipeline."
        crumbs={["Operations", "Jobs"]}
      />

      <div className="space-y-6 p-8">
        {error && (
          <Card className="flex items-center gap-2 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="size-4" /> {error}
          </Card>
        )}

        {/* Aggregate state cards */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {STATES.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.key} className="p-5">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg}`}>
                  <Icon className={`size-5 ${s.color}`} />
                </span>
                <p className="mt-3 text-2xl font-bold tabular-nums text-foreground">
                  {loading ? "—" : sum(s.key).toLocaleString()}
                </p>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              </Card>
            );
          })}
        </section>

        {/* Per-queue breakdown */}
        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Queues</p>
            <h3 className="mt-0.5 text-base font-bold text-foreground">By priority</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          ) : Object.keys(queues).length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No queue data.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-semibold">Queue</th>
                    {STATES.map((s) => (
                      <th key={s.key} className="px-4 py-3 text-right font-semibold">{s.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(queues).map(([name, q]) => (
                    <tr key={name}>
                      <td className="px-6 py-3 font-medium capitalize text-foreground">{name}</td>
                      {STATES.map((s) => (
                        <td key={s.key} className="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground">
                          {(q[s.key] ?? 0).toLocaleString()}
                        </td>
                      ))}
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
