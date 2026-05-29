import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at convertpdfgo — Build PDF tools the right way",
  description:
    "We're a small remote team building free PDF tools used by people around the world. No open roles right now, but we'd still like to hear from you.",
  alternates: { canonical: "/careers" },
};

const openings = [
  {
    title: "Backend Engineer (Go)",
    location: "Remote · Europe / Central Asia friendly",
    type: "Full-time",
    summary:
      "Own a slice of the conversion pipeline — pdfcpu, Gotenberg, asynq. We're rewriting the worker queue to handle 10x current throughput.",
    href: "mailto:jobs@convertpdfgo.com?subject=Backend Engineer application",
  },
  {
    title: "Frontend Engineer (Next.js)",
    location: "Remote · Any time zone",
    type: "Part-time / contract",
    summary:
      "Help us land the new tool UX kit — drag-drop, progressive disclosure, no spinner gaslighting. React 19, Server Components, Tailwind.",
    href: "mailto:jobs@convertpdfgo.com?subject=Frontend Engineer application",
  },
];

const values = [
  {
    title: "Small team, real ownership",
    body: "Small enough that the person shipping a feature also writes its onboarding email and watches the support inbox the day it goes live. We add a hire only when there's work that genuinely needs another pair of hands.",
  },
  {
    title: "Async + remote",
    body: "Most of the team works from Tashkent and across Europe. Two short standups a week, the rest is GitHub + Linear. No 'jump on a call?' culture.",
  },
  {
    title: "Free time off",
    body: "Unlimited PTO that's actually used — minimum two weeks contiguous per year. We measure output, not seat time.",
  },
  {
    title: "Open source first",
    body: "Backend (Go) and frontend (Next.js) are both open-ish — engineers can read every line. No vendored mystery boxes.",
  },
];

export default function CareersPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Careers</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Build tools people actually like using.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          We're a small remote-first team, four years in, with no investors and no plans to change that. Hiring slowly and intentionally — when we add a person it's because the work itself can't be done alone.
        </p>
      </div>

      {/* Values */}
      <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-2">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-bold">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>

      {/* Open roles */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight">Open roles</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Two right now. Email us with a short note about a tool you wish worked
          differently — that says more than a CV.
        </p>
        <div className="mt-8 space-y-4">
          {openings.map((r) => (
            <a
              key={r.title}
              href={r.href}
              className="group flex flex-col gap-3 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" /> {r.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> {r.type}
                    </span>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.summary}</p>
            </a>
          ))}
        </div>
      </div>

      {/* No-match CTA */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
        <Mail className="mx-auto size-6 text-primary" />
        <h2 className="mt-3 text-xl font-bold">Don&apos;t see your role?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what you&apos;d like to be working on in a year. If it&apos;s on our
          roadmap we&apos;ll hold a slot.
        </p>
        <a
          href="mailto:jobs@convertpdfgo.com"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          jobs@convertpdfgo.com
        </a>
      </div>
    </div>
  );
}
