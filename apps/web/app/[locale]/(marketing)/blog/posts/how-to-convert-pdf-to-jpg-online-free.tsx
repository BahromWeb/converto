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
      You need to drop a single page of a PDF into a Slack message, a
      Google Doc, an Instagram story, or a homework submission portal
      that only accepts images. The PDF won&apos;t paste in. The screenshot
      is blurry. The fix is to render every page as its own JPG —
      crisp, ordered, ready to use anywhere images go. Here&apos;s how, in
      about fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">When you need PDF → JPG (and when you don&apos;t)</H2>
      <p>
        Real reasons to convert: dropping a page into a chat message,
        adding a PDF page as an image in a slide deck, embedding into
        a website CMS that only accepts images, sending a single page
        to someone whose PDF reader keeps crashing, or storing a
        signature page as a static image.
      </p>
      <p>
        Reasons NOT to convert: editing text (you want{" "}
        <Link href="/pdf-to-word" className="text-primary hover:underline">PDF to Word</Link>),
        keeping the file searchable (JPGs are pictures of text — they
        don&apos;t hold a text layer), or keeping the file small (JPG of
        a text-heavy page is usually larger than the source PDF page).
      </p>
      <Callout icon={Lightbulb} title="The clearest decision rule" tone="tip">
        Do you need <strong>just to see the page somewhere PDFs aren&apos;t
        accepted?</strong> PDF to JPG is right. Do you need <strong>to
        edit, search, or share text?</strong> Use{" "}
        <Link href="/pdf-to-word" className="text-primary hover:underline">PDF to Word</Link>{" "}
        or{" "}
        <Link href="/extract-text" className="text-primary hover:underline">Extract Text</Link>{" "}
        instead.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert a PDF to JPG images, step by step</H2>

      <Step n={1} title="Open the PDF to JPG tool">
        Go to <Link href="/pdf-to-jpg" className="text-primary hover:underline">convertpdfgo.com/pdf-to-jpg</Link>.
        No account, no email, no installation. Loads in under a second.
      </Step>
      <Step n={2} title="Drop the PDF in">
        Drag the file onto the upload area or click to pick it. Files
        up to 30 MB go through without a queue. Encrypted in transit
        (TLS 1.3), encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="We render every page">
        Each PDF page is rasterised at 150 DPI — the resolution most
        people want for screen and acceptable print. The renderer
        preserves text crispness, image quality, and colour fidelity.
      </Step>
      <Step n={4} title="Download the ZIP">
        The output is a single ZIP file containing one JPG per page,
        named <code>page-1.jpg</code>, <code>page-2.jpg</code>, and so
        on. Unzip and pick the page(s) you need.
      </Step>
    </Section>

    <Section>
      <H2 id="dpi">DPI, file size, and quality — what 150 means in practice</H2>
      <p>
        DPI (dots per inch) is the density at which we sample each PDF
        page. The higher the DPI, the crisper the image — and the
        larger the file. 150 DPI is the sweet spot for most uses: a
        US-Letter page at 150 DPI is about 1275 × 1650 pixels, which is
        large enough for Retina screens but doesn&apos;t blow up the
        download.
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-bold">DPI</th>
              <th className="py-2 pr-4 font-bold">Pixels per Letter page</th>
              <th className="py-2 pr-4 font-bold">Size per page</th>
              <th className="py-2 font-bold">Best for</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b"><td className="py-2 pr-4">72</td><td className="py-2 pr-4">612 × 792</td><td className="py-2 pr-4">~50 KB</td><td className="py-2">Quick web embed</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><strong>150 (default)</strong></td><td className="py-2 pr-4"><strong>1275 × 1650</strong></td><td className="py-2 pr-4"><strong>~200 KB</strong></td><td className="py-2"><strong>Screen + draft print</strong></td></tr>
            <tr className="border-b"><td className="py-2 pr-4">300</td><td className="py-2 pr-4">2550 × 3300</td><td className="py-2 pr-4">~800 KB</td><td className="py-2">High-quality print</td></tr>
            <tr><td className="py-2 pr-4">600</td><td className="py-2 pr-4">5100 × 6600</td><td className="py-2 pr-4">~3 MB</td><td className="py-2">Archival, artwork</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The JPGs look pixelated</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          150 DPI is fine for screen viewing. If you&apos;re going to
          print or zoom in, sign in for higher DPI rendering. (We
          render at the requested DPI directly, not by upscaling 150 DPI
          afterward, so the result is genuinely sharper.)
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Text in the JPG isn&apos;t selectable</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          That&apos;s by design — JPGs are pictures of text, not text. To
          keep the text searchable and copy-pasteable, use{" "}
          <Link href="/pdf-to-word" className="text-primary hover:underline">PDF to Word</Link>{" "}
          or{" "}
          <Link href="/extract-text" className="text-primary hover:underline">Extract Text</Link>{" "}
          instead.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> I only need one page, not all of them</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Run the PDF through{" "}
          <Link href="/extract" className="text-primary hover:underline">our extract tool</Link>{" "}
          first to pick just the page(s) you want, then convert the
          smaller PDF to JPG. Faster, smaller download, less mess.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t render a PDF you can&apos;t open. If you have the
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
        The output ZIP is processed entirely server-side and never cached
        beyond the one-hour auto-delete window.
      </p>
      <Callout icon={AlertTriangle} title="If the PDF holds sensitive content" tone="warn">
        Don&apos;t upload financial or medical documents you wouldn&apos;t
        normally email. JPG is a static image — once it&apos;s out, it&apos;s
        out — so think about where each page ends up before exporting
        the whole thing.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF-to-JPG tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Default DPI</td><td className="py-2 pr-4">150 DPI</td><td className="py-2 pr-4">Unspecified</td><td className="py-2">~150 DPI</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Output format</td><td className="py-2 pr-4">ZIP of JPGs</td><td className="py-2 pr-4">ZIP of JPGs</td><td className="py-2">ZIP of JPGs</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="What if I only want one page, not all of them?">
        Run the PDF through{" "}
        <Link href="/extract" className="text-primary hover:underline">our extract tool</Link>{" "}
        first to keep only the page(s) you want, then convert. Or unzip
        the result and pick the JPG file you need.
      </Faq>
      <Faq q="Will text in the resulting JPGs be searchable?">
        No. JPGs are pictures of text, not text. If you need searchable
        text, use{" "}
        <Link href="/extract-text" className="text-primary hover:underline">Extract Text</Link>{" "}
        or{" "}
        <Link href="/pdf-to-word" className="text-primary hover:underline">PDF to Word</Link>{" "}
        instead.
      </Faq>
      <Faq q="Can I get PNG output instead of JPG?">
        Right now the tool outputs JPG only. JPG is the universal format
        for photos and rendered documents; PNG support is on the list.
      </Faq>
      <Faq q="Will the JPGs keep colour correctly?">
        Yes. The renderer preserves RGB colour and embedded ICC profiles
        from the source PDF, so logos and brand colours come through
        accurately.
      </Faq>
      <Faq q="How long does conversion take?">
        About 1 second per page on a typical PDF. A 20-page document is
        ~20 seconds; the bottleneck is server-side rasterisation, not
        your upload.
      </Faq>
      <Faq q="What's the file size limit?">
        30 MB per upload as a guest, 50 MB when signed in. The output
        ZIP is typically smaller than the source PDF for image-heavy
        files and larger for text-heavy files.
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
        After getting the JPGs, you can{" "}
        <Link href="/jpg-to-pdf" className="font-semibold text-primary hover:underline">rebundle them into a PDF</Link>{" "}
        (different order, fewer pages), <Link href="/compress" className="font-semibold text-primary hover:underline">compress the source PDF</Link>,{" "}
        <Link href="/ocr" className="font-semibold text-primary hover:underline">add an OCR layer first</Link>{" "}
        if it was scanned, or{" "}
        <Link href="/protect" className="font-semibold text-primary hover:underline">protect the original</Link>. All free.
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

export const pdfToJpgPost: BlogPost = {
  slug: "how-to-convert-pdf-to-jpg-online-free",
  title: "How to Convert a PDF to JPG Online — Free, High-Quality, No Watermark",
  description:
    "Turn every PDF page into a high-quality JPG image — packaged as a ZIP. Free, no sign-up, no watermark. Step-by-step guide, DPI explained, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-05-22",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "pdf to jpg",
    "pdf to image",
    "convert pdf to jpg",
    "pdf to jpg online free",
    "pdf pages to images",
    "pdf to jpg high quality",
    "convert pdf to picture",
  ],
  heroEmoji: "🎞️",
  toc: [
    { id: "why",      label: "When you need it" },
    { id: "how",      label: "Step-by-step how-to" },
    { id: "dpi",      label: "DPI and quality" },
    { id: "problems", label: "Common problems" },
    { id: "privacy",  label: "Privacy notes" },
    { id: "vs",       label: "vs Smallpdf / iLovePDF" },
    { id: "faq",      label: "FAQ" },
    { id: "next",     label: "What to do next" },
  ],
  body: Body,
};
