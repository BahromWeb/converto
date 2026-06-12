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
    <Lead>Lecture slides handed out to a hundred students at full page-size use a hundred sheets of paper. The same slides 4-up use 25 sheets. Travel printers cost a dollar a page in some cities. N-up turns a paper bill into pocket money.</Lead>

    <Section>
      <H2 id="why">When you actually need N-up Layout</H2>
      <p>Lecture handouts (4-up saves 75% paper), conference programs in a compact format, draft reviews where you want a single sheet showing four pages at once, before/after comparison handouts.</p>
    </Section>

    <Section>
      <H2 id="how">How to n-up layout, step by step</H2>
      <Step n={1} title="Open the tool">Go to <Link href="/nup" className="text-primary hover:underline">convertpdfgo.com/nup</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the PDF in">Drag the file onto the upload area or click to pick. Files up to 30 MB go through without a queue. Encrypted in transit (TLS 1.3), encrypted at rest, deleted within one hour.</Step>
      <Step n={3} title="Configure your run">Pick 2, 4, 6, or 9 pages per sheet.</Step>
      <Step n={4} title="Download">The output is a clean PDF — open in any reader.</Step>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="Text is too small to read">Step down from 9-up to 4-up or 2-up. The trade-off is fewer pages per sheet but readable content.</Problem>
      <Problem title="Wanted some pages full-size">Run two passes — N-up the body, leave the cover alone, merge.</Problem>
      <Problem title="Border looks wrong">Toggle it off if your pages already have margins, on if they bleed to the edge.</Problem>
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
      <Faq q="Will text still be readable?">At 2-up, easily. At 9-up, only short titles and large fonts; body text becomes uncomfortable.</Faq>
      <Faq q="Can I add a border between pages?">Yes — toggle the border option. Helps when content runs to the edge of each page.</Faq>
      <Faq q="Are my files private?">Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.</Faq>
      <Faq q="Will it work on protected PDFs?">Not directly — unlock the PDF first with our Unlock PDF tool if you know the password.</Faq>
      <Faq q="Is there a usage limit?">No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
      <Faq q="How long does it take?">About 1-3 seconds for most files. Larger or image-heavy PDFs can take up to 30 seconds.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/compress" className="font-semibold text-primary hover:underline">Compress PDF</Link>, <Link href="/rotate" className="font-semibold text-primary hover:underline">Rotate PDF</Link>, or <Link href="/merge" className="font-semibold text-primary hover:underline">Merge PDF</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const nupPdfPost: BlogPost = {
  slug: "how-to-make-nup-pdf-layout-online-free",
  title: "How to Print 2 / 4 / 6 / 9 PDF Pages per Sheet — Free N-up Tool",
  description: "Combine multiple PDF pages onto one sheet — 2-up, 4-up, 6-up, 9-up. Free, no sign-up, no watermark.",
  date: "2021-05-12",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 7,
  keywords: ["nup pdf", "2 pages per sheet pdf", "4 up pdf", "print multiple pages per sheet"],
  heroEmoji: "🗂️",
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
