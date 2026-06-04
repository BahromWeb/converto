import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TableProperties, Sparkles, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { XlsxBuilderCard } from "./xlsx-builder-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI Excel Builder Online — Type a Topic, Get a Workbook with Charts, Free",
  description:
    "Type what you need — AI lays out headers, fills realistic numbers, writes formulas, and adds a chart. Real .xlsx in 15s. Free.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com",
    },
    canonical: "/xlsx-builder",
  },
  openGraph: {
    title: "AI Excel Builder Online — Type a Topic, Get a Workbook with Charts, Free",
    description: "AI builds the sheet, formulas, and a chart. Real .xlsx in 15 seconds.",
    url: "https://convertpdfgo.com/xlsx-builder",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: TableProperties, name: "Describe the sheet you need", text: "One line — \"monthly budget\", \"sales tracker\", \"OKR scorecard\". Pick sheet count, tone, language." },
  { icon: Sparkles,        name: "AI builds headers, numbers, formulas", text: "Gemini lays out the columns and rows, fills realistic varied numbers, writes the SUM / AVERAGE / IF formulas, picks a number format ($, %, count)." },
  { icon: Download,        name: "Download a real .xlsx with chart",     text: "Opens in Excel, Google Sheets, LibreOffice. Chart embedded. Formulas recalc on first open." },
];

const faqs = [
  { q: "Will the formulas actually work?", a: "Yes — SUM, AVERAGE, IF, simple cross-references all work. The AI is constrained to formulas xlsxwriter supports natively. Complex VLOOKUP / XLOOKUP isn't guaranteed; for those, edit in Excel afterward." },
  { q: "Does it really include charts?", a: "If you tick the chart box (on by default), yes. The AI picks column / line / bar / pie based on the data shape and embeds it on the first sheet next to the table." },
  { q: "Are my topics private?", a: "Topics go to Gemini for spec generation. Output .xlsx files are encrypted at rest and auto-deleted within one hour." },
];

const relatedTools = [
  { slug: "excel-to-pdf",     name: "Excel to PDF",      hint: "Export the workbook as PDF" },
  { slug: "chat-excel",       name: "Chat with Excel",   hint: "Ask questions of an existing workbook" },
  { slug: "pdf-to-excel",     name: "PDF to Excel",      hint: "Extract a PDF's tables" },
];

export default function Page() {
  const tool = getToolBySlug("xlsx-builder");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to build an Excel workbook with AI online",
        description: "Type a topic, pick tone and language — AI builds headers, formulas, and a chart.",
        totalTime: "PT15S", tool: { "@type": "HowToTool", name: "convertpdfgo AI builder" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "AI Excel Builder — Type a Topic, Get a Workbook with Charts",
        description: "Generate a professional .xlsx with formulas and a chart from a one-line topic. Free.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/xlsx-builder" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "AI Excel Builder" },
        keywords: "ai excel, ai spreadsheet, ai xlsx generator, excel ai chart, ai sheet builder",
      })}} />

      <ToolPageShell tool={tool} index="51" variant="topic → workbook">
        <XlsxBuilderCard />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">AI Excel Builder FAQ</h2>
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
