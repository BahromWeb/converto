import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail, Copy } from "lucide-react";

export const metadata: Metadata = {
  title: "Press Kit — convertpdfgo brand assets and quick facts",
  description:
    "Logos, brand colours, screenshots, and quick facts about convertpdfgo. Press enquiries: press@convertpdfgo.com.",
  alternates: { canonical: "/press" },
};

const facts = [
  { label: "Founded", value: "2022" },
  { label: "Headquarters", value: "Remote (Tashkent + EU)" },
  { label: "Team size", value: "5 engineers" },
  { label: "Tools shipped", value: "37 (and counting)" },
  { label: "Languages", value: "20" },
  { label: "Files processed", value: "Live counter on the homepage" },
  { label: "Funding", value: "Self-funded, no investors" },
  { label: "Pricing", value: "Free forever for the core; Pro tier for AI-heavy features" },
];

const colors = [
  { name: "Signal orange", hex: "#E35323", role: "Primary CTA, accents" },
  { name: "Paper cream", hex: "#FAF6EE", role: "Light-mode background" },
  { name: "Ink", hex: "#0F0E0C", role: "Foreground / dark-mode background" },
];

export default function PressPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Press Kit</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Brand assets and quick facts.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Everything you need to write about convertpdfgo without emailing us first.
          Logos below are free to use in editorial coverage with attribution.
        </p>
      </div>

      {/* Logo downloads */}
      <div className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-bold">Logo</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "SVG (vector)", href: "/favicon.svg", note: "scales cleanly" },
            { label: "PNG 512×512", href: "/icon-512.png", note: "for slides" },
            { label: "PNG 192×192", href: "/icon-192.png", note: "for thumbnails" },
          ].map((logo) => (
            <a
              key={logo.label}
              href={logo.href}
              download
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <span className="relative grid h-8 w-8 place-items-center">
                  <span className="block h-3 w-3 rounded-sm bg-primary-foreground" />
                  <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-foreground" />
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">{logo.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{logo.note}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Download className="size-3" /> Download
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Brand colours */}
      <div className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-bold">Colours</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {colors.map((c) => (
            <div key={c.hex} className="rounded-2xl border bg-card p-6">
              <div
                className="h-20 rounded-xl"
                style={{ backgroundColor: c.hex }}
                aria-hidden
              />
              <p className="mt-4 text-sm font-bold">{c.name}</p>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                {c.hex}
                <Copy className="size-3" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{c.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick facts */}
      <div className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-bold">Quick facts</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
          <dl className="divide-y">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[1fr_2fr] gap-4 p-4 sm:p-5">
                <dt className="text-sm font-semibold text-muted-foreground">{f.label}</dt>
                <dd className="text-sm text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

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
        <p className="mt-6 text-xs text-muted-foreground">
          Looking for a job?{" "}
          <Link href="/careers" className="text-primary hover:underline">
            See open roles
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
