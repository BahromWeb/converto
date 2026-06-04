import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, MessageSquare, UserSearch, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Chat with a CV Online — Free, Screen Candidates in Seconds",
  description: "Drop a candidate's CV / resume and ask anything — skills match, years of experience, gaps. Free, no sign-up.",
  alternates: {
    languages: { "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com" },
    canonical: "/chat-with-cv",
  },
  openGraph: {
    title: "Chat with a CV Online — Free, Screen Candidates in Seconds",
    description: "Drop a candidate's CV / resume and ask anything — skills match, years of experience, gaps. Free, no sign-up.",
    url: "https://convertpdfgo.com/chat-with-cv",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: Upload, name: "Drop the CV", text: "PDF or DOCX — the AI handles both. Up to 30 MB." },
  { icon: UserSearch, name: "Ask screening questions", text: "\"Does this candidate know Postgres?\" \"How many years at FAANG?\" \"Any gap longer than 6 months?\"" },
  { icon: MessageSquare, name: "Get cited answers in your language", text: "Yes / no answers with page citation. Compare 5 CVs side-by-side by opening tabs." },
];

const faqs = [
  { q: "Will it match against my job description?", a: "Indirectly. Paste the JD into your first message: \"Compare this CV to the JD I'm pasting: [JD text]\" and the AI scores fit by skill." },
  { q: "Can it spot embellishments?", a: "It can flag inconsistencies in dates and ranges, but it can't verify external claims (\"managed a team of 50\") against truth." },
  { q: "Are my files private?", a: "Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour. Candidate data is not used for training." },
];

const relatedTools = [
  { slug: "chat", name: "Chat with PDF", hint: "Plain PDF chat" },
  { slug: "chat-word", name: "Chat with Word", hint: "If the CV is DOCX" },
  { slug: "extract-text", name: "Extract Text", hint: "Plain text dump" },
];

export default function Page() {
  const tool = getToolBySlug("chat-with-cv");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to chat with cv",
        description: "Drop a candidate's CV / resume and ask anything — skills match, years of experience, gaps. Free, no sign-up.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Chat with a CV Online — Free, Screen Resumes in 30 Seconds",
        description: "Drop a candidate's CV / resume and ask anything — skills match, years of experience, gaps. Free, no sign-up.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/chat-with-cv" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "Chat with CV" },
        keywords: "chat with cv, chat with resume, resume ai, candidate screening",
      }) }} />

      <ToolPageShell tool={tool} index="04c" variant="screen candidates">
        <ChatPageClient
          accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,.pdf,.docx,.odt"
          uploadPrompt="Drop a CV to screen it in seconds"
          uploadHint="PDF, DOCX, ODT — answers cite the line"
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Chat with CV FAQ</h2>
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
