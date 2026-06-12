import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Upload, FileText, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToWordCard } from "./pdf-to-word-card";

export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "PDF to Word Online — Convert to Editable DOCX, Free, No Watermark",
  description:
    "Convert PDF to Word online — flowing paragraphs, headings, lists, tables. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/pdf-to-word",
  },
  openGraph: {
    title: "PDF to Word Online — Convert to Editable DOCX, Free, No Watermark",
    description:
      "Convert PDF to fully editable Word — flowing text, headings, lists, tables. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/pdf-to-word",
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

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "pdf-to-word", locale);
}

const howToSteps = [
  { icon: Upload,   name: "Upload your PDF",      text: "Drop the PDF or click to pick it from your device." },
  { icon: FileText, name: "Wait a few seconds",   text: "We rebuild paragraphs, headings, lists, and tables — not pasted text boxes." },
  { icon: Download, name: "Download the DOCX",    text: "Open it in Word, Google Docs, or LibreOffice and edit normally." },
];

const faqs = [
  {
    q: "Will the Word file be actually editable, not just text boxes?",
    a: "Yes. Output uses real paragraphs, headings, lists, and tables — no floating shapes, so editing in Word feels normal.",
  },
  {
    q: "Will my formatting (bold, italic, fonts) survive?",
    a: "Inline formatting like bold, italic, and underlines is preserved. Fonts are matched to the closest installed family in Word.",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "word-to-pdf",  name: "Word to PDF",   hint: "Convert it back to PDF" },
  { slug: "pdf-to-excel", name: "PDF to Excel",  hint: "Pull tables into a spreadsheet" },
  { slug: "extract-text", name: "Extract Text",   hint: "Plain text, no formatting" },
];

export default async function PdfToWordPage(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("pdf-to-word");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to convert a PDF to Word online",
            description:
              "Convert a PDF to an editable .docx with flowing paragraphs, headings, lists, and tables — no software, no sign-up, no watermark.",
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
            headline: "How to Convert a PDF to Word Online — Free and Watermark-Free",
            description:
              "Convert any PDF to an editable .docx with convertpdfgo — flowing paragraphs, headings, lists, tables. Free, no sign-up, no watermark.",
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
              "@id": "https://convertpdfgo.com/pdf-to-word",
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable-faq"],
            },
            inLanguage: "en",
            about: { "@type": "Thing", name: "PDF to Word conversion" },
            keywords:
              "pdf to word, pdf to docx, convert pdf to word, pdf to word online free, pdf to editable word",
          }),
        }}
      />

      <ToolPageShell tool={tool} locale={locale} index="05" variant="layout-aware">
        <PdfToWordCard />

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
              PDF to Word FAQ
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
