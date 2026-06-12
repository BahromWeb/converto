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
      You got a PDF financial statement, a tax form, a vendor price list, or a
      government report — and the data you actually need is locked in a table
      you can&apos;t edit. Copying cell-by-cell is a half-hour of clicking.
      Retyping is half an hour of typos. The right move is to pull the table
      out as a real Excel workbook, then sort, filter, and pivot it like any
      other spreadsheet. Here&apos;s how, in fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">When you actually need PDF → Excel</H2>
      <p>
        Real cases we see every week: monthly bank statements (rows of
        transactions), invoice PDFs from suppliers (line items + totals),
        government reports (annual statistics tables), academic papers (data
        tables to feed back into your own analysis), and vendor price lists
        you want to compare side-by-side.
      </p>
      <p>
        The common thread: <strong>tabular data trapped in a PDF</strong>.
        Copy/paste from a PDF reader works for one row but breaks for two
        because PDFs don&apos;t store columns — they store glyph positions.
        Real table extraction has to <em>reconstruct</em> the columns from
        spatial coordinates, then write a real .xlsx your spreadsheet
        understands.
      </p>
      <Callout icon={Lightbulb} title="When NOT to use PDF to Excel" tone="tip">
        If the PDF is mostly prose — paragraphs, headings, no tables —
        you want{" "}
        <Link href="/pdf-to-word" className="text-primary hover:underline">PDF to Word</Link>{" "}
        or{" "}
        <Link href="/extract-text" className="text-primary hover:underline">Extract Text</Link>{" "}
        instead. Excel is for grids; force-fitting paragraphs into a
        spreadsheet gives ugly results.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert a PDF table to Excel, step by step</H2>

      <Step n={1} title="Open the PDF to Excel tool">
        Go to <Link href="/pdf-to-excel" className="text-primary hover:underline">convertpdfgo.com/pdf-to-excel</Link>.
        No account, no email, no installation. Page loads in under a second.
      </Step>
      <Step n={2} title="Drop the PDF in">
        Drag the file onto the upload area or click to pick it. Files up to
        30 MB go through without a queue. Encrypted in transit (TLS 1.3),
        encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="We find the tables">
        The extractor walks each PDF page, clusters text by horizontal and
        vertical position, infers column boundaries from cell spacing, and
        rebuilds each detected table as a worksheet. Borders, header rows,
        and totals come through.
      </Step>
      <Step n={4} title="Download the XLSX">
        Each PDF page lands in its own sheet (named Page 1, Page 2, …). Open
        the file in Excel, Google Sheets, Numbers, or LibreOffice and edit
        normally.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What we extract well — and what stays hard</H2>
      <p>
        <strong>Works well:</strong> tables with visible borders, clean
        column alignment, consistent row heights, and a clear header row.
        Bank statements, accounting reports, structured data tables, most
        invoices. The extractor matches what you&apos;d expect: header in
        row 1, data in rows below, totals on the last row.
      </p>
      <p>
        <strong>Works mostly:</strong> tables without borders but with
        clean column spacing. Vendor price lists, comparison sheets, exam
        score reports. You may need to nudge a column boundary in Excel
        afterward, but 95% of cells land correctly.
      </p>
      <p>
        <strong>Hard cases:</strong> tables that span multiple pages with
        column shifts, tables with merged cells across rows, tables nested
        inside other tables, and free-form text that looks tabular but
        isn&apos;t. We still produce a workbook for these — but expect to
        spend 5 minutes cleaning up afterward.
      </p>
      <Callout icon={Lightbulb} title="Pro tip for messy tables" tone="tip">
        If the table extraction misses columns, run the PDF through{" "}
        <Link href="/extract" className="text-primary hover:underline">our extract tool</Link>{" "}
        first to isolate the page(s) containing the table you want, then
        convert just that smaller PDF. Less noise, cleaner output.
      </Callout>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Numbers come out as text</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          By default, extracted cells land as text — even cells that look
          like numbers. Fix in Excel: select the column → <strong>Data →
          Text to Columns → Finish</strong> (one click), or use
          <code> =VALUE(A1)</code> on a sample cell to convert. Then SUM
          and pivots will work.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Two columns get merged into one</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The original PDF didn&apos;t have enough column spacing for the
          extractor to detect a boundary. In Excel: select the merged
          column → <strong>Data → Text to Columns → Delimited → Space</strong>.
          The two columns separate in one step.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Scanned PDFs return empty cells</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A scanned PDF is a picture of a table, not text. PDF to Excel
          can&apos;t extract characters that don&apos;t exist in the file.
          Run the scan through{" "}
          <Link href="/ocr" className="text-primary hover:underline">our OCR tool</Link>{" "}
          first to add a text layer, then convert.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t extract from a PDF you can&apos;t open. If you have
          the password, remove it first via{" "}
          <Link href="/protect" className="text-primary hover:underline">our protect tool</Link>{" "}
          (set to &quot;remove&quot;), then convert.
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
        Bank statements, payroll PDFs, vendor pricing — all get the same
        treatment as any other file.
      </p>
      <Callout icon={AlertTriangle} title="If the table contains financial data" tone="warn">
        After converting, lock the workbook in Excel with{" "}
        <strong>File → Info → Protect Workbook → Encrypt with Password</strong>,
        and send the password through a separate channel from the file.
        Spreadsheets travel more easily than PDFs — make sure the data
        doesn&apos;t leak in transit.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF-to-Excel tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Multi-page → multi-sheet</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Will the column headers be in row 1?">
        Yes — the extractor treats the first row of each detected table as
        the header row. If your PDF has a logo or title above the table,
        those land in row 1 instead; just delete them in Excel before
        sorting.
      </Faq>
      <Faq q="Can it handle multi-page tables?">
        Yes, but each page lands in its own sheet by default. To stitch
        them into a single continuous table, copy-paste the rows from
        Page 2&apos;s sheet onto the end of Page 1&apos;s sheet.
      </Faq>
      <Faq q="What about scanned PDFs?">
        Not directly — scanned PDFs are pictures. Run them through{" "}
        <Link href="/ocr" className="text-primary hover:underline">our OCR tool</Link>{" "}
        first to add a text layer, then convert.
      </Faq>
      <Faq q="Will Excel formulas work after conversion?">
        Yes — once the numbers are typed as numbers (see &quot;Numbers
        come out as text&quot; above). After that, SUM, AVG, VLOOKUP,
        and pivot tables work normally.
      </Faq>
      <Faq q="How long does conversion take?">
        About 1 second per PDF page on a typical document. A 10-page bank
        statement takes ~10 seconds.
      </Faq>
      <Faq q="What's the file size limit?">
        30 MB per upload as a guest, 50 MB when signed in. The output XLSX
        is typically much smaller than the source PDF.
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
        Now that the tables are in Excel, you can{" "}
        <Link href="/excel-to-pdf" className="font-semibold text-primary hover:underline">convert it back to PDF</Link>{" "}
        after editing,{" "}
        <Link href="/merge" className="font-semibold text-primary hover:underline">merge it with other PDFs</Link>,{" "}
        <Link href="/protect" className="font-semibold text-primary hover:underline">protect the original</Link>, or{" "}
        <Link href="/extract" className="font-semibold text-primary hover:underline">extract just the table pages</Link>{" "}
        before converting. All free.
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

export const pdfToExcelPost: BlogPost = {
  slug: "how-to-convert-pdf-to-excel-online-free",
  title: "How to Convert a PDF to Excel Online — Free, Editable Tables, No Watermark",
  description:
    "Pull tables out of any PDF into an editable Excel workbook — rows, columns, totals preserved. Free, no sign-up, no watermark. Step-by-step guide, what extracts well vs. what's hard, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-02-24",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 10,
  keywords: [
    "pdf to excel",
    "pdf to xlsx",
    "convert pdf to excel",
    "pdf table to excel",
    "pdf to spreadsheet",
    "pdf to excel online free",
    "extract table from pdf",
  ],
  heroEmoji: "📈",
  toc: [
    { id: "why",      label: "When you need it" },
    { id: "how",      label: "Step-by-step how-to" },
    { id: "behind",   label: "What extracts well" },
    { id: "problems", label: "Common problems" },
    { id: "privacy",  label: "Privacy notes" },
    { id: "vs",       label: "vs Smallpdf / iLovePDF" },
    { id: "faq",      label: "FAQ" },
    { id: "next",     label: "What to do next" },
  ],
  body: Body,
};
