import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Upload, MousePointerClick, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { MergeCard } from "./merge-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "Merge PDF Without Watermark — Free Online PDF Merger",
  description:
    "Combine PDF files online in the exact order you want. No watermark, no sign-up, no file size limit. Drag, drop, merge — works on mobile and desktop.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/merge" },
    openGraph: {
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "convertpdfgo — free PDF tools",
        type: "image/png",
      },
    ],
    title: "Merge PDF Without Watermark — Free Online PDF Merger",
    description:
      "Combine PDF files in seconds. No watermark, no signup, no limit.",
    url: "https://convertpdfgo.com/merge",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "merge", locale);
}

// Schemas live in JSON-LD only — invisible to users, fully readable by
// Google for rich-snippet eligibility. Keeps the page visually clean
// while still claiming the SEO real estate.

const howToSteps = [
  { icon: Upload,            name: "Upload your PDFs",   text: "Drag or click to add the files you want to merge." },
  { icon: MousePointerClick, name: "Reorder if needed", text: "Drag the cards into the order you want pages to appear." },
  { icon: Download,          name: "Download merged",    text: "Hit Merge now — the combined PDF downloads automatically." },
];

const faqs = [
  {
    q: "Is the merged PDF watermarked?",
    a: "No. Output is watermark-free, bit-for-bit clean.",
  },
  {
    q: "What's the file size limit?",
    a: "30 MB per file as a guest, 50 MB when signed in. No daily cap.",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "split",    name: "Split PDF",    hint: "Break a PDF apart"           },
  { slug: "compress", name: "Compress PDF", hint: "Shrink the merged file"      },
  { slug: "removepage", name: "Remove Pages", hint: "Drop pages you don't need" },
];

export default async function MergePage(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("merge");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to merge PDF files online",
            description:
              "Combine multiple PDFs into a single file with convertpdfgo — no software, no sign-up.",
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
            headline: "How to Merge PDF Files Online — Free and Watermark-Free",
            description:
              "Step-by-step guide to merging PDF files online with convertpdfgo — no software, no sign-up, no watermark.",
            datePublished: "2026-01-15",
            dateModified: new Date().toISOString().slice(0, 10),
            author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
            publisher: {
              "@type": "Organization",
              name: "convertpdfgo",
              logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/merge" },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable-faq"],
            },
            inLanguage: "en",
            about: { "@type": "Thing", name: "PDF document merging" },
            keywords: "merge pdf, combine pdf, pdf merger, merge pdf without watermark, pdf merge online free",
          }),
        }}
      />
      <ToolPageShell tool={tool} locale={locale} index="01" variant="drag-to-reorder">
        <MergeCard />

        {/* Compact info row — same style as ilovepdf / smallpdf */}
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {howToSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-muted-foreground">0{i + 1}</p>
                  <p className="text-sm font-bold">{s.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 short FAQ + 3 related tools — single row each */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Merge PDF FAQ
            </h2>
            <dl className="mt-4 space-y-3">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-xl border bg-card p-4">
                  <dt className="text-sm font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.a}</dd>
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
                    <p className="text-sm font-bold group-hover:text-primary">{t.name}</p>
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
