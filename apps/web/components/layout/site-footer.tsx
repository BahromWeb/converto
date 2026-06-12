"use client";

import { LocaleLink } from "@/components/ui/locale-link";
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
            <LocaleLink href="/" className="flex items-center gap-2.5">
              <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary">
                <span className="block h-3 w-3 rounded-sm bg-primary-foreground" />
                <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-background" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                {siteConfig.name.toLowerCase()}
              </span>
            </LocaleLink>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-background/60">
              {t.footer.tagline}
            </p>

            <p className="mt-4 text-xs text-background/70">{t.footer.promise}</p>

            {/* Social + contact — three platforms we actually post on,
                plus an Uzbekistan phone number for direct support. */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://t.me/convertpdfgo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram channel"
                title="Telegram channel · @convertpdfgo"
                className="grid size-9 place-items-center rounded-lg border border-background/15 bg-background/[0.04] text-background/70 transition-colors hover:border-primary/40 hover:bg-primary/15 hover:text-background"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                  <path d="M9.04 15.6 8.9 19.4c.43 0 .61-.18.82-.4l1.97-1.88 4.08 2.98c.75.41 1.28.2 1.48-.69l2.68-12.55v-.01c.23-1.1-.4-1.54-1.13-1.26L3.05 9.27c-1.08.41-1.07 1-.18 1.27l4.21 1.31 9.78-6.15c.46-.3.88-.13.53.17z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/convertpdfgo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid size-9 place-items-center rounded-lg border border-background/15 bg-background/[0.04] text-background/70 transition-colors hover:border-primary/40 hover:bg-primary/15 hover:text-background"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0h.01z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@convertpdfgo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid size-9 place-items-center rounded-lg border border-background/15 bg-background/[0.04] text-background/70 transition-colors hover:border-primary/40 hover:bg-primary/15 hover:text-background"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>
                </svg>
              </a>
            </div>

            <a
              href="tel:+998949105242"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-background/85 transition-colors hover:text-primary"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
              </svg>
              +998 94 910 52 42
            </a>

            <p className="mt-1 text-xs text-background/65">
              Mon–Fri · 9:00–18:00 UZT
            </p>
          </div>

          {/* Nav columns */}
          {colKeys.map((col) => (
            <div key={col}>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-background/70">
                {colLabels[col]}
              </h3>
              <ul className="space-y-3">
                {footerNav[col].map((item) => (
                  <li key={item.href}>
                    <LocaleLink
                      href={item.href}
                      className="text-sm text-background/70 transition-colors hover:text-background"
                    >
                      {item.label}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/65 md:flex-row md:items-center">
          <span className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {t.footer.allSystems}
          </span>
          <span>{t.footer.madeWith}</span>
        </div>
      </div>
</footer>
  );
}
