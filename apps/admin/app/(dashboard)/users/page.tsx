"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, UserCheck, UserX, Users as UsersIcon, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Input } from "@converto/ui/components/input";
import { Topbar } from "@/components/layout/topbar";
import { UsersTable } from "@/components/users/users-table";
import { DonutChart } from "@/components/charts/donut-chart";
import type { User } from "@converto/types";
import { apiGet, apiSend } from "@/lib/api";

interface BackendUser {
  id: string;
  name: string;
  email: string;
  status: string; // active | blocked | deleted | pending
  role: string; // user | admin
  created_at: string;
}

function mapStatus(s: string): User["status"] {
  if (s === "active") return "active";
  if (s === "pending") return "pending";
  return "suspended"; // blocked / deleted
}

function toTableUser(u: BackendUser): User {
  return {
    id: u.id,
    name: u.name?.trim() || u.email.split("@")[0] || u.email,
    email: u.email,
    avatarUrl: "",
    country: "",
    plan: u.role === "admin" ? "team" : "free",
    status: mapStatus(u.status),
    createdAt: u.created_at,
    lastSeenAt: u.created_at,
  };
}

export default function UsersPage() {
  const [raw, setRaw] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiGet<{ items: BackendUser[]; total: number }>("/admin/users?limit=500")
      .then((d) => setRaw(d.items ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    await apiSend(`/admin/users/${id}`, "DELETE");
    setRaw((prev) => prev.filter((u) => u.id !== id));
  }

  const now = Date.now();
  const total = raw.length;
  const active = raw.filter((u) => u.status === "active").length;
  const suspended = raw.filter((u) => u.status === "blocked" || u.status === "deleted").length;
  const admins = raw.filter((u) => u.role === "admin").length;
  const weekAgo = now - 7 * 86_400_000;
  const new7 = raw.filter((u) => new Date(u.created_at).getTime() >= weekAgo).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? raw.filter(
          (u) =>
            u.name?.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.id.includes(q),
        )
      : raw;
    return list.map(toTableUser);
  }, [raw, query]);

  const statCards = [
    { label: "Total users", value: total, icon: UsersIcon, iconBg: "bg-blue-50", iconColor: "text-blue-600", badge: "bg-blue-50 text-blue-700", badgeText: "all time" },
    { label: "Active", value: active, icon: UserCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700", badgeText: total ? `${Math.round((active / total) * 100)}%` : "0%" },
    { label: "Suspended", value: suspended, icon: UserX, iconBg: "bg-rose-50", iconColor: "text-rose-600", badge: "bg-rose-50 text-rose-700", badgeText: total ? `${Math.round((suspended / total) * 100)}%` : "0%" },
    { label: "New · 7d", value: new7, icon: ShieldCheck, iconBg: "bg-primary/10", iconColor: "text-primary", badge: "bg-primary/10 text-primary", badgeText: "last week" },
  ];

  const roleBreakdown = [
    { label: "Users", value: Math.max(total - admins, 0), color: "hsl(221 83% 53%)" },
    { label: "Admins", value: admins, color: "hsl(14 80% 53%)" },
  ];

  return (
    <>
      <Topbar
        title="Users"
        description={loading ? "loading…" : `${total} account${total === 1 ? "" : "s"}`}
        crumbs={["Operations", "Users"]}
      />

      <div className="space-y-6 p-8">
        {error && (
          <Card className="flex items-center gap-2 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="size-4" /> {error}
          </Card>
        )}

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
                  <p className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">
                    {loading ? "—" : s.value.toLocaleString()}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}>
                  {s.badgeText}
                </span>
              </Card>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
          <Card className="overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Roles</p>
              <h3 className="mt-0.5 text-base font-bold text-foreground">User / admin split</h3>
            </div>
            <div className="px-6 py-6">
              <DonutChart segments={roleBreakdown} size={140} thickness={26} centerLabel={total.toString()} centerSub="total" />
            </div>
          </Card>

          <Card className="flex flex-col p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or ID…"
                className="pl-9"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {loading ? "Loading users…" : `${filtered.length} of ${total} shown`}
            </p>
          </Card>
        </section>

        <Card>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading users…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No users found.</div>
          ) : (
            <UsersTable users={filtered} onDelete={handleDelete} />
          )}
        </Card>
      </div>
    </>
  );
}
