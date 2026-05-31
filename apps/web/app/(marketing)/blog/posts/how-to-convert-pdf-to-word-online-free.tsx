import Link from "next/link";
import { Lightbulb, AlertTriangle, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import type { BlogPost } from "./types";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">
      {children}
    </h2>
  );
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
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
        {n}
      </span>
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
      Most PDF-to-Word converters give you a document that <em>looks</em>
      like the original — until you try to edit it. Every paragraph
      becomes a floating text box, lists turn into stacks of disconnected
      lines, tables become images. You can&apos;t even add a sentence
      without the layout falling apart. Here&apos;s how to convert a PDF
      to a Word file that actually behaves like one, in about thirty
      seconds.
    </Lead>

    <Section>
      <H2 id="why">Why most PDF-to-Word converters produce broken output</H2>
      <p>
        PDFs don&apos;t have paragraphs. They have <em>text positions</em>
        — every character is placed at exact xy-coordinates on the page,
        with no notion of which characters belong to the same sentence,
        paragraph, or heading. To turn that back into a Word document, a
        converter has to <em>reconstruct</em> the structure: group nearby
        glyphs into words, words into lines, lines into paragraphs,
        repeating patterns into lists.
      </p>
      <p>
        Easy converters (LibreOffice&apos;s PDF importer is the textbook
        example) skip that work. They wrap every block of text in a
        positioned text box and call it done. The result opens in Word,
        looks identical to the PDF, and is completely unusable for
        editing — try changing one word and the line overflows because
        the text box has a fixed width. Type a new paragraph and it
        disappears because there&apos;s no paragraph flow.
      </p>
      <Callout icon={Lightbulb} title="The 30-second test" tone="tip">
        Open the converted Word file. Click anywhere in a paragraph and
        try to press Enter to add a new line. If the cursor refuses or
        the layout explodes, you&apos;ve got the broken kind. A real
        conversion lets you edit anywhere like any other Word document.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert a PDF to a real, editable Word file</H2>

      <Step n={1} title="Open the PDF to Word tool">
        Go to <Link href="/pdf-to-word" className="text-primary hover:underline">convertpdfgo.com/pdf-to-word</Link>.
        No account, no email, no installation. The page loads in under a
        second.
      </Step>
      <Step n={2} title="Drop the PDF in">
        Drag the PDF onto the upload area or click to pick from your
        device. Files up to 30 MB go through without a queue. Encrypted
        in transit (TLS 1.3), encrypted at rest, deleted within one
        hour.
      </Step>
      <Step n={3} title="Wait for the conversion">
        The hard work runs server-side: paragraph reconstruction,
        heading detection, list grouping, table boundary inference. A
        single page takes 1–2 seconds; a 50-page document about 30
        seconds. The page shows live progress so you know it&apos;s working.
      </Step>
      <Step n={4} title="Download the DOCX">
        The file downloads as a normal <code>.docx</code> Word document.
        Open it in Microsoft Word, Google Docs, or LibreOffice and edit
        anywhere — paragraphs flow, lists are real lists, tables are
        real tables, fonts are matched as closely as possible.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What we do differently behind the scenes</H2>
      <p>
        Under the hood we run <a href="https://github.com/dothinking/pdf2docx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pdf2docx</a>,
        a Python library built on top of PyMuPDF. It walks each page,
        clusters text blocks by proximity, infers paragraph breaks from
        line spacing, detects headings by font size, and rebuilds tables
        from the underlying line/cell coordinates. The output is a
        flowing DOCX, not a stack of frames.
      </p>
      <p>
        If the conversion ever fails on a structurally weird PDF (rare —
        usually only PDFs with broken XRef tables or unusual encoding),
        we fall back to LibreOffice&apos;s PDF importer so the job still
        completes. You&apos;ll get the lower-quality output rather than an
        error, but it&apos;s the rare path.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to handle them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Scanned PDFs lose their text entirely</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A scanned PDF is a picture of text, not text itself. PDF→Word
          can&apos;t extract characters that don&apos;t exist in the file.
          Run the scan through{" "}
          <Link href="/ocr" className="text-primary hover:underline">our OCR tool</Link>{" "}
          first to add a text layer, then convert.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Multi-column layouts wrap weirdly</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Newsletters, journal articles, and brochures use multi-column
          layouts. Even with proper paragraph reconstruction, columns
          often look better as text-flow in a single column than as
          fragile two-column Word sections. If editing is the goal, this
          tradeoff usually helps; if pixel-perfect layout is the goal,
          you probably want a PDF, not a DOCX.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Embedded fonts don&apos;t exist on your machine</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The conversion preserves font <em>names</em>, but if you don&apos;t have
          the font installed, Word substitutes the closest match. That&apos;s
          why a fancy display font in the PDF sometimes becomes a more
          ordinary serif/sans in Word.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t convert a PDF you can&apos;t open. If you have the
          password, remove it first via{" "}
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
        then deleted automatically within one hour. <strong>Three</strong>: we
        don&apos;t look at your files, train on them, or send them anywhere.
        If a PDF really shouldn&apos;t leave your laptop, no online tool — ours
        or anyone else&apos;s — is the right answer; use Adobe Acrobat offline
        or convert with Microsoft Word&apos;s built-in PDF import.
      </p>
      <Callout icon={AlertTriangle} title="If the PDF has confidential content" tone="warn">
        Run a{" "}
        <Link href="/removepage" className="text-primary hover:underline">remove-pages</Link>{" "}
        pass first if there are sections that don&apos;t need to be in the
        Word version. Less data on our servers is better than more.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF-to-Word tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Flowing paragraphs (not text boxes)</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4">Mixed</td><td className="py-2">Mostly</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2 files/day</td><td className="py-2">Optional</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">File size cap</td><td className="py-2 pr-4">30 MB</td><td className="py-2 pr-4">5 MB</td><td className="py-2">25 MB</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Will the Word document open in Microsoft Word, Google Docs, and LibreOffice?">
        Yes. The output is a standards-compliant .docx file, so any
        Word-compatible app opens it. Tested with Microsoft Word 2019+,
        Word for Mac, Word for the web, Google Docs, and LibreOffice
        Writer 7+.
      </Faq>
      <Faq q="Do tables come out as real Word tables?">
        Yes — the converter detects table boundaries from the underlying
        cell coordinates and rebuilds them as native Word tables, with
        rows, columns, and cell merges where the PDF had them.
      </Faq>
      <Faq q="How long does conversion take?">
        About 1–2 seconds per page on a typical PDF. A 50-page document
        takes ~30 seconds; a 200-page document about 2 minutes.
      </Faq>
      <Faq q="What's the file size limit?">
        30 MB per upload as a guest, 50 MB when signed in. The limit is
        on the upload, not the output — most PDFs compress significantly
        when converted to DOCX.
      </Faq>
      <Faq q="Can I convert a scanned PDF?">
        Not directly — scanned PDFs are pictures of text, not text. Run
        them through{" "}
        <Link href="/ocr" className="text-primary hover:underline">our OCR tool</Link>{" "}
        first to add a text layer, then convert.
      </Faq>
      <Faq q="What about images embedded in the PDF?">
        Images come through as embedded pictures in the DOCX, in their
        original position relative to the surrounding text.
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
        After editing in Word, you can{" "}
        <Link href="/word-to-pdf" className="font-semibold text-primary hover:underline">convert back to PDF</Link>,{" "}
        <Link href="/merge" className="font-semibold text-primary hover:underline">merge it with other PDFs</Link>,{" "}
        <Link href="/protect" className="font-semibold text-primary hover:underline">password-protect it</Link>, or{" "}
        <Link href="/sign" className="font-semibold text-primary hover:underline">sign it</Link>. All free.
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

export const pdfToWordPost: BlogPost = {
  slug: "how-to-convert-pdf-to-word-online-free",
  title: "How to Convert a PDF to Word Online — Free, Editable Output, No Watermark",
  description:
    "Convert any PDF to a real, editable Word document — flowing paragraphs, real lists, real tables. Free, no sign-up, no watermark. Step-by-step guide, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-08-12",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 10,
  keywords: [
    "pdf to word",
    "pdf to docx",
    "convert pdf to word",
    "pdf to word online free",
    "pdf to editable word",
    "pdf to word free no watermark",
    "best pdf to word converter",
  ],
  heroEmoji: "📝",
  toc: [
    { id: "why",      label: "Why most are broken" },
    { id: "how",      label: "Step-by-step how-to" },
    { id: "behind",   label: "What we do differently" },
    { id: "problems", label: "Common problems" },
    { id: "privacy",  label: "Privacy notes" },
    { id: "vs",       label: "vs Smallpdf / iLovePDF" },
    { id: "faq",      label: "FAQ" },
    { id: "next",     label: "What to do next" },
  ],
  body: Body,
};
