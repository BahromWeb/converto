import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Wand2, Sparkles, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PptxBuilderCard } from "./pptx-builder-card";

export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "AI PowerPoint Builder Online — Type a Topic, Get a Deck, Free",
  description:
    "Type a topic — AI designs the palette, picks layouts, writes the bullets, and gives you a real .pptx in 15 seconds. 5 languages, 4 tones. Free.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com",
    },
    canonical: "/pptx-builder",
  },
  openGraph: {
    title: "AI PowerPoint Builder Online — Type a Topic, Get a Deck, Free",
    description: "AI designs the palette, picks layouts, writes the bullets. Real .pptx in 15 seconds.",
    url: "https://convertpdfgo.com/pptx-builder",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "pptx-builder", locale);
}

const howToSteps = [
  { icon: Wand2,    name: "Type your topic",          text: "One line — \"Q4 sales review\", \"Yangi mahsulot taqdimoti\", \"Pitch deck for Series A\". Pick slide count, tone, language." },
  { icon: Sparkles, name: "AI composes + designs",     text: "Gemini writes the outline + bullets + speaker notes. Picks a palette tied to your tone. Picks 7 layouts: title, section, bullets, two-column, stat, quote, thanks." },
  { icon: Download, name: "Download a real .pptx",     text: "Opens in PowerPoint, Keynote, Google Slides, LibreOffice. No watermark. Edit any slide afterward." },
];

const faqs = [
  { q: "Does it really design the slides, or just dump text?", a: "It designs. The AI picks the palette (corporate→navy, modern→teal, playful→coral, academic→burgundy), picks the layout per slide (title / section break / 2-column / stat / quote / bullets / thanks), and picks fonts from a system-safe pool. The output looks like a deck made in 2026, not 2010." },
  { q: "What languages?", a: "English, Uzbek (Latin), Russian, Spanish, Arabic. The AI follows your language pick strictly — Uzbek-language deck has Uzbek headings, bullets, and speaker notes." },
  { q: "Are my topics private?", a: "Topics go to Gemini for outline generation, then to our python-pptx renderer. Output .pptx files are encrypted at rest and auto-deleted within one hour." },
];

const relatedTools = [
  { slug: "ppt-to-pdf",        name: "PowerPoint to PDF", hint: "Export the result as PDF" },
  { slug: "chat-powerpoint",   name: "Chat with PowerPoint", hint: "Ask questions of an existing deck" },
  { slug: "pdf-to-ppt",        name: "PDF to PowerPoint",  hint: "Round-trip from a PDF" },
];

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("pptx-builder");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to build a PowerPoint deck with AI online",
        description: "Type a topic, pick tone and language — AI designs and writes the .pptx.",
        totalTime: "PT15S", tool: { "@type": "HowToTool", name: "convertpdfgo AI builder" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "AI PowerPoint Builder — Type a Topic, Get a Designed Deck",
        description: "Generate a professional .pptx from a one-line topic. AI picks palette, layouts, bullets, speaker notes. Free.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/pptx-builder" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "AI PowerPoint Builder" },
        keywords: "ai powerpoint, ai pptx generator, ai presentation builder, gamma alternative, ai slide deck",
      })}} />

      <ToolPageShell tool={tool} locale={locale} index="50" variant="topic → deck">
        <PptxBuilderCard />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">AI Builder FAQ</h2>
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Related tools</h2>
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
