"use client";

import { useEffect, useState, type FormEvent } from "react";
import { LogOut, ShieldCheck, Mail, BadgeCheck, CalendarDays, Loader2, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Button } from "@converto/ui/components/button";
import { Input } from "@converto/ui/components/input";
import { Label } from "@converto/ui/components/label";
import { Topbar } from "@/components/layout/topbar";
import { apiGet, apiSend, clearSession } from "@/lib/api";

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

  // Change-password form
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwOk, setPwOk] = useState(false);
  const [pwError, setPwError] = useState("");

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

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwOk(false);
    if (next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setPwError("New password and confirmation do not match.");
      return;
    }
    setPwBusy(true);
    try {
      await apiSend("/me/password", "PUT", { current_password: current, new_password: next });
      setPwOk(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setPwBusy(false);
    }
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

        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <KeyRound className="size-4 text-muted-foreground" />
            <div>
              <h3 className="text-base font-bold text-foreground">Change password</h3>
              <p className="text-xs text-muted-foreground">Update the password you use to sign in.</p>
            </div>
          </div>
          <form onSubmit={changePassword} className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="current" className="text-sm font-semibold">Current password</Label>
              <Input
                id="current"
                type="password"
                autoComplete="current-password"
                required
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="next" className="text-sm font-semibold">New password</Label>
                <Input
                  id="next"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-sm font-semibold">Confirm new password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            {pwError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600">
                <AlertCircle className="size-4 shrink-0" /> {pwError}
              </div>
            )}
            {pwOk && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0" /> Password updated successfully.
              </div>
            )}

            <Button type="submit" disabled={pwBusy}>
              {pwBusy ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              Update password
            </Button>
          </form>
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
