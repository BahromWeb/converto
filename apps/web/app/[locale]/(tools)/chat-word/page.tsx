import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { Upload, MessageSquare, FileText, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";

export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "Chat with Word Document Online — Free, Cited Answers, No Sign-up",
  description: "Drop a Word (DOCX/DOC/RTF) document and ask anything. Answers cite the exact page. Free, no sign-up, no watermark.",
  alternates: {
    languages: { "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com" },
    canonical: "/chat-word",
  },
  openGraph: {
    title: "Chat with Word Document Online — Free, Cited Answers, No Sign-up",
    description: "Drop a Word (DOCX/DOC/RTF) document and ask anything. Answers cite the exact page. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/chat-word",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "chat-word", locale);
}

const howToSteps = [
  { icon: Upload, name: "Drop your Word file", text: "DOCX, DOC, RTF, or ODT — up to 30 MB." },
  { icon: FileText, name: "We convert it to PDF behind the scenes", text: "Gotenberg converts the document, the AI indexes every paragraph by page so citations land where they should." },
  { icon: MessageSquare, name: "Ask anything in plain English (or Uzbek, Russian, Spanish)", text: "The model answers in your language and cites [page N] for every claim." },
];

const faqs = [
  { q: "Does it work on tracked-changes documents?", a: "Yes — tracked changes are flattened during PDF conversion, so the AI sees the current visible text. If you want the AI to also see proposed edits, accept the changes in Word first." },
  { q: "What about footnotes and tables?", a: "Footnotes are indexed and citeable. Simple tables are read row-by-row; complex multi-column tables sometimes lose alignment — quoting from those, expect the cited row to be approximate." },
  { q: "Are my files private?", a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour. Conversations are tied to your session and not used for training." },
];

const relatedTools = [
  { slug: "chat", name: "Chat with PDF", hint: "If your file is already a PDF" },
  { slug: "pdf-to-word", name: "PDF to Word", hint: "Round-trip back to editable DOCX" },
  { slug: "extract-text", name: "Extract Text", hint: "Just the plain text out" },
];

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("chat-word");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to chat with word",
        description: "Drop a Word (DOCX/DOC/RTF) document and ask anything. Answers cite the exact page. Free, no sign-up, no watermark.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Chat with a Word Document Online — Free, Cited Answers",
        description: "Drop a Word (DOCX/DOC/RTF) document and ask anything. Answers cite the exact page. Free, no sign-up, no watermark.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/chat-word" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "Chat with Word" },
        keywords: "chat with word, chat with docx, ask word document, word doc ai",
      }) }} />

      <ToolPageShell tool={tool} locale={locale} index="04w" variant="AI-powered">
        <ChatPageClient
          accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx,.rtf,.odt"
          uploadPrompt="Drop a Word doc to chat with it"
          uploadHint="Word, RTF, OpenDocument — auto-converted to PDF"
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Chat with Word FAQ</h2>
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
