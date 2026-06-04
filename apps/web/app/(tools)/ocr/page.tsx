import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Download, ScanText, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { OcrCard } from "./ocr-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OCR PDF Online — Make Scanned PDFs Searchable, Free",
  description: "Run OCR on a scanned PDF — add a searchable text layer so you can copy-paste and search. Free, no sign-up, no watermark.",
  alternates: {
    languages: { "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com" },
    canonical: "/ocr",
  },
  openGraph: {
    title: "OCR PDF Online — Make Scanned PDFs Searchable, Free",
    description: "Run OCR on a scanned PDF — add a searchable text layer so you can copy-paste and search. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/ocr",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: Upload, name: "Upload your scanned PDF", text: "Drop the PDF or click to pick. Images embedded in the PDF will be recognised." },
  { icon: ScanText, name: "Pick a language", text: "English by default. We support 100+ languages including Uzbek (Latin + Cyrillic), Russian, Spanish, Arabic, Chinese." },
  { icon: Download, name: "Download the searchable PDF", text: "Same visual layout, but now with a text layer underneath — copy, paste, search all work." },
];

const faqs = [
  { q: "How accurate is the OCR?", a: "Tesseract on clean scans hits 95-99% on Latin scripts; lower for handwriting, low-DPI scans, or unusual fonts. We use ocrmypdf as the wrapper — quality is what production tools ship." },
  { q: "Does it work on photos of paper?", a: "Yes — convert the photo to PDF first (use JPG to PDF), then run OCR. Or use Scan to PDF which combines both steps." },
  { q: "Are my files private?", a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour." },
];

const relatedTools = [
  { slug: "scan-to-pdf", name: "Scan to PDF", hint: "Convert photo + OCR in one step" },
  { slug: "extract-text", name: "Extract Text", hint: "Pull text after OCR" },
  { slug: "compress", name: "Compress PDF", hint: "Shrink the OCR'd output" },
];

export default function Page() {
  const tool = getToolBySlug("ocr");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to ocr pdf",
        description: "Run OCR on a scanned PDF — add a searchable text layer so you can copy-paste and search. Free, no sign-up, no watermark.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to OCR a PDF Online — Free, 100+ Languages, No Watermark",
        description: "Run OCR on a scanned PDF — add a searchable text layer so you can copy-paste and search. Free, no sign-up, no watermark.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/ocr" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "OCR PDF" },
        keywords: "ocr pdf, scanned pdf to searchable, ocr scanned pdf, make pdf searchable",
      }) }} />

      <ToolPageShell tool={tool} index="24" variant="make searchable">
        <OcrCard />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">OCR PDF FAQ</h2>
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
