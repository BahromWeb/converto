import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Upload, MessageSquare, BarChart3, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";

export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "Chat with Excel Spreadsheet Online — Ask in Plain English, Free",
  description: "Drop an Excel (XLSX/XLS/CSV) file and query it in plain English — totals, formulas, trends. Free, no sign-up.",
  alternates: {
    languages: { "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com" },
    canonical: "/chat-excel",
  },
  openGraph: {
    title: "Chat with Excel Spreadsheet Online — Ask in Plain English, Free",
    description: "Drop an Excel (XLSX/XLS/CSV) file and query it in plain English — totals, formulas, trends. Free, no sign-up.",
    url: "https://convertpdfgo.com/chat-excel",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "chat-excel", locale);
}

const howToSteps = [
  { icon: Upload, name: "Drop your spreadsheet", text: "XLSX, XLS, CSV, or ODS — up to 30 MB." },
  { icon: BarChart3, name: "We index every sheet by row", text: "Each sheet becomes a page in the indexed copy, so citations point at the right tab and row." },
  { icon: MessageSquare, name: "Ask in plain English", text: "\"What was the Q3 revenue?\" \"Sum the Europe column.\" \"Which row is the outlier?\" — answers cite [sheet name, row N]." },
];

const faqs = [
  { q: "Can it calculate, or just read?", a: "It reads cells and recites their values — including formula results that Excel already computed. It does NOT re-execute formulas. For \"what would happen if X was 10\" type questions, change the cell in Excel first, then ask." },
  { q: "Multi-sheet workbooks?", a: "Yes — every tab is indexed separately. Citations include the sheet name so you know which tab the answer came from." },
  { q: "Are my files private?", a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour." },
];

const relatedTools = [
  { slug: "chat", name: "Chat with PDF", hint: "If your data is already PDF" },
  { slug: "pdf-to-excel", name: "PDF to Excel", hint: "Extract a PDF's tables back to a spreadsheet" },
  { slug: "excel-to-pdf", name: "Excel to PDF", hint: "Just convert, no chat" },
];

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("chat-excel");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to chat with excel",
        description: "Drop an Excel (XLSX/XLS/CSV) file and query it in plain English — totals, formulas, trends. Free, no sign-up.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Chat with an Excel Spreadsheet Online — Free, Plain-English Queries",
        description: "Drop an Excel (XLSX/XLS/CSV) file and query it in plain English — totals, formulas, trends. Free, no sign-up.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/chat-excel" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "Chat with Excel" },
        keywords: "chat with excel, ask spreadsheet, excel ai, xlsx chat",
      }) }} />

      <ToolPageShell tool={tool} locale={locale} index="04x" variant="AI-powered">
        <ChatPageClient
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.oasis.opendocument.spreadsheet,.xls,.xlsx,.csv,.ods"
          uploadPrompt="Drop an Excel workbook to chat with it"
          uploadHint="XLSX, XLS, CSV, ODS — multi-sheet aware"
        />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Chat with Excel FAQ</h2>
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
