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
    <Lead>A duplex scan of a stack of single-sided documents fills the PDF with blank back-sides. A merged report from three sources has empty spacer pages no one needs. Spotting them by hand on a 300-page file is tedious; an automatic detector flags them in two seconds.</Lead>

    <Section>
      <H2 id="why">When you actually need Detect Blank Pages</H2>
      <p>Duplex scans, merged reports, exports from publishing tools that include blank chapter dividers, PDFs from legacy systems that pad to even page counts.</p>
    </Section>

    <Section>
      <H2 id="how">How to detect blank pages, step by step</H2>
      <Step n={1} title="Open the tool">Go to <Link href="/detect-blank" className="text-primary hover:underline">convertpdfgo.com/detect-blank</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the PDF in">Drag the file onto the upload area or click to pick. Files up to 30 MB go through without a queue. Encrypted in transit (TLS 1.3), encrypted at rest, deleted within one hour.</Step>
      <Step n={3} title="Configure your run">Nothing to configure — detection runs with a sensible default threshold.</Step>
      <Step n={4} title="Download">The output is a clean PDF — open in any reader.</Step>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="False positives on almost-blank pages">Pages with just a page number flag as blank with our default threshold. Tighten the threshold if you want pages-with-only-a-number kept.</Problem>
      <Problem title="False negatives — page looks empty but isn't flagged">Hidden whitespace characters or a faint background watermark may keep the coverage above the threshold. Eyeball the page in the original PDF.</Problem>
      <Problem title="Detection runs but output is just a list">By design — we don't modify the input. Feed the list of page numbers into Remove Pages.</Problem>
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
      <Faq q="Will it count a page with a tiny mark as blank?">We use a coverage threshold — pages with less than ~1% pixel coverage are flagged. Pages with a header alone usually aren't flagged.</Faq>
      <Faq q="Can it auto-remove the blanks?">Not in one job. Use the page list as input to Remove Pages — that does the deletion.</Faq>
      <Faq q="Are my files private?">Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.</Faq>
      <Faq q="Will it work on protected PDFs?">Not directly — unlock the PDF first with our Unlock PDF tool if you know the password.</Faq>
      <Faq q="Is there a usage limit?">No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
      <Faq q="How long does it take?">About 1-3 seconds for most files. Larger or image-heavy PDFs can take up to 30 seconds.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/removepage" className="font-semibold text-primary hover:underline">Remove Pages</Link>, <Link href="/inspect" className="font-semibold text-primary hover:underline">Inspect PDF</Link>, or <Link href="/compress" className="font-semibold text-primary hover:underline">Compress PDF</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const detectBlankPdfPost: BlogPost = {
  slug: "how-to-detect-blank-pages-in-pdf-online-free",
  title: "How to Detect Blank Pages in a PDF Online — Free",
  description: "Find every empty page in a PDF — feed the list into Remove Pages to prune them in seconds. Free, no sign-up.",
  date: "2021-04-15",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 7,
  keywords: ["detect blank pages pdf", "find empty pages pdf", "remove blank pages from pdf"],
  heroEmoji: "📭",
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
