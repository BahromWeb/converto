import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, FileX, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { RemovePageClient } from "./removepage-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Remove Pages from PDF Online — Delete Pages Free, No Watermark",
  description:
    "Remove pages from a PDF online — drop specific pages or page ranges in seconds. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/removepage",
  },
  openGraph: {
    title: "Remove Pages from PDF Online — Delete Pages Free, No Watermark",
    description:
      "Drop specific pages or page ranges from any PDF. Free, no sign-up, no watermark — in seconds.",
    url: "https://convertpdfgo.com/removepage",
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
  { icon: Upload, name: "Upload your PDF",     text: "Drop the PDF or click to pick it from your device." },
  { icon: FileX,  name: "Pick pages to delete", text: "Type the pages — like 2,5-7,9 — or click them in the picker." },
  { icon: Download, name: "Download the result", text: "Hit Remove now — a single PDF without those pages comes back." },
];

const faqs = [
  {
    q: "Will the output PDF have a watermark?",
    a: "No. The page-trimmed file is watermark-free, identical to a desktop edit.",
  },
  {
    q: "Can I delete a page range, not just one page?",
    a: "Yes. Type a range like 2,5-7,9 or use the visual picker to click pages — both work.",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "split",   name: "Split PDF",     hint: "Break it into separate files" },
  { slug: "extract", name: "Extract Pages", hint: "Save only the pages you need" },
  { slug: "merge",   name: "Merge PDF",     hint: "Combine PDFs after trimming" },
];

export default function Page() {
  const tool = getToolBySlug("removepage");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to remove pages from a PDF online",
            description:
              "Delete specific pages or page ranges from a PDF — no software, no sign-up, no watermark.",
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
            headline: "How to Remove Pages from a PDF Online — Free and Watermark-Free",
            description:
              "Delete pages or a page range from any PDF with convertpdfgo — free, no sign-up, no watermark.",
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
              "@id": "https://convertpdfgo.com/removepage",
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable-faq"],
            },
            inLanguage: "en",
            about: { "@type": "Thing", name: "PDF page removal" },
            keywords:
              "remove pages from pdf, delete pages pdf, remove page pdf online, pdf page remover, delete pdf pages free",
          }),
        }}
      />

      <ToolPageShell tool={tool} index="13" variant="visual picker">
        <RemovePageClient />

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
              Remove Pages FAQ
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
