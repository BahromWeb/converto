import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Presentation, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PptToPdfClient } from "./ppt-to-pdf-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "PowerPoint to PDF Online — Convert PPTX to PDF Free, No Watermark",
  description:
    "Convert PowerPoint to PDF online — every slide, animation, image, and font preserved. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/ppt-to-pdf",
  },
  openGraph: {
    title: "PowerPoint to PDF Online — Convert PPTX to PDF Free, No Watermark",
    description:
      "Convert PPTX or PPT to crisp PDF — one slide per page, every font preserved. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/ppt-to-pdf",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: Upload,       name: "Upload your slides",   text: "Drop the .pptx or .ppt file, or click to pick it from your device." },
  { icon: Presentation, name: "One slide → one page",  text: "Each slide is rendered as its own PDF page in widescreen 16:9 (or 4:3 if you used that)." },
  { icon: Download,     name: "Download the PDF",       text: "Open it on any device — pixel-identical to your PowerPoint view." },
];

const faqs = [
  {
    q: "Will my fonts and animations survive?",
    a: "Fonts: yes — embedded fonts carry through and system fonts are matched. Animations: PDF is a static format, so animations flatten to their final state.",
  },
  {
    q: "Does each slide become a separate PDF page?",
    a: "Yes. Every slide is rendered as one PDF page, in the original slide order, at the original aspect ratio (16:9 or 4:3).",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "pdf-to-ppt",  name: "PDF to PowerPoint", hint: "Convert it back to editable slides" },
  { slug: "word-to-pdf", name: "Word to PDF",       hint: "Same flow, for documents" },
  { slug: "merge",       name: "Merge PDF",         hint: "Combine with other PDFs" },
];

export default function Page() {
  const tool = getToolBySlug("ppt-to-pdf");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to convert a PowerPoint deck to PDF online",
            description: "Convert .pptx or .ppt to PDF — every slide preserved, one slide per page. No software, no sign-up, no watermark.",
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
            headline: "How to Convert PowerPoint to PDF Online — Free and Watermark-Free",
            description: "Convert .pptx or .ppt to a pristine PDF with convertpdfgo — every slide preserved, one slide per page. Free, no sign-up, no watermark.",
            datePublished: "2026-01-20",
            dateModified: new Date().toISOString().slice(0, 10),
            author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
            publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/ppt-to-pdf" },
            speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
            inLanguage: "en",
            about: { "@type": "Thing", name: "PowerPoint to PDF conversion" },
            keywords: "powerpoint to pdf, pptx to pdf, convert powerpoint to pdf, ppt to pdf online free, slides to pdf",
          }),
        }}
      />

      <ToolPageShell tool={tool} index="26" variant="slide-aware">
        <PptToPdfClient />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">PowerPoint to PDF FAQ</h2>
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
