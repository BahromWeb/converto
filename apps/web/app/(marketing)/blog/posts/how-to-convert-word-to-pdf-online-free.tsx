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
      A Word document looks the same on every screen — until someone else
      opens it. Fonts swap, line spacing shifts, an image jumps to a
      different page. The fix is the most boring superpower in the
      office: convert the .docx to a PDF before you send it. PDF
      preserves the exact layout you saw, on every machine,
      forever. Here&apos;s how to do it in fifteen seconds, free.
    </Lead>

    <Section>
      <H2 id="why">Why Word documents need to become PDFs</H2>
      <p>
        Word documents are <em>edit</em> formats. They store text + style
        information and let the receiving application redraw the layout
        using whatever fonts, language packs, and Word version that
        machine happens to have. If your recipient is on Word for the
        web, you wrote in Open Sans 11pt, and they don&apos;t have Open
        Sans installed, the layout will reflow. Tables shift, page
        breaks fall in different places, signatures end up on the wrong
        page.
      </p>
      <p>
        PDFs are <em>display</em> formats. They encode the rendered
        layout pixel-by-pixel and embed the exact fonts used. Open the
        same PDF in Adobe Reader, Preview, Chrome, or a phone — it
        always shows what you saw when you exported it. No reflow, no
        font swap, no surprise.
      </p>
      <Callout icon={Lightbulb} title="When to send Word vs PDF" tone="tip">
        Send <strong>Word</strong> when the recipient needs to edit. Send
        <strong> PDF</strong> when the layout matters: contracts,
        invoices, CVs, application forms, anything signed, anything you
        wouldn&apos;t want a typo introduced into between draft and final.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert a Word document to PDF, step by step</H2>

      <Step n={1} title="Open the Word to PDF tool">
        Go to <Link href="/word-to-pdf" className="text-primary hover:underline">convertpdfgo.com/word-to-pdf</Link>.
        No account, no email, no installation. Loads in under a second.
      </Step>
      <Step n={2} title="Drop the .docx (or .doc) in">
        Drag the file onto the upload area or click to pick it. Files up
        to 30 MB go through without a queue. Encrypted in transit
        (TLS 1.3), encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="Wait a few seconds">
        The conversion runs server-side: layout engine renders every
        page, embedded fonts are preserved, images are kept at their
        original resolution, tables stay as native PDF tables. A single
        page takes ~1 second; a 50-page document about 10 seconds.
      </Step>
      <Step n={4} title="Download the PDF">
        That&apos;s it. Open the PDF in Adobe Reader, Preview, Chrome, or
        any phone — the layout is identical to your Word document on
        every device.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What we preserve and what we render</H2>
      <p>
        Fonts: every font embedded in the .docx is carried through. If a
        font is referenced by name but not embedded (system font), we
        match it to the closest installed family on our server &mdash;
        which uses the full Liberation family (a free, metrics-compatible
        match for Arial, Times New Roman, and Courier).
      </p>
      <p>
        Images: kept at original resolution and DPI. JPEGs stay JPEGs,
        PNGs stay PNGs with transparency. We don&apos;t re-encode them, so
        you won&apos;t see compression artefacts the second time around.
      </p>
      <p>
        Tables, lists, headings: these become structured PDF elements,
        which means accessibility tools (screen readers) can still
        understand the hierarchy. Bookmarks generated from Word&apos;s
        Heading 1/2/3 styles become PDF bookmarks.
      </p>
      <p>
        Hyperlinks and cross-references: clickable in the output PDF,
        pointing at the same destinations they pointed to in Word.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Fonts look different in the PDF than in Word</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Usually happens when your .docx <em>references</em> a font but
          doesn&apos;t <em>embed</em> it. Fix: in Word, go to File → Options →
          Save → check &quot;Embed fonts in the file&quot;, save, then
          re-upload. The embedded fonts will travel with the file.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Images appear blurry or pixelated</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The image was already low-resolution in Word — the converter
          just preserves it. Replace with a higher-resolution version
          (at least 150 DPI for print, 72 DPI for screen) in Word, then
          convert again.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Page breaks fall in different places</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This is exactly what PDF prevents going forward — but if it
          happens during the initial conversion, it&apos;s because Word and
          the server are interpreting some custom typography differently.
          Add explicit page breaks (Ctrl+Enter) at the boundaries you
          care about, save, re-convert.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The Word file is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t convert what you can&apos;t open. Remove the password
          in Word first (File → Info → Protect Document → Encrypt with
          Password → delete password), save, then convert.
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
        If a Word document really shouldn&apos;t leave your laptop, no online
        tool is the right answer; use Word&apos;s built-in &quot;Save as PDF&quot;
        offline.
      </p>
      <Callout icon={AlertTriangle} title="If the PDF will go to many recipients" tone="warn">
        Sign it before sending via{" "}
        <Link href="/sign" className="text-primary hover:underline">our sign tool</Link>{" "}
        and lock it with{" "}
        <Link href="/protect" className="text-primary hover:underline">our protect tool</Link>.
        A signed, password-protected PDF can&apos;t be silently edited in
        transit.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free Word-to-PDF tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Bookmarks from Heading styles</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Does it work with both .doc and .docx?">
        Yes. Modern .docx and legacy .doc both go through the same
        converter.
      </Faq>
      <Faq q="Will hyperlinks in my Word document stay clickable in the PDF?">
        Yes. Both internal links (cross-references, table of contents)
        and external links (URLs) carry over as clickable links in the
        PDF.
      </Faq>
      <Faq q="Are headings from Word's styles converted into PDF bookmarks?">
        Yes. Heading 1 / 2 / 3 styles in Word become a hierarchical
        bookmark tree in the output PDF, so readers can jump between
        sections using their PDF reader&apos;s sidebar.
      </Faq>
      <Faq q="How long does it take?">
        About 1 second per page on a typical document. A 10-page report
        takes 2–3 seconds; a 100-page document about a minute.
      </Faq>
      <Faq q="What's the file size limit?">
        30 MB per upload as a guest, 50 MB when signed in. The output
        PDF is usually smaller than the source .docx for text-heavy
        documents, larger for image-heavy documents.
      </Faq>
      <Faq q="Can I convert multiple Word files in one go?">
        Right now the tool is one-at-a-time. To merge several Word files
        into a single PDF, convert each one, then use{" "}
        <Link href="/merge" className="text-primary hover:underline">our merge tool</Link>{" "}
        to combine the output PDFs.
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
        Now that your Word is a PDF, you can{" "}
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

export const wordToPdfPost: BlogPost = {
  slug: "how-to-convert-word-to-pdf-online-free",
  title: "How to Convert a Word Document to PDF Online — Free, No Watermark",
  description:
    "Convert any .docx or .doc to a PDF that looks identical on every machine — fonts, images, tables preserved. Free, no sign-up, no watermark. Step-by-step guide, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-07-15",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "word to pdf",
    "docx to pdf",
    "convert word to pdf",
    "word to pdf online free",
    "doc to pdf",
    "word to pdf no watermark",
    "free word to pdf converter",
  ],
  heroEmoji: "📄",
  toc: [
    { id: "why",      label: "Why Word needs to become PDF" },
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
