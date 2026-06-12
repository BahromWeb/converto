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
      You scanned a passport, photographed a receipt, took a snapshot of
      a handwritten note. Now you need to send them all as one
      attachment, in order, that opens cleanly on the other person&apos;s
      computer. Sending 12 separate JPGs is amateur. Bundling them into
      a single PDF is the right move — and it takes about fifteen
      seconds, no software, no sign-up. Here&apos;s how.
    </Lead>

    <Section>
      <H2 id="why">When you actually need JPG → PDF</H2>
      <p>
        Real cases we see every day: visa applications (passport scan +
        photo + financial statements + invitation letter, in that exact
        order), expense reports (receipt + receipt + receipt + receipt),
        homework submissions, ID + driver&apos;s license bundles, real
        estate paperwork. The common thread: <strong>multiple images
        that mean nothing apart but everything together, in order</strong>.
      </p>
      <p>
        PDF is the right container because it keeps the order locked,
        opens the same on every machine, can be password-protected,
        compressed, signed, and emailed as a single attachment.
      </p>
      <Callout icon={Lightbulb} title="The single test for which tool you need" tone="tip">
        If you have <strong>image files</strong> (.jpg, .png, .webp, .heic
        from a phone), and you want them as <strong>one PDF in order</strong>,
        you&apos;re in the right place. If you have a <strong>PDF</strong>
        and want to pull individual pages back out as images, you want{" "}
        <Link href="/pdf-to-jpg" className="text-primary hover:underline">PDF to JPG</Link>{" "}
        instead.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert images to a single PDF, step by step</H2>

      <Step n={1} title="Open the JPG to PDF tool">
        Go to <Link href="/jpg-to-pdf" className="text-primary hover:underline">convertpdfgo.com/jpg-to-pdf</Link>.
        No account, no email, no installation. Page loads in under a
        second.
      </Step>
      <Step n={2} title="Drop your images in">
        Drag multiple files at once, or click to pick from your device.
        We accept JPG, PNG, WebP, GIF, BMP, and TIFF. Files up to 30 MB
        total go through without a queue. Encrypted in transit (TLS 1.3),
        encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="Re-order if needed">
        The thumbnails appear in the order you dropped them. Drag any
        thumbnail to a new position to re-order — the PDF will keep your
        final order. Use this when you uploaded a stack of receipts out
        of date order.
      </Step>
      <Step n={4} title="Click Convert">
        Each image becomes one PDF page at its original resolution. No
        compression, no re-encoding, no quality loss. Total time: 2–5
        seconds depending on how many images you uploaded.
      </Step>
      <Step n={5} title="Download the PDF">
        That&apos;s it. A single ordered PDF with each image as its own
        page. Watermark-free, embeddable in emails, openable on any
        device.
      </Step>
    </Section>

    <Section>
      <H2 id="formats">Which image formats actually work</H2>
      <p>
        The tool sniffs the file&apos;s magic bytes rather than trusting the
        extension, so a JPG renamed to <code>.jpeg</code>,
        <code> .jpe</code>, or even <code>.photo</code> still works. The
        full list we accept:
      </p>
      <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
        <li><strong>JPG / JPEG</strong> — photos, scans, anything from a smartphone camera.</li>
        <li><strong>PNG</strong> — screenshots, transparent graphics. Transparency becomes white in the PDF.</li>
        <li><strong>WebP</strong> — modern web-format images.</li>
        <li><strong>GIF</strong> — only the first frame is used (PDF pages are static).</li>
        <li><strong>BMP</strong> — old Windows screenshots.</li>
        <li><strong>TIFF</strong> — multi-page scans land as multiple PDF pages.</li>
      </ul>
      <Callout icon={Lightbulb} title="HEIC from iPhone?" tone="tip">
        iPhone screenshots and photos are usually .heic. Convert them to
        JPG first on the phone (Settings → Camera → Formats → Most
        Compatible), or use macOS Preview to export them as JPG. Then
        upload.
      </Callout>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Images come out rotated</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Smartphone photos carry an EXIF rotation tag — the image is
          stored sideways and a flag says &quot;rotate 90° when displaying.&quot;
          The tool honours that flag, so photos appear upright. If a
          page comes out sideways, the EXIF flag was missing or wrong;
          rotate the original in your photos app, then re-upload.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The output PDF is huge</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          High-resolution images = a big PDF. Run the output through{" "}
          <Link href="/compress" className="text-primary hover:underline">our compress tool</Link>{" "}
          for a 60–90% size reduction with no visible quality drop.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> One image looks pixelated</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The source image was already low-resolution. JPG-to-PDF
          doesn&apos;t resample, it preserves whatever you uploaded — so
          a 480×320 JPG becomes a 480×320 PDF page. Use a higher-res
          source if you can.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Transparent PNG areas turn white</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          PDF pages have an opaque background. Transparent areas in
          PNGs flatten to white when converted. If transparency matters,
          stay with PNG.
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
        Image bundles that contain ID documents, passport scans, or
        bank statements get the same treatment as any other file: in,
        processed, gone within an hour.
      </p>
      <Callout icon={AlertTriangle} title="If the images contain ID or financial data" tone="warn">
        After conversion, lock the PDF with{" "}
        <Link href="/protect" className="text-primary hover:underline">our protect tool</Link>{" "}
        so it can&apos;t be opened without a password. Send the password
        through a separate channel from the file itself.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free JPG-to-PDF tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Formats accepted</td><td className="py-2 pr-4"><strong>JPG/PNG/WebP/GIF/BMP/TIFF</strong></td><td className="py-2 pr-4">JPG/PNG only</td><td className="py-2">JPG/PNG/BMP</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Drag-to-reorder thumbnails</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="How many images can I combine at once?">
        Up to 30 MB worth of images per upload as a guest. For most
        smartphone photos that&apos;s ~25 images; for scanned receipts at
        full resolution it&apos;s ~10. Signed-in users get 50 MB.
      </Faq>
      <Faq q="Will the PDF be smaller than the sum of the input images?">
        Usually <em>about the same</em> — JPG to PDF doesn&apos;t recompress.
        If you need smaller, run the output through{" "}
        <Link href="/compress" className="text-primary hover:underline">our compress tool</Link>{" "}
        — it commonly shrinks image-heavy PDFs by 60–90%.
      </Faq>
      <Faq q="Each image becomes its own PDF page, right?">
        Yes. One image in = one PDF page out, at the image&apos;s original
        aspect ratio. No two images share a page.
      </Faq>
      <Faq q="Can I mix JPG and PNG in the same upload?">
        Yes. The tool accepts any combination of supported formats in a
        single batch, and the output PDF treats them all consistently.
      </Faq>
      <Faq q="What page size does the PDF use?">
        Each page matches its image&apos;s aspect ratio at the image&apos;s
        native resolution. There&apos;s no &quot;A4&quot; or &quot;Letter&quot;
        normalisation — the PDF preserves what you uploaded.
      </Faq>
      <Faq q="Can I add a title page or page numbers?">
        Not in this tool, but after the conversion you can use{" "}
        <Link href="/add-page-numbers" className="text-primary hover:underline">our add-page-numbers tool</Link>{" "}
        to number the pages, or{" "}
        <Link href="/merge" className="text-primary hover:underline">merge</Link>{" "}
        a cover page in.
      </Faq>
      <Faq q="Is there a daily limit?">
        No. The tool is free, with no daily cap, no sign-up wall, no
        watermark, and no upsell. The 30 MB upload limit is the only
        constraint.
      </Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">
        After bundling your images, you can{" "}
        <Link href="/compress" className="font-semibold text-primary hover:underline">compress the PDF</Link>,{" "}
        <Link href="/protect" className="font-semibold text-primary hover:underline">password-protect it</Link>,{" "}
        <Link href="/add-page-numbers" className="font-semibold text-primary hover:underline">add page numbers</Link>,{" "}
        <Link href="/sign" className="font-semibold text-primary hover:underline">sign it</Link>, or{" "}
        <Link href="/ocr" className="font-semibold text-primary hover:underline">OCR it for searchable text</Link>. All free.
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

export const jpgToPdfPost: BlogPost = {
  slug: "how-to-convert-jpg-to-pdf-online-free",
  title: "How to Convert JPG to PDF Online — Free, Multi-Image, No Watermark",
  description:
    "Bundle multiple JPG, PNG, or scanned images into a single ordered PDF — no software, no sign-up, no watermark. Step-by-step guide, supported formats, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-06-19",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "jpg to pdf",
    "image to pdf",
    "png to pdf",
    "multiple jpg to pdf",
    "photos to pdf",
    "jpg to pdf online free",
    "combine images into pdf",
  ],
  heroEmoji: "🖼️",
  toc: [
    { id: "why",      label: "When you need it" },
    { id: "how",      label: "Step-by-step how-to" },
    { id: "formats",  label: "Supported formats" },
    { id: "problems", label: "Common problems" },
    { id: "privacy",  label: "Privacy notes" },
    { id: "vs",       label: "vs Smallpdf / iLovePDF" },
    { id: "faq",      label: "FAQ" },
    { id: "next",     label: "What to do next" },
  ],
  body: Body,
};
