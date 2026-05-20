"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { siteConfig } from "@converto/data";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useT } from "@/lib/i18n/context";

const navItems = [
  { href: "/tools", key: "tools" as const },
  { href: "/#how-it-works", key: "howItWorks" as const },
  { href: "/chat", key: "aiChat" as const },
];

export function SiteHeader() {
  const t = useT();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="block h-3 w-3 rounded-sm bg-primary-foreground" />
            <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-foreground" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            {siteConfig.name.toLowerCase()}
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
            asChild
          >
            <Link href="/account">{t.nav.signIn}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/#hero">
              {t.nav.getStarted}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
