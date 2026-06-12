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
      Sales sent the deck to a prospect last week. Now it&apos;s circulating
      on LinkedIn with no attribution. Lawyers email contracts marked
      &quot;final&quot; that were actually drafts. The cure for both is a
      watermark — DRAFT on the draft, your logo on the deck. Recipients
      still see the document, but they also see who made it and what
      state it&apos;s in.
    </Lead>

    <Section>
      <H2 id="why">When you actually need a watermark</H2>
      <p>
        Real cases: confidential decks shared with prospects under NDA,
        document templates that get re-used across teams, draft
        contracts that shouldn&apos;t be signed yet, press materials
        embargoed until launch day, exhibit prints labeled with your
        firm&apos;s name, anything you&apos;d want to be obvious if a
        screenshot ended up on Twitter.
      </p>
      <p>
        A watermark doesn&apos;t prevent forwarding — it&apos;s not security.
        It&apos;s a label. The point is that anyone who sees the document
        also sees the watermark and knows the context: &quot;this is a
        draft&quot;, &quot;this belongs to Acme&quot;, &quot;this is
        under embargo&quot;.
      </p>
      <Callout icon={Lightbulb} title="Text vs image watermark" tone="tip">
        Use <strong>text</strong> for state words: DRAFT, CONFIDENTIAL, INTERNAL.
        Cheap, immediate, no asset needed. Use <strong>image</strong>
        for brand: your logo at low opacity in the corner. Looks
        professional, doesn&apos;t fight the content.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to watermark a PDF, step by step</H2>

      <Step n={1} title="Open the Watermark tool">Go to <Link href="/watermark" className="text-primary hover:underline">convertpdfgo.com/watermark</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the PDF in">Drag the file onto the upload area or click to pick. Files up to 30 MB go through without a queue. Encrypted in transit (TLS 1.3), encrypted at rest, deleted within one hour.</Step>
      <Step n={3} title="Pick text or image">Type a word for text mode, or upload a logo PNG for image mode. Set opacity (10-50% is typical for backgrounds; 80-100% for stamps), rotation (0 for stamps, 45 for diagonals), and position.</Step>
      <Step n={4} title="Download">The output is a normal PDF with the watermark stamped on every page. No tool watermark from us.</Step>
    </Section>

    <Section>
      <H2 id="behind">Opacity, rotation, position — picking the right combo</H2>
      <p>
        <strong>Opacity:</strong> 10-30% for backgrounds (logo behind content
        that doesn&apos;t fight the text). 50-80% for clear stamps
        (DRAFT diagonally across the page). 100% for tiny corner marks
        (small logo in the bottom-right where it doesn&apos;t hide content).
      </p>
      <p>
        <strong>Rotation:</strong> 0° for corner stamps, headers and footers.
        45° for diagonal across-the-page text stamps. 90° for vertical
        marks on the left edge.
      </p>
      <p>
        <strong>Position:</strong> Center for diagonal stamps. Corner
        (bottom-right is least disruptive) for logos. Top-left and
        top-right for state labels. We support 9 anchor positions plus
        offset overrides.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common watermark mistakes and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Watermark is too dark and obscures the text</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Drop the opacity. 100% is for tiny corner marks. 25-40% works for full-page diagonals — the watermark is visible but the text under it stays readable.</p></div>

      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Logo PNG has a white background instead of transparent</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use a PNG with transparent background. Anything other than transparency stays in the output. Most logo tools export with transparency by default; double-check before uploading.</p></div>

      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Watermark appears on only some pages</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Check the page selector — by default it&apos;s &quot;all&quot;, but if you set a range like &quot;1-3&quot; only those pages get the mark. To watermark everything, leave the field empty or type &quot;all&quot;.</p></div>

      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Watermarking needs to open and modify the file. <Link href="/unlock" className="text-primary hover:underline">Unlock it first</Link> with the password, watermark, then <Link href="/protect" className="text-primary hover:underline">re-protect</Link>.</p></div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Three things to know. <strong>One</strong>: files go over TLS 1.3. <strong>Two</strong>: files are encrypted at rest while we process them, then deleted automatically within one hour. <strong>Three</strong>: we don&apos;t look at your files or train on them.</p>
      <Callout icon={AlertTriangle} title="A watermark is not security" tone="warn">If the document is truly confidential, watermark <em>and</em> <Link href="/protect" className="text-primary hover:underline">password-protect it</Link>. A determined recipient can still photograph a watermarked PDF; encryption stops them at the open dialog.</Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF watermark tools</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left">
        <th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">Smallpdf</th><th className="py-2 font-bold">iLovePDF</th>
      </tr></thead><tbody>
        <tr className="border-b"><td className="py-2 pr-4">Text + image modes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Both</td><td className="py-2 pr-4">Both</td><td className="py-2">Both</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">No extra watermark from us</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
        <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
      </tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Can I watermark just one page?">Yes — specify a page like &quot;1&quot; or range &quot;1-3&quot; in the page selector. Other pages stay unmarked.</Faq>
      <Faq q="What image formats does the tool accept?">PNG (with or without transparency), JPG, WebP, GIF, BMP. PNG with transparency is the cleanest for logo overlays.</Faq>
      <Faq q="Can I add multiple watermarks at once?">Not in one job — one watermark per pass. To stack (logo + DRAFT), run two passes back-to-back.</Faq>
      <Faq q="Will the watermark show on print?">Yes — it&apos;s baked into the page content, not a viewer hint. Print preserves it.</Faq>
      <Faq q="How long does it take?">About 1-3 seconds for typical files. Image watermarks take slightly longer than text.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
      <Faq q="Is there a usage limit?">No. Free, no daily cap, no sign-up wall.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">Now that the PDF is watermarked, you can <Link href="/sign" className="font-semibold text-primary hover:underline">sign it</Link>, <Link href="/protect" className="font-semibold text-primary hover:underline">password-protect it</Link>, <Link href="/compress" className="font-semibold text-primary hover:underline">compress before emailing</Link>, or <Link href="/merge" className="font-semibold text-primary hover:underline">combine with other PDFs</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const watermarkPdfPost: BlogPost = {
  slug: "how-to-watermark-a-pdf-online-free",
  title: "How to Watermark a PDF Online — Free, Text or Image, No Extra Watermark",
  description: "Stamp DRAFT, CONFIDENTIAL, or your logo on every PDF page — opacity, rotation, position all controllable. Free, no sign-up, no extra watermark added by the tool.",
  date: "2021-07-30",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: ["watermark pdf", "add watermark to pdf", "draft watermark pdf", "logo on pdf", "image watermark pdf", "confidential pdf"],
  heroEmoji: "💧",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "behind", label: "Opacity / rotation / position" },
    { id: "problems", label: "Common mistakes" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs Smallpdf / iLovePDF" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
