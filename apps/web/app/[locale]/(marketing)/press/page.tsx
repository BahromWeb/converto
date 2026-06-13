import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Copy, Image as ImageIcon, Link2, Github } from "lucide-react";
import { tools } from "@converto/data";
import { locales } from "@/lib/i18n/locales";


// Marketing pages are mostly static — render at build time and revalidate hourly
// so the next-build picks up locale + tools.length changes within an hour.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Press Kit — convertpdfgo brand assets and quick facts",
  description:
    "Logos, brand colours, screenshots, and quick facts about convertpdfgo. Press enquiries: press@convertpdfgo.com.",
  alternates: { canonical: "/press" },
};

// Derived from the same source of truth the marketing pages use, so the
// numbers can never drift from what's actually shipped.
const TOOL_COUNT = tools.length;
const LOCALE_COUNT = Object.keys(locales).length;

const facts: Array<{ label: string; value: string }> = [
  { label: "Founded",        value: "2022, in Tashkent" },
  { label: "Team",           value: "Small, distributed, no fixed HQ" },
  { label: "Tools shipped",  value: `${TOOL_COUNT}, across PDF / Office / OCR / AI` },
  { label: "Languages",      value: `${LOCALE_COUNT} — including Uzbek, Russian, Arabic, Chinese, Hindi` },
  { label: "Pricing",        value: "Free for individuals, forever. No paid tier, no ads." },
  { label: "Funding",        value: "Self-funded, no investors" },
  { label: "Stack",          value: "Go (api + worker), Next.js 15 (web), PostgreSQL + Redis" },
  { label: "Auto-delete",    value: "Every uploaded file is wiped within 60 minutes" },
];

const colors = [
  { name: "Signal orange", hex: "#E35323", role: "Primary CTA, accents" },
  { name: "Paper cream",   hex: "#FAF6EE", role: "Light-mode background" },
  { name: "Ink",           hex: "#0F0E0C", role: "Foreground / dark-mode background" },
];

const logos = [
  { label: "SVG (vector)",   href: "/favicon.svg",          note: "Scales cleanly. Use for print and slides." },
  { label: "PNG 300×300",    href: "/linkedin-logo-300.png", note: "Round avatar — social profiles." },
  { label: "PNG 400×400",    href: "/linkedin-logo-400.png", note: "Square, full-bleed background." },
  { label: "PNG 800×800",    href: "/linkedin-logo-800.png", note: "High-DPI displays." },
  { label: "Cover SVG",      href: "/linkedin-cover-clean.svg", note: "Wide banner, no text." },
  { label: "Cover PNG",      href: "/linkedin-cover-clean-1128x191.png", note: "LinkedIn / X cover size." },
];

const usageDos = [
  "Use the word convertpdfgo as one word — no hyphen, all lowercase.",
  "Pair the logo with at least 16 px clear space on every side.",
  "Use Signal Orange on light surfaces; Paper Cream on dark surfaces.",
];

const usageDonts = [
  "Don't recolour the wordmark or apply gradients.",
  "Don't add 'PDF' as a tagline next to the logo — the wordmark already says it.",
  "Don't squash, stretch, or rotate the logo for layout reasons.",
];

const oneLiners = [
  "convertpdfgo is a free toolbox of 49 PDF tools — merge, split, compress, convert, OCR, plus AI features like Chat-with-PDF and Resume Builder. No paid tier, no watermarks, files auto-delete in an hour.",
  "Built in Tashkent in 2022 to fix what was broken about online PDF tools: watermarks, paywalls, ads. Now available in 27 languages and used by people who need a PDF turned into something else fast.",
];

export default function PressPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Press Kit</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Brand assets and quick facts.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Everything you need to write about convertpdfgo without emailing us
          first. Logos are free to use in editorial coverage with attribution.
        </p>
      </div>

      {/* Logo downloads */}
      <Section title="Logo">
        <p className="mb-6 text-sm text-muted-foreground">
          The orange dot is the recognizable bit. Use the SVG when you can — it
          stays crisp at any size.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logos.map((l) => (
            <a
              key={l.href}
              href={l.href}
              download
              className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="grid place-items-center rounded-xl bg-secondary/40 p-6">
                <ImageIcon className="size-8 text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">{l.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l.note}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* Colors */}
      <Section title="Colours">
        <div className="grid gap-4 sm:grid-cols-3">
          {colors.map((c) => (
            <div key={c.hex} className="rounded-2xl border bg-card p-6">
              <div className="h-20 rounded-xl border" style={{ backgroundColor: c.hex }} aria-hidden />
              <p className="mt-4 text-sm font-bold">{c.name}</p>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                {c.hex} <Copy className="size-3" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{c.role}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Usage do / don't */}
      <Section title="Logo usage">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Do
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {usageDos.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
              Don&apos;t
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {usageDonts.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose-500" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Quick facts */}
      <Section title="Quick facts">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <dl className="divide-y">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-1 gap-1.5 p-4 sm:grid-cols-[1fr_2fr] sm:gap-4 sm:p-5">
                <dt className="text-sm font-semibold text-muted-foreground">{f.label}</dt>
                <dd className="text-sm text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Boilerplate copy */}
      <Section title="Boilerplate (steal these)">
        <div className="space-y-3">
          {oneLiners.map((line, i) => (
            <div key={i} className="rounded-2xl border bg-card p-5">
              <p className="text-sm leading-relaxed">{line}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                {i === 0 ? "55 words · product-first" : "44 words · founder story"}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
        <Mail className="mx-auto size-6 text-primary" />
        <h2 className="mt-3 text-xl font-bold">Press enquiries</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Need a quote, an interview, or higher-resolution assets? Email us — we
          reply within a working day.
        </p>
        <a
          href="mailto:press@convertpdfgo.com"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          press@convertpdfgo.com
        </a>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
          <Link href="/careers" className="inline-flex items-center gap-1 text-primary hover:underline">
            <Link2 className="size-3" /> Open roles
          </Link>
          <a
            href="https://github.com/convertpdfgo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <Github className="size-3" /> GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}
