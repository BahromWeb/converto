import type { Metadata } from "next";
import { Activity, Globe2, TrendingUp, TrendingDown, Zap, Users, Timer } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@converto/ui/components/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { DonutChart } from "@/components/charts/donut-chart";

export const metadata: Metadata = { title: "Analytics" };

const dailyJobs = [
  41, 38, 45, 52, 48, 61, 70, 64, 58, 72, 81, 76, 89, 94, 88, 102, 110, 115, 108, 121, 134, 128,
  142, 151, 145, 158, 167, 172, 184, 191,
];

const dailyUsers30 = [
  121, 118, 129, 141, 135, 148, 162, 157, 145, 168, 179, 173, 188, 195, 190, 208, 215, 221, 214,
  226, 238, 232, 247, 255, 249, 261, 272, 278, 269, 284,
];

const hourlyJobs24 = [
  12, 9, 7, 6, 8, 14, 22, 38, 51, 67, 72, 81, 78, 74, 80, 86, 88, 84, 79, 71, 62, 52, 41, 34,
];

const countries = [
  { code: "UZ", name: "Uzbekistan", share: 21.4 },
  { code: "RU", name: "Russia", share: 14.8 },
  { code: "DE", name: "Germany", share: 9.2 },
  { code: "US", name: "United States", share: 7.6 },
  { code: "CN", name: "China", share: 6.9 },
  { code: "IN", name: "India", share: 5.3 },
];

const deviceBreakdown = [
  { label: "Desktop", value: 58, color: "hsl(14 80% 53%)" },
  { label: "Mobile", value: 32, color: "hsl(221 83% 53%)" },
  { label: "Tablet", value: 10, color: "hsl(142 71% 45%)" },
];

const toolCategoryBreakdown = [
  { label: "Organize", value: 38, color: "hsl(221 83% 53%)" },
  { label: "Convert", value: 28, color: "hsl(142 71% 45%)" },
  { label: "Edit", value: 17, color: "hsl(262 83% 58%)" },
  { label: "Secure", value: 11, color: "hsl(38 92% 50%)" },
  { label: "AI", value: 6, color: "hsl(14 80% 53%)" },
];

const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export default function AnalyticsPage() {
  return (
    <>
      <Topbar
        title="Analytics"
        description="Where every byte goes."
        crumbs={["Operations", "Analytics"]}
      />

      <div className="space-y-6 p-8">
        {/* KPIs */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Avg processing time"
            value="2.6s"
            delta={-8.4}
            hint="Down 8.4% week over week"
            icon={Zap}
            spark={[0.9, 0.85, 0.92, 0.88, 0.82, 0.78, 0.76, 0.73, 0.7, 0.68, 0.65, 0.62]}
          />
          <KpiCard
            label="Uptime · 30d"
            value="99.97%"
            hint="2 incidents this month"
            icon={Activity}
            spark={[0.98, 0.99, 0.97, 0.99, 1, 0.99, 0.98, 1, 0.99, 0.99, 1, 1]}
          />
          <KpiCard
            label="Reach · 30d"
            value="142 countries"
            delta={2.1}
            hint="3 new this month"
            icon={Globe2}
            spark={[0.85, 0.87, 0.86, 0.88, 0.89, 0.9, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95]}
          />
          <KpiCard
            label="Daily active users"
            value="184K"
            delta={5.3}
            hint="+24% vs prior 30d"
            icon={Users}
            spark={[0.5, 0.55, 0.52, 0.6, 0.62, 0.65, 0.68, 0.7, 0.75, 0.8, 0.87, 0.92]}
          />
        </section>

        {/* Volume + User trends */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Volume
                </p>
                <h3 className="mt-0.5 text-lg font-bold text-foreground">Jobs per day · 30d</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Daily PDF jobs across all tools
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="size-3.5" />
                +21% vs prior 30d
              </span>
            </div>
            <div className="px-6 pb-6 pt-5">
              <BarChart data={dailyJobs} xLabels={["30d ago", "today"]} height={180} />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Users
                </p>
                <h3 className="mt-0.5 text-lg font-bold text-foreground">
                  Daily active users · 30d
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Unique users who ran a job</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <TrendingUp className="size-3.5" />
                +24% vs prior 30d
              </span>
            </div>
            <div className="px-6 pb-6 pt-5">
              <LineChart
                data={dailyUsers30}
                labels={["30d ago", "today"]}
                height={180}
                color="hsl(221 83% 53%)"
              />
            </div>
          </Card>
        </section>

        {/* Hourly pattern */}
        <Card className="overflow-hidden">
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Hourly pattern
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-foreground">
                Jobs by hour of day · last 24h
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                UTC · peak at 11:00–17:00
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Timer className="size-3.5" />
                Peak: 14:00 UTC
              </span>
            </div>
          </div>
          <div className="px-6 pb-6 pt-5">
            <BarChart data={hourlyJobs24} xLabels={["0:00", "23:00"]} height={160} />
          </div>
        </Card>

        {/* Countries + Device + Category */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Top countries */}
          <Card className="overflow-hidden lg:col-span-1">
            <div className="border-b border-border px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Geographic reach
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-foreground">Top countries</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">By active users · 30d</p>
            </div>
            <ul className="divide-y divide-border">
              {countries.map((c, i) => (
                <li key={c.code} className="px-6 py-3.5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 text-right text-xs font-bold tabular-nums text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-foreground">{c.name}</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {c.code}
                      </span>
                    </span>
                    <span className="font-mono text-xs font-semibold tabular-nums">{c.share}%</span>
                  </div>
                  <div className="ml-7 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${(c.share / countries[0]!.share) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Device breakdown */}
          <Card className="overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Devices
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-foreground">Device breakdown</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Sessions by device type · 7d</p>
            </div>
            <div className="flex flex-col items-center px-6 py-6">
              <DonutChart
                segments={deviceBreakdown}
                size={160}
                thickness={30}
                centerLabel="100%"
                centerSub="sessions"
              />
            </div>
          </Card>

          {/* Tool category distribution */}
          <Card className="overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Usage
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-foreground">Tool categories</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Jobs by category · 7d</p>
            </div>
            <div className="flex flex-col items-center px-6 py-6">
              <DonutChart
                segments={toolCategoryBreakdown}
                size={160}
                thickness={30}
                centerLabel="37"
                centerSub="tools"
              />
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
