import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Unlock, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { UnlockCard } from "./unlock-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Unlock PDF Online — Remove PDF Password Free, No Watermark",
  description:
    "Remove the password from any PDF you have the password for — fast, free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    },
    canonical: "/unlock",
  },
  openGraph: {
    title: "Unlock PDF Online — Remove PDF Password Free, No Watermark",
    description: "Remove the password from any PDF you own. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/unlock",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: Upload,   name: "Upload your locked PDF", text: "Drop the password-protected PDF or click to pick it from your device." },
  { icon: Unlock,   name: "Enter the password",      text: "Type the password you'd normally use to open the file." },
  { icon: Download, name: "Download the open PDF",   text: "Get back a PDF with no password — readable in any reader, editable in any tool." },
];

const faqs = [
  {
    q: "Does this crack passwords?",
    a: "No. We can't break unknown passwords — the AES encryption math doesn't allow it. This tool only removes a password you already know.",
  },
  {
    q: "Why would I unlock a PDF I already have the password for?",
    a: "So you don't have to type it every time. Common cases: HR documents you'll re-open daily, archives you need to make searchable, bank statements you want to bundle into a single unprotected report.",
  },
  {
    q: "Are my files private?",
    a: "Files and the password you type are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour. We never log passwords.",
  },
];

const relatedTools = [
  { slug: "protect",  name: "Protect PDF",  hint: "Add a password back if needed" },
  { slug: "merge",    name: "Merge PDF",    hint: "Bundle the unlocked PDF with others" },
  { slug: "compress", name: "Compress PDF", hint: "Shrink it after removing the password" },
];

export default function Page() {
  const tool = getToolBySlug("unlock");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to remove a password from a PDF online",
        description: "Strip the password from any PDF you can open — no software, no sign-up, no watermark.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Remove a Password from a PDF Online — Free and Watermark-Free",
        description: "Remove the password from any PDF you have the password for with convertpdfgo — free, no sign-up, no watermark.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/unlock" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "PDF password removal" },
        keywords: "unlock pdf, remove pdf password, decrypt pdf, unlock pdf online free, pdf password remover",
      })}} />

      <ToolPageShell tool={tool} index="10" variant="known-password">
        <UnlockCard />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Unlock PDF FAQ</h2>
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
