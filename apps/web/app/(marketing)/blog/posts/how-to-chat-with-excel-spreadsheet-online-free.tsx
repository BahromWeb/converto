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
    <Lead>A monthly financial spreadsheet has 50 sheets, 30 columns, and 2,000 rows. The CFO wants three numbers — Q3 EU revenue, the COGS outlier, last year's same-period delta. Hunting them by hand is a coffee-fuelled hour; asking the workbook directly is twenty seconds, with citations to the exact sheet and row.</Lead>

    <Section>
      <H2 id="why">When you actually need Chat with Excel</H2>
      <p>Finance teams pulling KPIs from monthly close workbooks, sales operations identifying outlier rows in pipeline data, analysts querying long survey CSVs without writing pandas code, ops teams summarising inventory sheets without filtering by hand.</p>
    </Section>

    <Section>
      <H2 id="how">How to chat with excel, step by step</H2>
      <Step n={1} title="Open the tool">Go to <Link href="/chat-excel" className="text-primary hover:underline">convertpdfgo.com/chat-excel</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the file in">Drag an Excel workbook (XLSX, XLS, CSV, or ODS) onto the upload area. Up to 30 MB. Multi-sheet workbooks are indexed sheet-by-sheet so citations stay tab-precise.</Step>
      <Step n={3} title="Wait a few seconds while we index">We render each sheet as a PDF page and index them separately. The AI can identify which sheet a value came from, so multi-tab workbooks stay queryable per-tab.</Step>
      <Step n={4} title="Ask">Type the question. Get a cited answer back in 1-3 seconds.</Step>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="Formula not recalculated">The AI reads the value Excel had saved when you exported — it does not re-run formulas. "What's the total" works because the SUM result is in the cell. "What if I change X to 10" needs you to edit X in Excel first.</Problem>
      <Problem title="Asked about wrong sheet">Multi-sheet workbooks confuse short queries. "What was revenue?" can hit any sheet with a Revenue column. Name the tab in your question: "On the Q3-2025 sheet, what was revenue?" — citations stay precise.</Problem>
      <Problem title="Merged cells throw off row counting">Merged cells become a single value in the indexed view, and downstream row numbers shift. For workbooks with heavy merging, unmerge before uploading.</Problem>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Three things to know. <strong>One</strong>: files go over TLS 1.3. <strong>Two</strong>: files are encrypted at rest while we process them, then deleted automatically within one hour. <strong>Three</strong>: we don&apos;t look at your files or train on them. Conversations stay tied to your session.</p>
    </Section>

    <Section>
      <H2 id="vs">How we compare to ChatGPT / Claude attachments</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left">
        <th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">ChatGPT</th><th className="py-2 font-bold">Claude</th>
      </tr></thead><tbody>
        <tr className="border-b"><td className="py-2 pr-4">Sign-up required</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> No</td><td className="py-2 pr-4">Yes</td><td className="py-2">Yes</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Page citations inline</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Always</td><td className="py-2 pr-4">Sometimes</td><td className="py-2">Sometimes</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Multilingual responses</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4">Yes</td><td className="py-2">Yes</td></tr>
        <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Up to 30 days</td><td className="py-2">Vague</td></tr>
      </tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Can it calculate, or just read?">It reads cells and recites their values — including formula results that Excel already computed. It does NOT re-execute formulas. For "what would happen if X was 10" type questions, change the cell in Excel first, then ask.</Faq>
      <Faq q="Multi-sheet workbooks?">Yes — every tab is indexed separately. Citations include the sheet name so you know which tab the answer came from.</Faq>
      <Faq q="Are my files private?">Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.</Faq>
      <Faq q="Will it work on protected files?">Not directly — unlock the file first with our Unlock tool if it's a password-protected PDF.</Faq>
      <Faq q="Is there a usage limit?">No daily cap on questions. The Gemini free tier supports ~250 questions/day across the whole site — if we hit it, you'll see a brief message asking you to wait or sign in with your own key.</Faq>
      <Faq q="How long does it take?">Indexing: 5-30 seconds depending on file size. Each question: 1-3 seconds for the streamed answer to start.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/chat" className="font-semibold text-primary hover:underline">Chat with PDF</Link>, <Link href="/pdf-to-excel" className="font-semibold text-primary hover:underline">PDF to Excel</Link>, or <Link href="/excel-to-pdf" className="font-semibold text-primary hover:underline">Excel to PDF</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const chatExcelPost: BlogPost = {
  slug: "how-to-chat-with-excel-spreadsheet-online-free",
  title: "How to Chat with an Excel Spreadsheet Online — Free, Plain-English Queries",
  description: "Drop a spreadsheet, ask totals / outliers / trends in plain English. Multi-sheet aware, cites [sheet, row]. Free, no sign-up.",
  date: "2021-09-08",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 8,
  keywords: ["chat with excel", "ask spreadsheet", "excel ai", "xlsx chat", "spreadsheet chatbot", "excel chat online free"],
  heroEmoji: "📊",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs ChatGPT / Claude" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
