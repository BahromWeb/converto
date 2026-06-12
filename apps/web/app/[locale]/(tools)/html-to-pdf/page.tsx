import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Upload, Code, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { HtmlToPdfClient } from "./html-to-pdf-client";

export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "HTML to PDF Online — Convert HTML or Webpage to PDF Free, No Watermark",
  description:
    "Convert HTML to PDF online — paste markup or upload a file. CSS, tables, images preserved. Free, no sign-up, no watermark.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/html-to-pdf",
  },
  openGraph: {
    title: "HTML to PDF Online — Convert HTML or Webpage to PDF Free, No Watermark",
    description:
      "Render any HTML — pasted markup or .html file — into a crisp PDF. CSS preserved. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/html-to-pdf",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "html-to-pdf", locale);
}

const howToSteps = [
  { icon: Upload,   name: "Paste HTML or drop a file", text: "Paste your markup into the textarea, or drop an .html file from your device." },
  { icon: Code,     name: "Headless Chrome renders it", text: "We pipe your HTML through a real Chromium engine — CSS, fonts, images, tables all render as you'd expect." },
  { icon: Download, name: "Download the PDF",            text: "Open it in any reader — pixel-identical to what the browser showed." },
];

const faqs = [
  {
    q: "Does CSS work? What about web fonts and JavaScript?",
    a: "Yes to CSS (Flex, Grid, transforms, gradients). Web fonts load if referenced via @import or <link>. JavaScript runs during rendering, so dynamic content shows up — but it's a one-shot render, not an interactive page.",
  },
  {
    q: "What page size does the PDF use?",
    a: "A4 portrait by default. CSS @page rules in your HTML are honoured, so you can set @page { size: Letter landscape; margin: 1in; } to override.",
  },
  {
    q: "Are my files private?",
    a: "Pasted HTML and uploaded files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "url-to-pdf",  name: "URL to PDF",   hint: "Convert a live webpage instead of HTML" },
  { slug: "pdf-to-html", name: "PDF to HTML",  hint: "Go the other direction" },
  { slug: "merge",       name: "Merge PDF",    hint: "Combine with other PDFs" },
];

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("html-to-pdf");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to convert HTML to PDF online",
            description: "Render any HTML — pasted markup or uploaded .html file — as a PDF. CSS, tables, images preserved. No software, no sign-up, no watermark.",
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
            headline: "How to Convert HTML to PDF Online — Free and Watermark-Free",
            description: "Render any HTML markup or .html file as a crisp PDF with convertpdfgo — CSS, tables, images preserved. Free, no sign-up, no watermark.",
            datePublished: "2026-01-20",
            dateModified: new Date().toISOString().slice(0, 10),
            author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
            publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/html-to-pdf" },
            speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
            inLanguage: "en",
            about: { "@type": "Thing", name: "HTML to PDF conversion" },
            keywords: "html to pdf, convert html to pdf, html file to pdf, css to pdf, html to pdf online free",
          }),
        }}
      />

      <ToolPageShell tool={tool} locale={locale} index="29" variant="render-aware">
        <HtmlToPdfClient />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">HTML to PDF FAQ</h2>
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
