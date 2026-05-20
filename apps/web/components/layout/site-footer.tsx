"use client";

import Link from "next/link";
import { footerNav, siteConfig } from "@converto/data";
import { useT } from "@/lib/i18n/context";

const colKeys = ["product", "resources", "company", "legal"] as const;

export function SiteFooter() {
  const t = useT();

  const colLabels: Record<(typeof colKeys)[number], string> = {
    product: t.footer.product,
    resources: t.footer.resources,
    company: t.footer.company,
    legal: t.footer.legal,
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container pt-16 pb-8">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary">
                <span className="block h-3 w-3 rounded-sm bg-primary-foreground" />
                <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-background" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                {siteConfig.name.toLowerCase()}
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-background/60">
              {t.footer.tagline}
            </p>

            <p className="mt-4 text-xs text-background/35">{t.footer.promise}</p>
          </div>

          {/* Nav columns */}
          {colKeys.map((col) => (
            <div key={col}>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-background/35">
                {colLabels[col]}
              </h4>
              <ul className="space-y-3">
                {footerNav[col].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-background/70 transition-colors hover:text-background"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/40 md:flex-row md:items-center">
          <span className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {t.footer.allSystems}
          </span>
          <span>{t.footer.madeWith}</span>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="relative overflow-hidden border-t border-background/10 py-5">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-bold text-6xl text-background/[0.05] md:text-8xl">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex gap-12">
              <span>converto</span>
              <span className="text-primary/20">·</span>
              <span>pdf tools</span>
              <span className="text-primary/20">·</span>
              <span>made for humans</span>
              <span className="text-primary/20">·</span>
              <span>free forever</span>
              <span className="text-primary/20">·</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
