import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Scissors, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { SplitCard } from "./split-card";

// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Split PDF Online — Extract Pages by Range, Free, No Watermark",
  description:
    "Split a PDF online — extract specific pages or split by page range. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/split",
  },
  openGraph: {
    title: "Split PDF Online — Extract Pages by Range, Free, No Watermark",
    description:
      "Split a PDF into multiple files. Extract specific pages, split by page range, or break it apart in seconds.",
    url: "https://convertpdfgo.com/split",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "convertpdfgo — free PDF tools",
        type: "image/png",
      },
    ],
  },
};

const howToSteps = [
  { icon: Upload,   name: "Upload your PDF",     text: "Drop the PDF or click to pick it from your device." },
  { icon: Scissors, name: "Pick pages to split", text: "Enter a range like 1-5 or click pages on the visual picker." },
  { icon: Download, name: "Download the pieces", text: "Hit Split now — each piece comes back as its own PDF." },
];

const faqs = [
  {
    q: "Will the split PDFs have a watermark?",
    a: "No. Every output file is watermark-free, identical to a desktop split.",
  },
  {
    q: "Can I split by page range or only one page at a time?",
    a: "Both. Type a range like 1-5,8,10-15 or use the visual page picker to click the pages you want.",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "merge",      name: "Merge PDF",        hint: "Combine the splits back later" },
  { slug: "extract",    name: "Extract Pages",    hint: "Pull just the pages you need" },
  { slug: "removepage", name: "Remove Pages",     hint: "Drop pages you don't want" },
];

export default function SplitPage() {
  const tool = getToolBySlug("split");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to split a PDF file online",
            description:
              "Break a PDF into multiple files by page range or extract specific pages — no software, no sign-up.",
            totalTime: "PT1M",
            tool: { "@type": "HowToTool", name: "convertpdfgo" },
            step: howToSteps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.name,
              text: s.text,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "How to Split a PDF Online — Free and Watermark-Free",
            description:
              "Break a PDF into multiple files or extract a page range with convertpdfgo — free, no sign-up, no watermark.",
            datePublished: "2026-01-20",
            dateModified: new Date().toISOString().slice(0, 10),
            author: {
              "@type": "Organization",
              name: "convertpdfgo",
              url: "https://convertpdfgo.com",
            },
            publisher: {
              "@type": "Organization",
              name: "convertpdfgo",
              logo: {
                "@type": "ImageObject",
                url: "https://convertpdfgo.com/icon-512.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://convertpdfgo.com/split",
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable-faq"],
            },
            inLanguage: "en",
            about: { "@type": "Thing", name: "PDF page splitting" },
            keywords:
              "split pdf, split pdf by page range, split pdf into multiple files, pdf splitter, split pdf online free",
          }),
        }}
      />

      <ToolPageShell tool={tool} index="02" variant="visual picker">
        <SplitCard />

        {/* Compact info row — ilovepdf/smallpdf style */}
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {howToSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className="flex items-start gap-3 rounded-xl border bg-card p-4"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-muted-foreground">
                    0{i + 1}
                  </p>
                  <p className="text-sm font-bold">{s.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Split PDF FAQ
            </h2>
            <dl className="mt-4 space-y-3">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="speakable-faq rounded-xl border bg-card p-4"
                >
                  <dt className="text-sm font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/faq"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              See all FAQs <ArrowRight className="size-3" />
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Related PDF tools
            </h2>
            <div className="mt-4 space-y-2">
              {relatedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <div>
                    <p className="text-sm font-bold group-hover:text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.hint}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
            <Link
              href="/tools"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Browse all 49 tools <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
