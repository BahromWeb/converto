import Link from "next/link";
import { Sparkles, XCircle, CheckCircle2 } from "lucide-react";
import type { BlogPost } from "./types";

function H2({ id, children }: { id: string; children: React.ReactNode }) { return <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">{children}</h2>; }
function Lead({ children }: { children: React.ReactNode }) { return <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>; }
function Section({ children }: { children: React.ReactNode }) { return <section className="mt-10 space-y-4">{children}</section>; }
function Callout({ children }: { children: React.ReactNode }) { return <div className="my-6 rounded-2xl border border-blue-500/30 bg-blue-50 p-5 dark:bg-blue-950/20"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 size-5 shrink-0" /><div className="flex-1 text-sm leading-relaxed">{children}</div></div></div>; }
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) { return (<div className="my-5 flex gap-4 rounded-2xl border bg-card p-5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{n}</span><div><p className="font-bold">{title}</p><div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div></div></div>); }
function Faq({ q, children }: { q: string; children: React.ReactNode }) { return (<div className="speakable-faq my-4 rounded-2xl border bg-card p-5"><p className="font-bold">{q}</p><div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div></div>); }
function Problem({ title, children }: { title: string; children: React.ReactNode }) { return (<div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> {title}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p></div>); }

const Body = (
  <>
    <Lead>Plain OCR turns a scanned report into a wall of text — usable for search but not for feeding to a data pipeline that needs to know what's a heading vs. what's a footnote. Structured OCR preserves layout, so downstream code can sort by section, extract just the tables, or skip the boilerplate.</Lead>

    <Section>
      <H2 id="why">When you actually need Structured OCR</H2>
      <p>Document automation pipelines, archive systems that need structured metadata, building datasets from scanned papers, extracting tables from financial reports.</p>
    </Section>

    <Section>
      <H2 id="how">How to structured ocr, step by step</H2>
      <Step n={1} title="Open the tool">Go to <Link href="/ocr-structured" className="text-primary hover:underline">convertpdfgo.com/ocr-structured</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the file in">Drag the file onto the upload area or click to pick. Files up to 30 MB go through without a queue. Encrypted in transit (TLS 1.3), encrypted at rest, deleted within one hour.</Step>
      <Step n={3} title="Configure">Pick the OCR language; output is structured JSON with bounding boxes for headings, paragraphs, columns, tables.</Step>
      <Step n={4} title="Download">Open in any reader, paste anywhere, feed to scripts.</Step>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="Headings classified wrong">Tesseract uses font size + bold for heading detection. Unusual layouts (all-bold body text) fool it. Manual cleanup needed.</Problem>
      <Problem title="Columns merged into one">The columns are too close together for Tesseract to split. Pre-process: crop columns out separately, then OCR each.</Problem>
      <Problem title="Tables come out as text">Table mode helps but is not foolproof — borderless tables fool it more than bordered. Try PDF to Excel for known-table PDFs.</Problem>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Three things to know. <strong>One</strong>: files go over TLS 1.3. <strong>Two</strong>: files are encrypted at rest while we process them, then deleted automatically within one hour. <strong>Three</strong>: we don&apos;t look at your files or train on them.</p>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free tools</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left">
        <th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">Smallpdf</th><th className="py-2 font-bold">iLovePDF</th>
      </tr></thead><tbody>
        <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
        <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
      </tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="How is this different from regular OCR?">Regular OCR returns flat text. Structured OCR returns text plus layout: 'this is a heading', 'this is a column', 'this is a table row'. Better for downstream automation.</Faq>
      <Faq q="Can it detect tables?">Yes — Tesseract's table mode identifies row and column boundaries from the spacing between cells.</Faq>
      <Faq q="Are my files private?">Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.</Faq>
      <Faq q="Will it work on protected PDFs?">Not directly — unlock the PDF first with our Unlock PDF tool if you know the password.</Faq>
      <Faq q="Is there a usage limit?">No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
      <Faq q="How long does it take?">About 5-30 seconds depending on file size and OCR complexity. Multi-page scans take longer.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/ocr" className="font-semibold text-primary hover:underline">OCR PDF</Link>, <Link href="/pdf-to-excel" className="font-semibold text-primary hover:underline">PDF to Excel</Link>, or <Link href="/inspect" className="font-semibold text-primary hover:underline">Inspect PDF</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const ocrStructuredPost: BlogPost = {
  slug: "how-to-do-structured-ocr-on-pdf-online-free",
  title: "How to Run Structured OCR on a PDF Online — Free, Layout Preserved",
  description: "OCR a scanned PDF with layout info — headings, columns, tables stay intact. Free, no sign-up.",
  date: "2020-12-02",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 8,
  keywords: ["structured ocr", "ocr with layout", "ocr table extraction", "hocr pdf", "pdf structured ocr"],
  heroEmoji: "🧩",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs Smallpdf / iLovePDF" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
