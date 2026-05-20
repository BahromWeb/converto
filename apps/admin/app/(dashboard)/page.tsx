import {
  Activity,
  CircleDollarSign,
  FileText,
  Users as UsersIcon,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TopTools } from "@/components/dashboard/top-tools";
import { LineChart } from "@/components/charts/line-chart";
import { DonutChart } from "@/components/charts/donut-chart";

const weeklyFiles = [1_820_000, 2_010_000, 1_940_000, 2_150_000, 2_280_000, 2_360_000, 2_410_000];
const weeklyUsers = [148_000, 161_000, 155_000, 171_000, 179_000, 181_000, 184_209];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatBreakdown = [
  { label: "PDF → merge/split", value: 38, color: "hsl(14 80% 53%)" },
  { label: "PDF → Word/DOCX", value: 22, color: "hsl(221 83% 53%)" },
  { label: "Compress PDF", value: 18, color: "hsl(142 71% 45%)" },
  { label: "JPG → PDF", value: 12, color: "hsl(262 83% 58%)" },
  { label: "Other", value: 10, color: "hsl(220 14% 70%)" },
];

export default function DashboardPage() {
  const now = new Date("2026-05-19T08:15:00Z").getTime();

  return (
    <>
      <Topbar
        title="Dashboard"
        description="Real-time pulse across users, jobs, and revenue."
        crumbs={["Operations", "Overview"]}
        actions={
          <Button variant="outline" size="sm">
            Export · CSV
          </Button>
        }
      />

      <div className="space-y-6 p-8">
        {/* KPI row */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Files processed · 24h"
            value="2.41M"
            delta={4.2}
            hint="vs prior 24h"
            icon={FileText}
            spark={[0.4, 0.55, 0.42, 0.6, 0.5, 0.7, 0.62, 0.78, 0.7, 0.85, 0.9, 1]}
          />
          <KpiCard
            label="Active users · 24h"
            value="184,209"
            delta={2.8}
            hint="vs prior 24h"
            icon={UsersIcon}
            spark={[0.5, 0.6, 0.55, 0.65, 0.7, 0.62, 0.74, 0.7, 0.8, 0.78, 0.85, 0.9]}
          />
          <KpiCard
            label="Pipeline health"
            value="99.97%"
            delta={0}
            hint="Avg latency 184ms"
            icon={Activity}
            spark={[0.95, 0.97, 0.94, 0.98, 0.99, 0.96, 0.98, 0.99, 0.97, 0.99, 0.98, 1]}
          />
          <KpiCard
            label="MRR · projected"
            value="$0"
            hint="Pricing begins 2027"
            icon={CircleDollarSign}
          />
        </section>

        {/* Weekly trend charts */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  File volume
                </p>
                <h3 className="mt-0.5 text-base font-bold text-foreground">
                  Files processed · 7d
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="size-3" />
                +32% vs prior week
              </span>
            </div>
            <div className="px-5 pb-5 pt-4">
              <LineChart
                data={weeklyFiles}
                labels={weekLabels}
                height={160}
                area
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  User activity
                </p>
                <h3 className="mt-0.5 text-base font-bold text-foreground">
                  Active users · 7d
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <TrendingUp className="size-3" />
                +24% vs prior week
              </span>
            </div>
            <div className="px-5 pb-5 pt-4">
              <LineChart
                data={weeklyUsers}
                labels={weekLabels}
                height={160}
                color="hsl(221 83% 53%)"
                area
              />
            </div>
          </Card>
        </section>

        {/* Tool format breakdown + live feed + top tools */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr_1fr]">
          {/* Donut — tool category mix */}
          <Card className="overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Breakdown
              </p>
              <h3 className="mt-0.5 text-base font-bold text-foreground">Tool category mix</h3>
            </div>
            <div className="px-5 py-5">
              <DonutChart
                segments={formatBreakdown}
                size={140}
                thickness={24}
                centerLabel="2.41M"
                centerSub="jobs today"
              />
            </div>
            <div className="border-t border-border px-5 py-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3" />
                Updated every 60 seconds
              </p>
            </div>
          </Card>

          {/* Activity feed */}
          <ActivityFeed now={now} />

          {/* Top tools */}
          <TopTools />
        </section>
      </div>
    </>
  );
}
