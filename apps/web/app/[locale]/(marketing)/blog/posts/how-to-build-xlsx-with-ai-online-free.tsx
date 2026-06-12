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
    <Lead>
      A weekly KPI sheet that never gets built because the headers
      take twenty minutes to settle. A budget tracker that&apos;s on
      the to-do list since January. A pipeline tracker your boss
      asked for yesterday. Type what you need into the AI Excel
      builder and skip straight to the part where you fill in real
      numbers — headers, formulas, totals, and a chart are already
      done.
    </Lead>

    <Section>
      <H2 id="why">When you actually need an AI Excel builder</H2>
      <p>
        Recurring tracking sheets that never get a v1, draft budgets
        you keep meaning to start, simple data layouts that just need
        to exist (a class roster, a project plan, a launch checklist),
        survey results you want to sanity-check before importing into
        a real BI tool, finance scratchpads to model a quick scenario.
      </p>
    </Section>

    <Section>
      <H2 id="how">How to use it, step by step</H2>
      <Step n={1} title="Open the builder">Go to <Link href="/xlsx-builder" className="text-primary hover:underline">convertpdfgo.com/xlsx-builder</Link>. No account, no email.</Step>
      <Step n={2} title="Describe what you need">One sentence — &quot;Monthly household budget&quot;, &quot;Q1 2026 sales pipeline&quot;, &quot;OKR scorecard&quot;. The AI infers headers, units, and row examples.</Step>
      <Step n={3} title="Pick sheet count, tone, language, chart">1–5 sheets, four tones, five languages. Tick &quot;include chart&quot; to get a column/line/bar/pie chart based on data shape.</Step>
      <Step n={4} title="Generate + download">~15 seconds. .xlsx opens in Excel, Google Sheets, LibreOffice. Formulas auto-recalc on first open.</Step>
    </Section>

    <Section>
      <H2 id="works">What it actually produces</H2>
      <ul className="ml-6 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
        <li><strong>Header row</strong> in your tone&apos;s primary color, frozen so it stays visible while you scroll.</li>
        <li><strong>Data rows</strong> with varied, realistic numbers — never all the same value.</li>
        <li><strong>Totals row</strong> in the accent color with SUM formulas for every numeric column.</li>
        <li><strong>Number format</strong> matching the data (currency for revenue, percent for rates, count for units).</li>
        <li><strong>Chart</strong> (if enabled) — column for category comparisons, line for time series, bar for ranked rows, pie for share-of-whole.</li>
        <li><strong>Multiple sheets</strong> if you asked, each with its own table and (on sheet 1) chart.</li>
      </ul>
    </Section>

    <Section>
      <H2 id="problems">Common problems</H2>
      <Problem title="Numbers look made up">They are — and that&apos;s the point. The AI generates a realistic skeleton. Replace the data with your real numbers; the formulas, totals, and chart will recalculate automatically.</Problem>
      <Problem title="Chart picked the wrong type">For categorical comparisons (regions, products), column or bar is right. For time series, line. If the chart type doesn&apos;t fit, click the chart in Excel → Change Chart Type → pick another. Takes 5 seconds.</Problem>
      <Problem title="Formula doesn&apos;t work">We support SUM, AVERAGE, IF, COUNT, MIN, MAX, and cross-cell references. Complex formulas (XLOOKUP, ARRAYFORMULA, dynamic arrays) aren&apos;t guaranteed — edit in Excel afterward.</Problem>
    </Section>

    <Section>
      <H2 id="privacy">Privacy</H2>
      <p>Topics go to Gemini for spec generation. Output .xlsx files are encrypted at rest and auto-deleted within one hour.</p>
    </Section>

    <Section>
      <H2 id="faq">FAQ</H2>
      <Faq q="Will it open in Microsoft Excel?">Yes. The .xlsx is standard OOXML — opens in Excel 2016+, Excel for Mac, Excel for Web, Google Sheets, LibreOffice Calc, Numbers.</Faq>
      <Faq q="Multi-sheet workbooks?">Yes, 1–5 sheets. The chart goes on sheet 1.</Faq>
      <Faq q="What languages?">English, Uzbek (Latin), Russian, Spanish, Arabic. Numbers stay universal.</Faq>
      <Faq q="How long does it take?">12–20 seconds. Bottleneck is the AI; xlsxwriter rendering is sub-second.</Faq>
      <Faq q="Is there a usage limit?">No daily cap. Free, no sign-up wall, no watermark.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/excel-to-pdf" className="font-semibold text-primary hover:underline">export the workbook as PDF</Link>, <Link href="/chat-excel" className="font-semibold text-primary hover:underline">chat with an existing workbook</Link>, or <Link href="/pptx-builder" className="font-semibold text-primary hover:underline">build a PowerPoint deck with AI</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const xlsxBuilderPost: BlogPost = {
  slug: "how-to-build-xlsx-with-ai-online-free",
  title: "How to Build an Excel Workbook with AI Online — Free, with Charts",
  description: "Type what you need — AI builds headers, formulas, totals, and a chart. Real .xlsx in 15s. 5 languages, 4 tones. Free, no sign-up.",
  date: "2021-10-18",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 7,
  keywords: ["ai excel", "ai spreadsheet", "ai xlsx generator", "excel ai chart", "ai sheet builder", "ai excel free"],
  heroEmoji: "📊",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "works", label: "What it produces" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
