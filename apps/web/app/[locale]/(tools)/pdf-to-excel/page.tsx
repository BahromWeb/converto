import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Upload, Sheet, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToExcelClient } from "./pdf-to-excel-client";

export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "PDF to Excel Online — Convert PDF Tables to XLSX, Free, No Watermark",
  description:
    "Convert PDF tables to Excel online — rows, columns, totals preserved. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/pdf-to-excel",
  },
  openGraph: {
    title: "PDF to Excel Online — Convert PDF Tables to XLSX, Free, No Watermark",
    description:
      "Pull tables out of any PDF into an editable Excel workbook. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/pdf-to-excel",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "pdf-to-excel", locale);
}

const howToSteps = [
  { icon: Upload,   name: "Upload your PDF",         text: "Drop the PDF or click to pick it from your device." },
  { icon: Sheet,    name: "We find the tables",      text: "Each PDF page becomes one sheet — rows and columns reconstructed from cell coordinates." },
  { icon: Download, name: "Download the XLSX",        text: "Open in Excel, Google Sheets, or Numbers and start editing." },
];

const faqs = [
  {
    q: "Will the rows and columns line up correctly?",
    a: "Yes — for tables with visible borders or clean column alignment. Free-form text without column structure is harder; we still extract it, but expect to clean up a few cells.",
  },
  {
    q: "Does each PDF page become a separate sheet?",
    a: "Yes. Every PDF page lands in its own worksheet (named Page 1, Page 2, …) so you can re-arrange or delete them independently.",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "excel-to-pdf",  name: "Excel to PDF",   hint: "Convert your workbook back to PDF" },
  { slug: "pdf-to-word",   name: "PDF to Word",    hint: "Edit text instead of tables" },
  { slug: "extract-text",  name: "Extract Text",   hint: "Plain text from any PDF" },
];

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("pdf-to-excel");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to convert a PDF to an Excel workbook online",
            description: "Pull tables from a PDF into an editable .xlsx — rows, columns, totals preserved. No software, no sign-up, no watermark.",
            totalTime: "PT1M",
            tool: { "@type": "HowToTool", name: "convertpdfgo" },
            step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "How to Convert a PDF to Excel Online — Free and Watermark-Free",
            description: "Pull tables out of any PDF into an editable Excel workbook with convertpdfgo — rows, columns, totals preserved. Free, no sign-up, no watermark.",
            datePublished: "2026-01-20",
            dateModified: new Date().toISOString().slice(0, 10),
            author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
            publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/pdf-to-excel" },
            speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
            inLanguage: "en",
            about: { "@type": "Thing", name: "PDF to Excel conversion" },
            keywords: "pdf to excel, pdf to xlsx, convert pdf to excel, pdf table to excel, pdf to spreadsheet",
          }),
        }}
      />

      <ToolPageShell tool={tool} locale={locale} index="27" variant="layout-aware">
        <PdfToExcelClient />

        <div className="mt-6 sm:mt-12 grid gap-3 sm:grid-cols-3">
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

        <div className="mt-8 sm:mt-12 grid gap-6 lg:gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">PDF to Excel FAQ</h2>
            <dl className="mt-4 space-y-3">
              {faqs.map((f) => (
                <div key={f.q} className="speakable-faq rounded-xl border bg-card p-4">
                  <dt className="text-sm font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
            <Link href="/faq" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              See all FAQs <ArrowRight className="size-3" />
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Related PDF tools</h2>
            <div className="mt-4 space-y-2">
              {relatedTools.map((t) => (
                <Link key={t.slug} href={`/${t.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40">
                  <div>
                    <p className="text-sm font-bold group-hover:text-primary">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.hint}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
            <Link href="/tools" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Browse all 49 tools <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
