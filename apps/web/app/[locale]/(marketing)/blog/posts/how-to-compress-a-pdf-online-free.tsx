import Link from "next/link";
import { Lightbulb, AlertTriangle, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import type { BlogPost } from "./types";

function H2({ id, children }: { id: string; children: React.ReactNode }) { return <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">{children}</h2>; }
function Lead({ children }: { children: React.ReactNode }) { return <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>; }
function Section({ children }: { children: React.ReactNode }) { return <section className="mt-10 space-y-4">{children}</section>; }
function Callout({ icon: Icon, title, children, tone = "info" }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode; tone?: "info" | "warn" | "tip"; }) {
  const toneClass = tone === "warn" ? "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20" : tone === "tip" ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20" : "border-blue-500/30 bg-blue-50 dark:bg-blue-950/20";
  return (<div className={`my-6 rounded-2xl border p-5 ${toneClass}`}><div className="flex items-start gap-3"><Icon className="mt-0.5 size-5 shrink-0" /><div className="flex-1"><p className="font-bold">{title}</p><div className="mt-1 text-sm leading-relaxed">{children}</div></div></div></div>);
}
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) { return (<div className="my-5 flex gap-4 rounded-2xl border bg-card p-5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{n}</span><div><p className="font-bold">{title}</p><div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div></div></div>); }
function Faq({ q, children }: { q: string; children: React.ReactNode }) { return (<div className="speakable-faq my-4 rounded-2xl border bg-card p-5"><p className="font-bold">{q}</p><div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div></div>); }

const Body = (
  <>
    <Lead>
      An email rejected your attachment because it was 25 MB. A government
      portal refuses anything over 5 MB. A client&apos;s photo-heavy proposal
      weighs 80 MB and the recipient is on 4G. Compressing the PDF before
      sending fixes all three problems in fifteen seconds — without
      flattening the text, without losing colours, without making the
      file look like a fax.
    </Lead>

    <Section>
      <H2 id="why">When you actually need to compress a PDF</H2>
      <p>
        Real cases we see daily: invoices with embedded vendor logos that
        bloat them to 15 MB, scanned contracts that come out at 300 DPI
        whether they need to or not, marketing decks where every slide
        has a full-resolution hero image, lecture notes that include the
        original textbook&apos;s scans, real estate listings full of
        camera-raw photos, board books pulled from a content management
        system without any optimisation.
      </p>
      <p>
        The other common case: you want to email a normal-sized PDF, but
        you&apos;re sending it through corporate Outlook with a 20 MB cap
        and the original is 22. Most of the time the difference is one
        oversized image inside the file.
      </p>
      <Callout icon={Lightbulb} title="When NOT to compress" tone="tip">
        Don&apos;t compress files you&apos;ll print at high quality (full-bleed
        magazines, photo books). Compression trades image quality for
        size, and print magnifies what the screen forgives. For
        production print, keep the original.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to compress a PDF, step by step</H2>

      <Step n={1} title="Open the Compress PDF tool">Go to <Link href="/compress" className="text-primary hover:underline">convertpdfgo.com/compress</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the PDF in">Drag the file onto the upload area or click to pick. Files up to 30 MB go through without a queue. Encrypted in transit (TLS 1.3), encrypted at rest, deleted within one hour.</Step>
      <Step n={3} title="Pick a level">Three levels: low (subtle), medium (sweet spot), high (most aggressive). Medium is the right default for emails and document handoffs.</Step>
      <Step n={4} title="Download">The output is a normal .pdf with the same content. Open in Adobe Reader, Preview, Chrome — text, search, copy-paste, bookmarks, embedded fonts all kept.</Step>
    </Section>

    <Section>
      <H2 id="behind">What we actually compress (and what we leave alone)</H2>
      <p>
        <strong>Compressed:</strong> embedded raster images. A 4000×3000 hero
        photo at 300 DPI inside a slide deck becomes 1600×1200 at JPEG
        quality ~75 on medium. Visually identical on a laptop screen,
        a tenth the bytes.
      </p>
      <p>
        <strong>Compressed:</strong> redundant streams. Multiple identical
        fonts get deduped. Object streams get consolidated. PDF junk
        from generators (Word, LibreOffice, browser print-to-pdf) gets
        cleaned up.
      </p>
      <p>
        <strong>Untouched:</strong> text. Glyph data is already efficient
        and shrinking it costs nothing in size while breaking
        searchability — so we never touch the text layer.
      </p>
      <p>
        <strong>Untouched:</strong> vector graphics (charts, logos, line
        art). These are already small and compressing them only loses
        precision.
      </p>
    </Section>

    <Section>
      <H2 id="levels">Low vs medium vs high — when to use which</H2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-bold">Level</th>
              <th className="py-2 pr-4 font-bold">Image DPI</th>
              <th className="py-2 pr-4 font-bold">JPEG quality</th>
              <th className="py-2 pr-4 font-bold">Typical shrink</th>
              <th className="py-2 font-bold">Best for</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b"><td className="py-2 pr-4">Low</td><td className="py-2 pr-4">200 DPI</td><td className="py-2 pr-4">85</td><td className="py-2 pr-4">20–40%</td><td className="py-2">Print-ready handoffs</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><strong>Medium</strong></td><td className="py-2 pr-4">150 DPI</td><td className="py-2 pr-4">75</td><td className="py-2 pr-4">50–80%</td><td className="py-2"><strong>Email, screen</strong></td></tr>
            <tr><td className="py-2 pr-4">High</td><td className="py-2 pr-4">96 DPI</td><td className="py-2 pr-4">60</td><td className="py-2 pr-4">70–90%</td><td className="py-2">Mobile, archives</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="problems">Common compression problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Output is barely smaller</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">The PDF was already compressed, or it&apos;s text-only with no images to shrink. There&apos;s no magic — if there&apos;s nothing to compress, compression can&apos;t help. Try high level; if that doesn&apos;t move the needle either, the file is already optimised.</p></div>

      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Images look blurry after compression</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">You picked high on a file that needs to be readable at zoom. Step down to medium or low. The rule of thumb: medium for emails read at fit-to-page; low for files that might be zoomed in.</p></div>

      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Compress can&apos;t open what it can&apos;t read. Remove the password via <Link href="/unlock" className="text-primary hover:underline">our unlock tool</Link> first (using the password you have), compress, then re-protect with <Link href="/protect" className="text-primary hover:underline">our protect tool</Link>.</p></div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Three things to know. <strong>One</strong>: files go over TLS 1.3. <strong>Two</strong>: files are encrypted at rest while we process them, then deleted automatically within one hour. <strong>Three</strong>: we don&apos;t look at your files, train on them, or send them anywhere.</p>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF compressors</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left">
        <th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">Smallpdf</th><th className="py-2 font-bold">iLovePDF</th>
      </tr></thead><tbody>
        <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">File size cap</td><td className="py-2 pr-4">30 MB</td><td className="py-2 pr-4">5 MB</td><td className="py-2">25 MB</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Level picker</td><td className="py-2 pr-4"><strong>Low / Med / High</strong></td><td className="py-2 pr-4">One level</td><td className="py-2">2 levels</td></tr>
        <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
      </tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Will text searches still work after compression?">Yes — text is never rasterised. Searches, copy-paste, OCR layers all keep working.</Faq>
      <Faq q="How small can the output get?">Image-heavy PDFs commonly go from 20 MB to 2 MB on medium. Text PDFs shrink less because there&apos;s less to compress.</Faq>
      <Faq q="Does it work on scanned PDFs?">Yes. Scanned PDFs are typically image-heavy, so they shrink dramatically — sometimes 80-90%.</Faq>
      <Faq q="What about embedded fonts?">Fonts are deduped and subset where possible — multiple copies of the same font become one shared copy.</Faq>
      <Faq q="How long does it take?">About 1-2 seconds per MB. A 20 MB file takes ~30 seconds.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
      <Faq q="Is there a usage limit?">No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">Now that the PDF is smaller, you can <Link href="/merge" className="font-semibold text-primary hover:underline">merge it with others</Link>, <Link href="/protect" className="font-semibold text-primary hover:underline">protect it with a password</Link>, <Link href="/sign" className="font-semibold text-primary hover:underline">sign it</Link>, or <Link href="/watermark" className="font-semibold text-primary hover:underline">watermark it</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const compressPdfPost: BlogPost = {
  slug: "how-to-compress-a-pdf-online-free",
  title: "How to Compress a PDF Online — Free, Searchable Text Preserved, No Watermark",
  description: "Shrink any PDF by 50-90% — text searches keep working, images stay sharp at reading zoom. Free, no sign-up, no watermark. Step-by-step guide, low / medium / high explained, common problems.",
  date: "2021-08-12",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: ["compress pdf", "shrink pdf", "reduce pdf size", "compress pdf online free", "make pdf smaller", "pdf compressor"],
  heroEmoji: "🗜️",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "behind", label: "What we compress" },
    { id: "levels", label: "Low / Medium / High" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs Smallpdf / iLovePDF" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
