"use client";

import { useEffect, useState } from "react";
import { LogOut, ShieldCheck, Mail, BadgeCheck, CalendarDays, Loader2 } from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Button } from "@converto/ui/components/button";
import { Topbar } from "@/components/layout/topbar";
import { apiGet, clearSession } from "@/lib/api";

interface Me {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  created_at?: string;
}

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Me>("/me")
      .then(setMe)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    clearSession();
    window.location.href = "/login";
  }

  const rows = [
    { icon: BadgeCheck, label: "Name", value: me?.name?.trim() || "—" },
    { icon: Mail, label: "Email", value: me?.email || "—" },
    { icon: ShieldCheck, label: "Role", value: me?.role || "—" },
    { icon: BadgeCheck, label: "Status", value: me?.status || "—" },
    {
      icon: CalendarDays,
      label: "Member since",
      value: me?.created_at ? new Date(me.created_at).toLocaleDateString() : "—",
    },
  ];

  return (
    <>
      <Topbar title="Settings" description="Your admin account." crumbs={["Account", "Settings"]} />

      <div className="max-w-2xl space-y-6 p-8">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-base font-bold text-foreground">Account</h3>
            <p className="text-xs text-muted-foreground">Signed-in admin profile (read-only).</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => {
                const Icon = r.icon;
                return (
                  <li key={r.label} className="flex items-center gap-3 px-6 py-3.5">
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="w-32 shrink-0 text-sm text-muted-foreground">{r.label}</span>
                    <span className="truncate text-sm font-medium capitalize text-foreground">{r.value}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-foreground">Sign out</p>
            <p className="text-xs text-muted-foreground">End this admin session on this device.</p>
          </div>
          <Button variant="outline" onClick={logout} className="text-destructive">
            <LogOut className="size-4" />
            Log out
          </Button>
        </Card>

        <p className="text-xs text-muted-foreground">
          Platform configuration (branding, OAuth, mail, limits) is managed server-side via
          environment variables — there are no editable settings here by design.
        </p>
      </div>
    </>
  );
}
