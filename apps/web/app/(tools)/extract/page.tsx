import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, FileText, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ExtractClient } from "./extract-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Extract PDF Pages Online — Save Selected Pages, Free, No Watermark",
  description:
    "Extract pages from a PDF online — keep only the pages you need as a single new PDF. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/extract",
  },
  openGraph: {
    title: "Extract PDF Pages Online — Save Selected Pages, Free, No Watermark",
    description:
      "Keep only the pages you need from any PDF — as a single new file. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/extract",
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
  { icon: Upload,    name: "Upload your PDF",       text: "Drop the PDF or click to pick it from your device." },
  { icon: FileText,  name: "Pick pages to keep",     text: "Type the pages — like 1-3,5,7-9 — or click them in the picker." },
  { icon: Download,  name: "Download the new PDF",   text: "Hit Extract now — a single PDF with only the chosen pages comes back." },
];

const faqs = [
  {
    q: "Does the output have a watermark?",
    a: "No. The extracted PDF is watermark-free, identical to a desktop save-as.",
  },
  {
    q: "Can I extract a range, or only individual pages?",
    a: "Both. Type a range like 1-3,5,7-9 or use the visual page picker — they produce the same file.",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "split",      name: "Split PDF",     hint: "Break it into separate files" },
  { slug: "removepage", name: "Remove Pages",  hint: "Delete the ones you don't want" },
  { slug: "merge",      name: "Merge PDF",     hint: "Combine PDFs after extracting" },
];

export default function Page() {
  const tool = getToolBySlug("extract");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to extract pages from a PDF online",
            description:
              "Save only the pages you need from a PDF as a single new file — no software, no sign-up, no watermark.",
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
            headline: "How to Extract Pages from a PDF Online — Free and Watermark-Free",
            description:
              "Save only the pages you need from any PDF as a single new file with convertpdfgo — free, no sign-up, no watermark.",
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
              "@id": "https://convertpdfgo.com/extract",
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable-faq"],
            },
            inLanguage: "en",
            about: { "@type": "Thing", name: "PDF page extraction" },
            keywords:
              "extract pages from pdf, extract pdf pages, save pdf pages, pdf page extractor, extract pdf range online free",
          }),
        }}
      />

      <ToolPageShell tool={tool} index="14" variant="visual picker">
        <ExtractClient />

        <div className="mt-6 sm:mt-12 grid gap-3 sm:grid-cols-3">
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

        <div className="mt-8 sm:mt-12 grid gap-6 lg:gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Extract Pages FAQ
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
