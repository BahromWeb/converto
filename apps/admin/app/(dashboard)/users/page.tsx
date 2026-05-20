import type { Metadata } from "next";
import { Plus, Search, UserCheck, UserX, Globe2, TrendingUp } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { Input } from "@converto/ui/components/input";
import { Topbar } from "@/components/layout/topbar";
import { UsersTable } from "@/components/users/users-table";
import { LineChart } from "@/components/charts/line-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { mockUsers } from "@converto/data";

export const metadata: Metadata = { title: "Users" };

const userGrowth30 = [
  98, 101, 105, 108, 103, 112, 118, 115, 121, 128, 125, 131, 138, 142, 137,
  145, 151, 155, 149, 158, 163, 168, 162, 171, 177, 181, 176, 184, 189, 184,
];

const roleBreakdown = [
  { label: "Viewers", value: 64, color: "hsl(221 83% 53%)" },
  { label: "Editors", value: 22, color: "hsl(14 80% 53%)" },
  { label: "Admins", value: 14, color: "hsl(142 71% 45%)" },
];

export default function UsersPage() {
  const now = new Date("2026-05-19T08:15:00Z").getTime();
  const total = mockUsers.length;
  const active = mockUsers.filter((u) => u.status === "active").length;
  const suspended = mockUsers.filter((u) => u.status === "suspended").length;

  const statCards = [
    {
      label: "Total users",
      value: total.toLocaleString(),
      icon: Globe2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badge: "bg-blue-50 text-blue-700",
      badgeText: "142 countries",
    },
    {
      label: "Active",
      value: active.toLocaleString(),
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700",
      badgeText: `${((active / total) * 100).toFixed(0)}%`,
    },
    {
      label: "Suspended",
      value: suspended.toLocaleString(),
      icon: UserX,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      badge: "bg-rose-50 text-rose-700",
      badgeText: `${((suspended / total) * 100).toFixed(0)}%`,
    },
    {
      label: "New · 7d",
      value: "+2,847",
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      badge: "bg-primary/10 text-primary",
      badgeText: "+18%",
    },
  ];

  return (
    <>
      <Topbar
        title="Users"
        description={`${total} accounts across 142 countries`}
        crumbs={["Operations", "Users"]}
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Invite admin
          </Button>
        }
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
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Growth
                </p>
                <h3 className="mt-0.5 text-base font-bold text-foreground">
                  Daily active users · 30d (thousands)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="size-3" />
                +24% MoM
              </span>
            </div>
            <div className="px-5 pb-5 pt-4">
              <LineChart
                data={userGrowth30}
                labels={["30d ago", "today"]}
                height={160}
                color="hsl(221 83% 53%)"
                area
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Roles
              </p>
              <h3 className="mt-0.5 text-base font-bold text-foreground">Admin role split</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Access level distribution</p>
            </div>
            <div className="px-6 py-6">
              <DonutChart
                segments={roleBreakdown}
                size={140}
                thickness={26}
                centerLabel={total.toString()}
                centerSub="total users"
              />
            </div>
          </Card>
        </section>

        {/* Table toolbar */}
        <Card className="p-5">
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, email, or ID…" className="pl-9" />
            </div>
            <div className="flex gap-2 font-mono text-[10px] uppercase tracking-wider">
              <Button variant="outline" size="sm">
                All <span className="ml-1.5 text-primary">{total}</span>
              </Button>
              <Button variant="ghost" size="sm">Active</Button>
              <Button variant="ghost" size="sm">Suspended</Button>
              <Button variant="ghost" size="sm">Pro</Button>
            </div>
          </div>
        </Card>

        <Card>
          <UsersTable users={mockUsers} now={now} />
        </Card>
      </div>
    </>
  );
}
