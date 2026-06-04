import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Download, LayoutGrid, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { NupClient } from "./nup-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "N-up PDF Layout Online — Fit 2, 4, 6, 9 Pages per Sheet, Free",
  description: "Print or share multiple PDF pages on one sheet — 2-up, 4-up, 6-up, 9-up. Free, no sign-up, no watermark.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com",
    },
    canonical: "/nup",
  },
  openGraph: {
    title: "N-up PDF Layout Online — Fit 2, 4, 6, 9 Pages per Sheet, Free",
    description: "Print or share multiple PDF pages on one sheet — 2-up, 4-up, 6-up, 9-up. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/nup",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: Upload, name: "Upload your PDF", text: "Drop the PDF or click to pick it from your device." },
  { icon: LayoutGrid, name: "Pick the layout", text: "2, 4, 6, or 9 pages per sheet. Portrait or landscape. Optional border between cells." },
  { icon: Download, name: "Download the N-up PDF", text: "Fewer sheets to print, smaller file to ship, deck on a one-page handout." },
];

const faqs = [
  { q: "Will text still be readable?", a: "At 2-up, easily. At 9-up, only short titles and large fonts; body text becomes uncomfortable." },
  { q: "Can I add a border between pages?", a: "Yes — toggle the border option. Helps when content runs to the edge of each page." },
  { q: "Are my files private?", a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour." },
];

const relatedTools = [
  { slug: "compress", name: "Compress PDF", hint: "Shrink the output further" },
  { slug: "rotate", name: "Rotate PDF", hint: "Spin pages before laying out" },
  { slug: "merge", name: "Merge PDF", hint: "Combine documents first" },
];

export default function Page() {
  const tool = getToolBySlug("nup");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to n-up layout",
        description: "Print or share multiple PDF pages on one sheet — 2-up, 4-up, 6-up, 9-up. Free, no sign-up, no watermark.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Print 2 / 4 / 6 / 9 PDF Pages per Sheet — Free N-up Tool",
        description: "Print or share multiple PDF pages on one sheet — 2-up, 4-up, 6-up, 9-up. Free, no sign-up, no watermark.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/nup" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "N-up Layout" },
        keywords: "nup pdf, 2 pages per sheet pdf, 4 up pdf",
      }) }} />

      <ToolPageShell tool={tool} index="18" variant="2 · 4 · 6 · 9">
        <NupClient />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">N-up Layout FAQ</h2>
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
