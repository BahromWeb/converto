"use client";

import { LocaleLink } from "@/components/ui/locale-link";
import { ArrowRight, LogOut, User } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { siteConfig } from "@converto/data";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useT } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { useState } from "react";

const navItems = [
  { href: "/tools", key: "tools" as const },
  { href: "/#how-it-works", key: "howItWorks" as const },
  { href: "/chat", key: "aiChat" as const },
];

function UserMenu() {
  const { user, logout } = useAuth();
  const t = useT();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
        aria-label="Account menu"
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 min-w-[180px] rounded-lg border border-border bg-card p-1 shadow-lg">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="my-1 h-px bg-border" />
            <LocaleLink
              href="/account"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <User className="size-3.5" />
              {t.auth.profile}
            </LocaleLink>
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
            >
              <LogOut className="size-3.5" />
              {t.auth.signOut}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function SiteHeader() {
  const t = useT();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <LocaleLink href="/" className="flex items-center gap-2.5">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="block h-3 w-3 rounded-sm bg-primary-foreground" />
            <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-foreground" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            {siteConfig.name.toLowerCase()}
          </span>
        </LocaleLink>

        {/* Center nav */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navItems.map((item) => (
            <LocaleLink
              key={item.href}
              href={item.href}
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav[item.key]}
            </LocaleLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          {!loading && (
            user ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
                  asChild
                >
                  <LocaleLink href="/account">{t.nav.signIn}</LocaleLink>
                </Button>
                <Button size="sm" asChild className="px-2.5 sm:px-3">
                  <LocaleLink href="/#hero">
                    <span className="sr-only sm:not-sr-only">{t.nav.getStarted}</span>
                    <ArrowRight className="size-3.5" />
                  </LocaleLink>
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
