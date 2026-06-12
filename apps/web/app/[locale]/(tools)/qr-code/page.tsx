import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Upload, Download, QrCode, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { QrCodeClient } from "./qr-code-client";

export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "Add QR Code to PDF Online — Free, Any Content, Any Page",
  description: "Embed a QR code on any page of a PDF — links, vCards, signed URLs. Free, no sign-up, no watermark.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com",
    },
    canonical: "/qr-code",
  },
  openGraph: {
    title: "Add QR Code to PDF Online — Free, Any Content, Any Page",
    description: "Embed a QR code on any page of a PDF — links, vCards, signed URLs. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/qr-code",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "qr-code", locale);
}

const howToSteps = [
  { icon: Upload, name: "Upload your PDF", text: "Drop the PDF or click to pick it from your device." },
  { icon: QrCode, name: "Pick QR content + position", text: "Type a URL, vCard, or any text. Pick position (corner) and size in points." },
  { icon: Download, name: "Download the PDF with QR", text: "Phones scan it instantly — no QR-reader app needed in 2025." },
];

const faqs = [
  { q: "What content types work?", a: "Any text. URLs are most common, but vCards (contact info), Wi-Fi credentials, signed tokens, plain text all work." },
  { q: "How big should the QR code be?", a: "100 points (~1.4 inch) is good for desk reading. Bigger if recipients scan from across a room." },
  { q: "Are my files private?", a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour." },
];

const relatedTools = [
  { slug: "watermark", name: "Watermark", hint: "Combine QR with a brand mark" },
  { slug: "header-footer", name: "Header & Footer", hint: "Add a label next to the QR" },
  { slug: "merge", name: "Merge PDF", hint: "Bundle multiple QR'd PDFs" },
];

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("qr-code");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to add qr code",
        description: "Embed a QR code on any page of a PDF — links, vCards, signed URLs. Free, no sign-up, no watermark.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Add a QR Code to a PDF Online — Free, Any Content",
        description: "Embed a QR code on any page of a PDF — links, vCards, signed URLs. Free, no sign-up, no watermark.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/qr-code" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "Add QR Code" },
        keywords: "add qr code to pdf, pdf qr code, embed qr in pdf",
      }) }} />

      <ToolPageShell tool={tool} locale={locale} index="17" variant="URL · text · vCard">
        <QrCodeClient />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Add QR Code FAQ</h2>
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
