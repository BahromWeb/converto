import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Zap, ShieldCheck, Globe } from "lucide-react";


// Marketing pages are mostly static — render at build time and revalidate hourly
// so the next-build picks up locale + tools.length changes within an hour.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "About convertpdfgo — Free PDF tools made for humans",
  description:
    "convertpdfgo started in 2022 to fix what was broken about online PDF tools: watermarks, paywalls, ads. Built by a small remote team for everyone who works with documents.",
  alternates: { canonical: "/about" },
};

const milestones = [
  { year: "2022", title: "Project started", body: "First version shipped with three tools: merge, split, compress. No login, no ads. The premise: web tools people use every day should stay free." },
  { year: "2023", title: "OCR and office conversions", body: "Tesseract-based OCR went live. Added Word, Excel and PowerPoint conversion both ways (via Gotenberg + LibreOffice) — the most-requested feature after the initial launch." },
  { year: "2024", title: "Cloud connections", body: "Dropbox, Google Drive and OneDrive integrations went live so you can pick a file straight from your cloud and get the result back to the same place — no separate download." },
  { year: "2025", title: "20 languages", body: "Localised the entire site to 20 languages based on where visitors were actually coming from — including Uzbek, Russian, Arabic, Chinese, and Hindi. Tool labels, error messages, and the upload flow all translated natively." },
  { year: "2026", title: "AI Chat with PDF + Resume Builder", body: "Launched Chat with PDF (grounded answers with page citations) using Gemini 2.5, then added the AI Resume Builder, ATS scoring, and a cover-letter generator. Word, Excel, and PowerPoint chat work too — converted to PDF behind the scenes." },
];

const values = [
  { icon: Heart, title: "Free where it can be", body: "Every tool is free for individuals — merge, split, compress, convert, OCR, even the AI features. No paid tier, no nag screens, no time-limited trials." },
  { icon: ShieldCheck, title: "Your files are yours", body: "Files auto-delete an hour after processing. We don't train models on them, sell them, or look at them. The infrastructure is on our own servers, not a third-party storage bucket." },
  { icon: Zap, title: "Fast first, pretty second", body: "Heavy work runs on our own servers — not on someone else's edge that gives up at 30 seconds. Files come back in seconds for almost everything, and the progress bars don't lie." },
  { icon: Globe, title: "Built for the long tail", body: "Most online PDF sites optimise for English speakers in the US. We started by adding Uzbek because that's where the early users were. The whole site works in 20 languages now." },
];

export default function AboutPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Since 2022</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          PDF tools that don&apos;t waste your time.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          We started convertpdfgo because every online PDF tool we needed had the same
          tradeoff: free with watermarks and ads, or paid for the basics. Four years
          later, we&apos;re still trying to be the version that doesn&apos;t make you
          pick.
        </p>
      </div>

      {/* Values */}
      <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-2">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.title} className="rounded-2xl border bg-card p-6">
              <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight">How we got here</h2>
        <div className="mt-10 space-y-10">
          {milestones.map((m) => (
            <div key={m.year} className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <div className="text-sm">
                <p className="font-mono font-bold text-primary">{m.year}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-20 max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
        <h2 className="text-2xl font-bold">Try a tool</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The fastest way to see what we&apos;re about. No sign-up required for the basics.
        </p>
        <Link
          href="/tools"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Browse all 49 tools <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
