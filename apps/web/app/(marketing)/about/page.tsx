import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Zap, ShieldCheck, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About convertpdfgo — Free PDF tools made for humans",
  description:
    "convertpdfgo started in 2022 to fix what was broken about online PDF tools: watermarks, paywalls, ads. Built by a small remote team for everyone who works with documents.",
  alternates: { canonical: "/about" },
};

const milestones = [
  { year: "2022", title: "Built in a weekend", body: "First version shipped with three tools: merge, split, compress. No login, no ads. The idea: web PDF tools should be free forever for the things people do every day." },
  { year: "2023", title: "Past 1M files", body: "Crossed one million PDFs processed. Added OCR, watermarks, and the first batch of office-format conversions (Word ↔ PDF, Excel → PDF). Hetzner servers couldn't keep up — moved to a bigger box." },
  { year: "2024", title: "Cloud connections", body: "Dropbox, Google Drive, OneDrive integrations went live. Made it possible to never download a file just to convert it — pick it from your cloud, get the result back to the same place." },
  { year: "2025", title: "Now in 20 languages", body: "Localised the entire site to 20 languages — including Uzbek and Arabic — based on where the traffic was actually coming from. Tool labels, error messages, and the upload flow all translated." },
  { year: "2026", title: "AI chat for PDFs", body: "Launched Chat with PDF using Gemini for grounded answers with page citations. Now lets you upload Word/Excel/PowerPoint too — they get converted to PDF behind the scenes." },
];

const values = [
  { icon: Heart, title: "Free where it can be", body: "The core tools — merge, split, compress, convert — stay free forever. Paid features only land if the bill genuinely needs to be split (AI compute is the main one)." },
  { icon: ShieldCheck, title: "Your files are yours", body: "Files auto-delete an hour after processing. We don't train models on them, sell them, or look at them. The infrastructure is on our own servers, not a third-party storage bucket." },
  { icon: Zap, title: "Fast first, pretty second", body: "Every tool runs in the browser when it can. The heavy lifting happens on real servers, not edge functions that time out at 30 seconds. No spinners that lie." },
  { icon: Globe, title: "Built for the long tail", body: "Most online PDF sites optimise for English speakers in the US. We started by adding Uzbek because that's where the early users were. The whole site works in 20 languages now." },
];

export default function AboutPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Since 2022</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
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
