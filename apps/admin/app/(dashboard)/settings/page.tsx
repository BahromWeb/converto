import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { Input } from "@converto/ui/components/input";
import { Label } from "@converto/ui/components/label";
import { Separator } from "@converto/ui/components/separator";
import { Switch } from "@converto/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@converto/ui/components/tabs";
import { Topbar } from "@/components/layout/topbar";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <Topbar
        title="Settings"
        description="Configure how Converto runs."
        crumbs={["System", "Settings"]}
      />

      <div className="p-8">
        <Tabs defaultValue="brand" className="max-w-4xl">
          <TabsList>
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API & webhooks</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <Card className="p-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Brand</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  How Converto appears across the public site and outbound email.
                </p>
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site name</Label>
                  <Input id="site-name" defaultValue="Converto" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input id="site-url" defaultValue="https://converto.app" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input id="tagline" defaultValue="PDF tools that don't feel like 2008." />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Security</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Compliance posture and admin access controls.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="size-3.5" />
                  SOC 2 · GDPR
                </span>
              </div>
              <Separator className="my-6" />
              <ul className="space-y-5">
                {[
                  {
                    title: "Require SSO for all admins",
                    body: "Disable username/password sign-in. Admin sessions must come from your IdP.",
                    on: true,
                  },
                  {
                    title: "Two-factor authentication",
                    body: "Enforce TOTP-based 2FA at sign-in for every admin role.",
                    on: true,
                  },
                  {
                    title: "Auto-delete uploaded files",
                    body: "Purge server-processed files within 1 hour of completion.",
                    on: true,
                  },
                  {
                    title: "IP allowlist",
                    body: "Restrict admin access to a defined set of office and VPN IPs.",
                    on: false,
                  },
                ].map((row) => (
                  <li
                    key={row.title}
                    className="flex items-start justify-between gap-4 border-b pb-5 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{row.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{row.body}</p>
                    </div>
                    <Switch defaultChecked={row.on} aria-label={row.title} />
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground">API & webhooks</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Programmatic access keys and outbound notifications.
              </p>
              <Separator className="my-6" />
              <div className="rounded-xl border bg-secondary/50 p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Live key · prefix
                  </span>
                  <span className="text-xs text-muted-foreground">Created May 18, 2026</span>
                </div>
                <p className="mt-2 font-mono text-sm text-foreground">cvt_live_••••••••••••••••L2k7</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">Reveal</Button>
                  <Button variant="outline" size="sm">Rotate</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground">Notifications</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose what triggers an alert to your team.
              </p>
              <Separator className="my-6" />
              <ul className="space-y-5">
                {[
                  { title: "Failed jobs > 1%", on: true },
                  { title: "Latency > 5s for 10 minutes", on: true },
                  { title: "New enterprise sign-up", on: false },
                  { title: "Weekly summary email", on: true },
                ].map((row) => (
                  <li
                    key={row.title}
                    className="flex items-center justify-between border-b pb-5 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-semibold text-foreground">{row.title}</span>
                    <Switch defaultChecked={row.on} aria-label={row.title} />
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
