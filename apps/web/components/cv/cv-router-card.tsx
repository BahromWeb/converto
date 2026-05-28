"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * Shared landing card for every CAREER tool that funnels into /cv-builder.
 * All 8 tools share a single backend; each page is an SEO landing with
 * its own value prop, but every CTA lands on /cv-builder with a focused
 * mode/intent query string so the editor opens in the right state.
 */
export function CVRouterCard({
  intent,
  primaryCTA,
  secondaryCTA,
  benefits,
  note,
}: {
  intent: string;
  primaryCTA: string;
  secondaryCTA?: string;
  benefits: string[];
  note?: string;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">
          Step into the editor
        </div>
        <h2 className="mt-2 text-2xl font-bold text-foreground">
          One click — start building
        </h2>
        <p className="mt-3 text-muted-foreground">
          Sign in once, then pick your starting point. Your CV is saved
          automatically as you go.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/cv-builder${intent}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {primaryCTA}
            <ArrowRight className="size-4" />
          </Link>
          {secondaryCTA && (
            <Link
              href="/cv-builder"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              {secondaryCTA}
            </Link>
          )}
        </div>
        {note && (
          <p className="mt-4 text-xs text-muted-foreground">{note}</p>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          What you get
        </h3>
        <ul className="mt-4 space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
