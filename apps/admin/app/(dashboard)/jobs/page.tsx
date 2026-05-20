import type { Metadata } from "next";
import { CheckCircle2, Clock, XCircle, Loader2, TrendingUp, Timer } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@converto/ui/components/card";
import { JobsTable } from "@/components/jobs/jobs-table";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { mockJobs, mockUsers } from "@converto/data";
import { Tabs, TabsList, TabsTrigger } from "@converto/ui/components/tabs";

export const metadata: Metadata = { title: "Jobs" };

const hourlyRate = [8, 6, 5, 4, 5, 9, 15, 25, 34, 45, 50, 55, 52, 48, 53, 57, 58, 54, 49, 42, 38, 29, 22, 16];
const failureRate7d = [0.8, 1.1, 0.7, 0.9, 0.6, 0.5, 0.4];
const weekLabels7 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function JobsPage() {
  const now = new Date("2026-05-19T08:15:00Z").getTime();
  const failed = mockJobs.filter((j) => j.status === "failed").length;
  const processing = mockJobs.filter((j) => j.status === "processing").length;
  const completed = mockJobs.length - failed - processing;
  const failPct = ((failed / mockJobs.length) * 100).toFixed(1);

  const statCards = [
    {
      label: "Completed",
      value: completed.toLocaleString(),
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      badge: "bg-emerald-50 text-emerald-700",
      badgeText: `${((completed / mockJobs.length) * 100).toFixed(0)}%`,
    },
    {
      label: "Processing",
      value: processing.toLocaleString(),
      icon: Loader2,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      badge: "bg-primary/10 text-primary",
      badgeText: "Live",
    },
    {
      label: "Failed",
      value: failed.toLocaleString(),
      icon: XCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
      badge: "bg-rose-50 text-rose-700",
      badgeText: `${failPct}%`,
    },
    {
      label: "Avg queue time",
      value: "1.4s",
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      badge: "bg-emerald-50 text-emerald-700",
      badgeText: "−12%",
    },
  ];

  return (
    <>
      <Topbar
        title="Jobs"
        description="Every PDF processing run, live and historical."
        crumbs={["Operations", "Jobs"]}
      />

      <div className="space-y-6 p-8">
        {/* Stat cards */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="flex items-center gap-4 p-5">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.iconBg}`}>
                  <Icon className={`size-5 ${s.iconColor}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">{s.value}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}>
                  {s.badgeText}
                </span>
              </Card>
            );
          })}
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Throughput
                </p>
                <h3 className="mt-0.5 text-base font-bold text-foreground">
                  Jobs per hour · last 24h
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Timer className="size-3" />
                Peak 16:00 UTC
              </span>
            </div>
            <div className="px-5 pb-5 pt-4">
              <BarChart data={hourlyRate} xLabels={["0:00", "23:00"]} height={140} />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Reliability
                </p>
                <h3 className="mt-0.5 text-base font-bold text-foreground">
                  Failure rate · 7d (%)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="size-3" style={{ transform: "scaleY(-1)" }} />
                Improving
              </span>
            </div>
            <div className="px-5 pb-5 pt-4">
              <LineChart
                data={failureRate7d}
                labels={weekLabels7}
                height={140}
                color="hsl(0 72% 51%)"
                area
              />
            </div>
          </Card>
        </section>

        {/* Table */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All · {mockJobs.length}</TabsTrigger>
            <TabsTrigger value="processing">Processing · {processing}</TabsTrigger>
            <TabsTrigger value="completed">Completed · {completed}</TabsTrigger>
            <TabsTrigger value="failed">Failed · {failed}</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <JobsTable jobs={mockJobs} users={mockUsers} now={now} />
        </Card>
      </div>
    </>
  );
}
