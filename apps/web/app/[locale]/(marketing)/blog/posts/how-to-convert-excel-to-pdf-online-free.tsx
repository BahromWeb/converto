import Link from "next/link";
import { Lightbulb, AlertTriangle, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import type { BlogPost } from "./types";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">{children}</h2>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>;
}
function Section({ children }: { children: React.ReactNode }) {
  return <section className="mt-10 space-y-4">{children}</section>;
}
function Callout({ icon: Icon, title, children, tone = "info" }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  tone?: "info" | "warn" | "tip";
}) {
  const toneClass = tone === "warn"
    ? "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20"
    : tone === "tip"
    ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20"
    : "border-blue-500/30 bg-blue-50 dark:bg-blue-950/20";
  return (
    <div className={`my-6 rounded-2xl border p-5 ${toneClass}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0" />
        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <div className="mt-1 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="my-5 flex gap-4 rounded-2xl border bg-card p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{n}</span>
      <div>
        <p className="font-bold">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="speakable-faq my-4 rounded-2xl border bg-card p-5">
      <p className="font-bold">{q}</p>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

const Body = (
  <>
    <Lead>
      You finished the quarterly sales spreadsheet. Now you need to email it to
      the CFO. Sending the .xlsx is risky — they might be on Excel for Mac,
      Google Sheets, or LibreOffice; row heights will reflow, fonts will swap,
      formulas could re-calc with their locale&apos;s decimal separator. The
      safe move is to send a PDF: locked layout, embedded fonts, the exact
      view you reviewed. Here&apos;s how, in fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">Why workbooks need to become PDFs</H2>
      <p>
        Excel is a live document. The same .xlsx file opens differently on
        every machine because column widths, row heights, conditional
        formatting, and even formula results depend on the Excel version, the
        OS, the system locale, and the installed fonts. Send the .xlsx to a
        client and they see a slightly different document than you did.
      </p>
      <p>
        PDF freezes the layout. The PDF&apos;s columns are the columns you saw.
        The numbers are the numbers Excel already calculated. The fonts are
        embedded. Nothing reflows, nothing recalculates — same view on Word
        for the web, on Adobe Reader, on a phone, on a printer.
      </p>
      <Callout icon={Lightbulb} title="When to send .xlsx vs PDF" tone="tip">
        Send <strong>.xlsx</strong> when the recipient needs to edit formulas
        or add rows. Send <strong>PDF</strong> when the numbers are final —
        reports for execs, invoices for clients, financial statements,
        signed-off budgets. PDF says &quot;this is the version&quot; in a
        way .xlsx can&apos;t.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert Excel to PDF, step by step</H2>

      <Step n={1} title="Open the Excel to PDF tool">
        Go to <Link href="/excel-to-pdf" className="text-primary hover:underline">convertpdfgo.com/excel-to-pdf</Link>.
        No account, no email, no installation. Page loads in under a second.
      </Step>
      <Step n={2} title="Drop the workbook in">
        Drag your .xlsx or .xls file onto the upload area, or click to pick
        it. Files up to 30 MB go through without a queue. Encrypted in
        transit (TLS 1.3), encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="Wait a few seconds">
        The conversion runs server-side. Every visible worksheet becomes its
        own PDF page; formulas keep their calculated values, conditional
        formatting becomes static cell colours, charts are embedded as
        vector graphics so they stay crisp at any zoom level.
      </Step>
      <Step n={4} title="Download the PDF">
        That&apos;s it. The PDF opens in Adobe Reader, Preview, Chrome, or
        any phone with identical layout. The numbers your CFO sees are the
        numbers you saw.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What we preserve and what we render</H2>
      <p>
        Sheets: every <em>visible</em> worksheet becomes a PDF page. Hidden
        sheets stay hidden (we honour Excel&apos;s sheet visibility flag).
        If a sheet is too wide for a single A4, it splits naturally into
        multiple pages.
      </p>
      <p>
        Formulas: the converter uses Excel&apos;s cached value cache. A cell
        like <code>=SUM(B2:B5)</code> shows <code>45900</code> in the PDF,
        not the formula text. This matches what Excel&apos;s Print Preview
        shows.
      </p>
      <p>
        Formatting: cell borders, fill colours, font choices, bold/italic,
        number formats (currency, percentage, dates) all carry through.
        Conditional formatting is &quot;baked in&quot; — the colour you saw
        is the colour in the PDF.
      </p>
      <p>
        Charts: bar charts, pie charts, line charts come through as vector
        graphics, so they stay sharp at any zoom level. Embedded images
        keep their original resolution.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> A sheet is cut off on the right</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The sheet is wider than the page. Set the print area in Excel
          first: <strong>Page Layout → Print Area → Set Print Area</strong>,
          or use <strong>Page Layout → Scale to Fit → 1 page wide</strong>.
          Save, then convert again.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Formula cells show #REF or #VALUE</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The formula errored in the source workbook before conversion. Open
          in Excel, fix the formula, save, then re-convert. We render
          whatever Excel cached as the cell&apos;s value — including errors.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Charts come out blank or flat</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Some unusual Excel chart types (3D scatter, complex pivot charts)
          don&apos;t round-trip cleanly. Workaround: in Excel, right-click
          the chart → <strong>Copy as Picture</strong> → paste back as an
          image. Then convert.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The workbook is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t convert a file you can&apos;t open. Remove the
          password in Excel first (<strong>File → Info → Protect Workbook</strong>
          → delete password), save, then convert.
        </p>
      </div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>
        Three things to know. <strong>One</strong>: files go over TLS 1.3.
        <strong> Two</strong>: files are encrypted at rest while we process them,
        then deleted automatically within one hour. <strong>Three</strong>:
        we don&apos;t look at your files, train on them, or send them anywhere.
        Spreadsheets with payroll numbers, vendor pricing, or commission
        plans get the same treatment as any other file.
      </p>
      <Callout icon={AlertTriangle} title="If the workbook contains financial data" tone="warn">
        After converting, lock the PDF with{" "}
        <Link href="/protect" className="text-primary hover:underline">our protect tool</Link>{" "}
        so it can&apos;t be opened without a password — and send the
        password through a separate channel from the file itself.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free Excel-to-PDF tools</H2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-bold">Feature</th>
              <th className="py-2 pr-4 font-bold">convertpdfgo</th>
              <th className="py-2 pr-4 font-bold">Smallpdf (free)</th>
              <th className="py-2 font-bold">iLovePDF (free)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2 files/day</td><td className="py-2">Optional</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">File size cap</td><td className="py-2 pr-4">30 MB</td><td className="py-2 pr-4">5 MB</td><td className="py-2">15 MB</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">All sheets converted</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Does it work with both .xlsx and .xls?">
        Yes. Modern .xlsx (Excel 2007+) and the legacy .xls format both go
        through the same converter.
      </Faq>
      <Faq q="What about .csv?">
        Yes — comma-separated values are also accepted. They&apos;re treated as
        a single sheet without formatting.
      </Faq>
      <Faq q="Will charts be vector or rasterised?">
        Native Excel charts come through as <em>vector</em> graphics, so they
        stay crisp at any zoom level. Embedded images keep their original
        resolution.
      </Faq>
      <Faq q="What page size and orientation does the PDF use?">
        Each sheet uses Excel&apos;s configured print settings — page size,
        orientation, margins, headers/footers. If you haven&apos;t set them,
        we default to A4 portrait with auto-fit-to-width.
      </Faq>
      <Faq q="How long does conversion take?">
        About 1 second per sheet on a typical workbook. A 10-sheet workbook
        takes ~10 seconds; a complex 50-sheet financial model about a
        minute.
      </Faq>
      <Faq q="Will protected cells show their values?">
        Yes. Cell protection only prevents editing in Excel — when reading
        for conversion, all visible cell values are accessible.
      </Faq>
      <Faq q="Is there a usage limit?">
        No. The tool is free, with no daily cap, no sign-up wall, no
        watermark, and no upsell. The 30 MB upload limit is the only
        constraint.
      </Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">
        Now that the workbook is a PDF, you can{" "}
        <Link href="/merge" className="font-semibold text-primary hover:underline">merge it with other PDFs</Link>,{" "}
        <Link href="/compress" className="font-semibold text-primary hover:underline">compress it</Link>,{" "}
        <Link href="/protect" className="font-semibold text-primary hover:underline">password-protect it</Link>,{" "}
        <Link href="/sign" className="font-semibold text-primary hover:underline">sign it</Link>, or{" "}
        <Link href="/watermark" className="font-semibold text-primary hover:underline">watermark it</Link>. All free.
      </Callout>
      <p>
        Or browse{" "}
        <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>{" "}
        — every common PDF task has a clean, single-purpose page with no
        sign-up, no watermark, and a one-hour auto-delete window.
      </p>
    </Section>
  </>
);

export const excelToPdfPost: BlogPost = {
  slug: "how-to-convert-excel-to-pdf-online-free",
  title: "How to Convert an Excel Workbook to PDF Online — Free, No Watermark",
  description:
    "Convert any .xlsx or .xls workbook to a PDF that looks identical on every machine — sheets, formulas, charts preserved. Free, no sign-up, no watermark. Step-by-step guide, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-04-18",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "excel to pdf",
    "xlsx to pdf",
    "convert excel to pdf",
    "excel to pdf online free",
    "spreadsheet to pdf",
    "xlsx to pdf no watermark",
    "free excel to pdf converter",
  ],
  heroEmoji: "📊",
  toc: [
    { id: "why",      label: "Why workbooks become PDFs" },
    { id: "how",      label: "Step-by-step how-to" },
    { id: "behind",   label: "What we preserve" },
    { id: "problems", label: "Common problems" },
    { id: "privacy",  label: "Privacy notes" },
    { id: "vs",       label: "vs Smallpdf / iLovePDF" },
    { id: "faq",      label: "FAQ" },
    { id: "next",     label: "What to do next" },
  ],
  body: Body,
};
