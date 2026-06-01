import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Layers, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { JpgToPdfCard } from "./jpg-to-pdf-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "JPG to PDF Online — Convert Images to PDF Free, No Watermark",
  description:
    "Convert JPG, PNG, WebP, GIF, BMP, TIFF images to a single PDF. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/jpg-to-pdf",
  },
  openGraph: {
    title: "JPG to PDF Online — Convert Images to PDF Free, No Watermark",
    description:
      "Bundle multiple JPG, PNG, or scanned images into one clean PDF. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/jpg-to-pdf",
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
  { icon: Upload, name: "Upload your images",   text: "Drop multiple JPGs, PNGs, or scans — order them by dragging." },
  { icon: Layers, name: "We stack them as pages", text: "Each image becomes one PDF page at its original resolution." },
  { icon: Download, name: "Download the PDF",     text: "A single, ordered, watermark-free PDF — ready to send." },
];

const faqs = [
  {
    q: "Which image formats are accepted?",
    a: "JPG, JPEG, PNG, GIF, WebP, BMP, and TIFF. The file type is detected from the actual file bytes, not the extension.",
  },
  {
    q: "Can I change the order of images before converting?",
    a: "Yes. Drag the thumbnails to reorder them before clicking Convert — the PDF preserves your final order.",
  },
  {
    q: "Are my files private?",
    a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.",
  },
];

const relatedTools = [
  { slug: "pdf-to-jpg", name: "PDF to JPG",  hint: "Pull images back out of a PDF" },
  { slug: "compress",   name: "Compress PDF", hint: "Shrink the output if it's heavy" },
  { slug: "merge",      name: "Merge PDF",    hint: "Combine with other PDFs" },
];

export default function JpgToPdfPage() {
  const tool = getToolBySlug("jpg-to-pdf");
  if (!tool) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to convert JPG images to a single PDF online",
            description:
              "Bundle JPG, PNG, or scanned images into one PDF — no software, no sign-up, no watermark.",
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
            headline: "How to Convert JPG to PDF Online — Free and Watermark-Free",
            description:
              "Bundle multiple images (JPG, PNG, WebP, GIF, BMP, TIFF) into a single ordered PDF with convertpdfgo — free, no sign-up, no watermark.",
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
              "@id": "https://convertpdfgo.com/jpg-to-pdf",
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable-faq"],
            },
            inLanguage: "en",
            about: { "@type": "Thing", name: "JPG to PDF conversion" },
            keywords:
              "jpg to pdf, image to pdf, png to pdf, photos to pdf, jpg to pdf online free, multiple jpg to pdf",
          }),
        }}
      />

      <ToolPageShell tool={tool} index="07" variant="multi-image">
        <JpgToPdfCard />

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
              JPG to PDF FAQ
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
