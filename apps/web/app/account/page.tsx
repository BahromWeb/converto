"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FileText,
  Cloud,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";
import { Card } from "@converto/ui/components/card";
import { Button } from "@converto/ui/components/button";
import { SignInCard } from "@/components/auth/sign-in-card";
import { useAuth } from "@/lib/auth/context";
import { useT } from "@/lib/i18n/context";

/**
 * /account is doing double duty:
 *   - logged-out: show the OAuth sign-in card (existing behaviour)
 *   - logged-in: account dashboard — profile summary + quick links to
 *     My Files, Cloud Connections, Chat History, Settings, plus a
 *     prominent Sign-out button
 *
 * Keeping both flows on the same URL means the same "/account" link in
 * the header lands the user on the right page regardless of auth state.
 */
export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const t = useT();
  const [signingOut, setSigningOut] = useState(false);

  // While we're hydrating from localStorage + GET /me, render a spinner
  // instead of flashing the sign-in card.
  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ─── Logged-out: OAuth sign-in card ──────────────────────────────────
  if (!user) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <span className="block h-3 w-3 rounded-sm bg-primary-foreground" />
                <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-foreground" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">
                convertpdfgo
              </span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-foreground">
              {t.auth.welcomeBack}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.auth.signInSubtitle}
            </p>
          </div>

          <SignInCard className="mt-8" />

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t.auth.agreePrefix}{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              {t.auth.terms}
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              {t.auth.privacyPolicy}
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  // ─── Logged-in: account dashboard ────────────────────────────────────

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinedDate = (user as { created_at?: string }).created_at
    ? new Date((user as { created_at: string }).created_at).toLocaleDateString(
        undefined,
        { year: "numeric", month: "long", day: "numeric" },
      )
    : null;

  const quickLinks = [
    {
      href: "/account/files",
      icon: FileText,
      title: "My Files",
      description: "Recently uploaded PDFs and conversion outputs.",
    },
    {
      href: "/chat",
      icon: Sparkles,
      title: "Chat with PDF",
      description: "Continue an AI conversation with one of your documents.",
    },
    {
      href: "/account/connections",
      icon: Cloud,
      title: "Cloud Connections",
      description: "Dropbox, Google Drive, OneDrive — save outputs directly.",
    },
  ];

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-2xl font-bold text-primary-foreground shadow-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-2xl font-bold">{user.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5" />
              <span className="truncate">{user.email}</span>
            </p>
            {joinedDate && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                Joined {joinedDate}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={signingOut}
            className="shrink-0 gap-2 text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            {signingOut ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            {t.auth.signOut}
          </Button>
        </div>
      </Card>

      {/* Quick links grid */}
      <div className="mt-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Quick access
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{link.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Settings stub — wired to existing widgets when they exist, links
          otherwise so the section still gives the user somewhere to go */}
      <div className="mt-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Settings
        </h2>
        <Card className="divide-y">
          <SettingsRow
            icon={Cloud}
            title="Cloud storage"
            description="Connect or disconnect Dropbox / Drive / OneDrive."
            href="/account/connections"
          />
          <SettingsRow
            icon={FileText}
            title="My files"
            description="Manage uploaded documents and conversion outputs."
            href="/account/files"
          />
        </Card>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-center text-xs text-muted-foreground">
        Need to delete your account? Email{" "}
        <a href="mailto:support@convertpdfgo.com" className="text-primary hover:underline">
          support@convertpdfgo.com
        </a>
        .
      </p>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 transition-colors hover:bg-accent"
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}
