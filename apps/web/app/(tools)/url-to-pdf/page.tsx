import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Upload, Globe, Download, ArrowRight } from "lucide-react";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { UrlToPdfClient } from "./url-to-pdf-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "URL to PDF Online — Save Any Webpage as PDF Free, No Watermark",
  description:
    "Convert any URL to PDF online — paste a link, get a snapshot of the page. Free, no sign-up, no watermark. Works on mobile and desktop.",
  alternates: {
    languages: { "en": "https://convertpdfgo.com", "ru": "https://convertpdfgo.com", "uz": "https://convertpdfgo.com", "es": "https://convertpdfgo.com", "ar": "https://convertpdfgo.com", "x-default": "https://convertpdfgo.com" },
    canonical: "/url-to-pdf",
  },
  openGraph: {
    title: "URL to PDF Online — Save Any Webpage as PDF Free, No Watermark",
    description: "Paste a URL and get a crisp PDF snapshot of the webpage. Free, no sign-up, no watermark.",
    url: "https://convertpdfgo.com/url-to-pdf",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "convertpdfgo — free PDF tools", type: "image/png" }],
  },
};

const howToSteps = [
  { icon: Upload,   name: "Paste the URL",            text: "Drop in any public webpage URL — articles, docs, dashboards, anything that loads in a browser." },
  { icon: Globe,    name: "Headless Chrome fetches it", text: "We render the page through a real Chromium engine — CSS, fonts, images, dynamic content all included." },
  { icon: Download, name: "Download the PDF",           text: "Open it in any reader — pixel-identical to what your browser would show." },
];

const faqs = [
  { q: "Will the page look like it does in Chrome?", a: "Yes. We use a real Chromium engine, so CSS, web fonts, lazy-loaded images, and JavaScript-rendered content all come through." },
  { q: "Can I save pages behind a login?", a: "Not directly — the renderer doesn't have your cookies. If the page is public, it works. If it's behind auth, use your browser's built-in Print to PDF instead." },
  { q: "Are my files private?", a: "The URL and generated PDF are encrypted at rest, then auto-deleted within one hour. We don't log which URLs you converted." },
];

const relatedTools = [
  { slug: "html-to-pdf", name: "HTML to PDF", hint: "If you have the markup, not a URL" },
  { slug: "pdf-to-html", name: "PDF to HTML", hint: "Go the other direction" },
  { slug: "merge",       name: "Merge PDF",   hint: "Combine multiple snapshots" },
];

export default function Page() {
  const tool = getToolBySlug("url-to-pdf");
  if (!tool) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to convert a URL to PDF online",
        description: "Save any public webpage as a PDF — no software, no sign-up, no watermark.",
        totalTime: "PT1M", tool: { "@type": "HowToTool", name: "convertpdfgo" },
        step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "TechArticle",
        headline: "How to Convert a URL to PDF Online — Free and Watermark-Free",
        description: "Save any public webpage as a crisp PDF with convertpdfgo — Chromium-rendered, no sign-up, no watermark.",
        datePublished: "2026-01-20", dateModified: new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
        publisher: { "@type": "Organization", name: "convertpdfgo", logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://convertpdfgo.com/url-to-pdf" },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-faq"] },
        inLanguage: "en", about: { "@type": "Thing", name: "URL to PDF conversion" },
        keywords: "url to pdf, save webpage as pdf, convert url to pdf, website to pdf, webpage to pdf online free",
      })}} />

      <ToolPageShell tool={tool} index="31" variant="snapshot">
        <UrlToPdfClient />

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">URL to PDF FAQ</h2>
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
