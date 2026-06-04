import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Download, Aperture, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ImageToTextClient } from "./image-to-text-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Image to Text Online — OCR Any Photo or Screenshot, Free",
  description: "Read text from a JPG, PNG, or screenshot — Tesseract OCR, 100+ languages. Free, no sign-up.",
  alternates: {
    languages: { "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com" },
    canonical: "/image-to-text",
  },
  openGraph: {
    title: "Image to Text Online — OCR Any Photo or Screenshot, Free",
    description: "Read text from a JPG, PNG, or screenshot — Tesseract OCR, 100+ languages. Free, no sign-up.",
    url: "https://convertpdfgo.com/image-to-text",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: Upload, name: "Upload your image", text: "Drop a JPG, PNG, or screenshot. WebP, GIF, BMP, TIFF also work." },
  { icon: Aperture, name: "Pick a language", text: "English by default. 100+ languages, including Uzbek (Latin + Cyrillic) and Cyrillic-script Russian." },
  { icon: Download, name: "Get the text back", text: "Plain UTF-8 text — copy-paste anywhere." },
];

const faqs = [
  { q: "Will it work on a screenshot?", a: "Yes — screenshots are just PNGs. Works especially well on UI text because the pixels are sharp and high-contrast." },
  { q: "Handwriting?", a: "Tesseract is poor at handwriting. Stick to printed text. For handwriting, a dedicated handwriting OCR tool is needed." },
  { q: "Are my files private?", a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour." },
];

const relatedTools = [
  { slug: "ocr-extract-text", name: "OCR Extract Text", hint: "For PDFs not images" },
  { slug: "ocr", name: "OCR PDF", hint: "Add text layer to scanned PDFs" },
  { slug: "ocr-detect-lang", name: "Detect Language", hint: "Find out the script first" },
];

export default function Page() {
  const tool = getToolBySlug("image-to-text");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to image to text",
        description: "Read text from a JPG, PNG, or screenshot — Tesseract OCR, 100+ languages. Free, no sign-up.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Extract Text from an Image or Screenshot — Free, OCR",
        description: "Read text from a JPG, PNG, or screenshot — Tesseract OCR, 100+ languages. Free, no sign-up.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/image-to-text" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "Image to Text" },
        keywords: "image to text, extract text from image, ocr image, screenshot to text",
      }) }} />

      <ToolPageShell tool={tool} index="27" variant="OCR a photo">
        <ImageToTextClient />

        <div className="mt-6 sm:mt-12 grid gap-3 sm:grid-cols-3">
          {howToSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></div>
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Image to Text FAQ</h2>
            <dl className="mt-4 space-y-3">
              {faqs.map((f) => (
                <div key={f.q} className="speakable-faq rounded-xl border bg-card p-4">
                  <dt className="text-sm font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
            <Link href="/faq" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">See all FAQs <ArrowRight className="size-3" /></Link>
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
            <Link href="/tools" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Browse all 49 tools <ArrowRight className="size-3" /></Link>
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
