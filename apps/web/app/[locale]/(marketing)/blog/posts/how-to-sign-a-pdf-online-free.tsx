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
      A contract arrives as a PDF and the next move is &quot;sign and send back.&quot;
      The annoying way: print, sign, scan, email. The right way: open the PDF
      in a browser, draw your signature with a finger, click where it should
      go, download. Fifteen seconds, no app, no account. Here&apos;s how it
      works.
    </Lead>

    <Section>
      <H2 id="why">When you actually need to e-sign a PDF</H2>
      <p>
        Real cases: NDAs from new clients, employment offer letters, vendor
        contracts under $50k where the qualified e-signature isn&apos;t
        required, lease agreements between friends, school permission slips,
        any document a real human needs to acknowledge but the workflow
        doesn&apos;t justify a $20/month DocuSign seat.
      </p>
      <p>
        A drawn signature embedded in a PDF carries the same legal weight as
        a hand-written one on paper — including the fact that it can be
        forged with a screenshot. For anything that&apos;s legally critical,
        you want a <em>qualified</em> e-signature (eIDAS in the EU, ESIGN in
        the US, similar regimes elsewhere) backed by an identity provider.
        For everything else, a visual signature on a PDF is what
        people&apos;ve been emailing each other for fifteen years.
      </p>
      <Callout icon={Lightbulb} title="The fastest decision rule" tone="tip">
        If the document says &quot;qualified electronic signature&quot; or
        names a specific identity provider, use that provider. Otherwise a
        drawn signature on a PDF is what the other side expects.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to sign a PDF online, step by step</H2>

      <Step n={1} title="Open the Sign PDF tool">
        Go to <Link href="/sign" className="text-primary hover:underline">convertpdfgo.com/sign</Link>.
        No account, no email, no installation. Page loads in under a second.
      </Step>
      <Step n={2} title="Drop the PDF in">
        Drag the file onto the upload area or click to pick it. Up to
        30 MB without a queue. Encrypted in transit (TLS 1.3), encrypted at
        rest, deleted within one hour.
      </Step>
      <Step n={3} title="Build a signature">
        Three modes. <strong>Draw</strong> — sign with a mouse or finger on
        the canvas; works on phones and tablets. <strong>Type</strong> —
        enter your name and we render it in a cursive font. <strong>Upload</strong> — drop a PNG of an existing signature (transparent
        background works best).
      </Step>
      <Step n={4} title="Click on the page to place it">
        The PDF page preview is interactive. Click anywhere on the page and
        the signature appears at that position. Pick a different page from
        the thumbnail row if you need to sign on page 5 instead of page 1.
      </Step>
      <Step n={5} title="Download the signed PDF">
        Click <em>Sign PDF</em>. The server stamps your signature image onto
        the chosen page at the exact coordinates you picked, then sends back
        a fresh PDF. Open it in any reader to confirm.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What we do under the hood</H2>
      <p>
        Behind the scenes, the signed PDF is generated by <a href="https://pdfcpu.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pdfcpu</a>,
        a pure-Go PDF processor we run server-side. Your signature image
        gets stamped onto the chosen page at coordinates measured from the
        page&apos;s bottom-left corner, in PDF points (1 pt = 1/72 inch).
        We don&apos;t rasterise the rest of the page — only the signature
        is added, so the original PDF&apos;s text remains selectable and
        searchable.
      </p>
      <p>
        For the drawn signature, your canvas strokes are exported as a PNG
        with a transparent background, then uploaded alongside the PDF. The
        typed signature renders the same way: name → cursive font → canvas
        → PNG. From the server&apos;s perspective there&apos;s no
        difference between the three input modes — it just receives an
        image and stamps it.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common signing problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The signature comes out too small or too big</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We default to a 180-point-wide signature (≈ 2.5 inches), which fits
          a standard signature line. If yours is too small, draw on a larger
          area of the canvas — pdfcpu scales the image to width and keeps
          the aspect ratio.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The signature lands in the wrong spot</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The click is the bottom-left anchor of the signature. If it lands
          above where you wanted, click lower; the preview updates instantly
          so you can re-click before submitting.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The drawn signature has a white box around it</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          That happens with uploaded JPGs because JPEG can&apos;t store
          transparency. To get a clean signature with no box, upload a PNG
          with a transparent background, or use the draw / type modes — both
          generate PNGs with transparency by default.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t sign a file you can&apos;t open. Remove the password first
          via <Link href="/protect" className="text-primary hover:underline">our protect tool</Link>
          {" "}(set to &quot;remove&quot;), sign, then re-add the password if needed.
        </p>
      </div>
    </Section>

    <Section>
      <H2 id="privacy">Privacy and the legal weight of a drawn signature</H2>
      <p>
        Three things on privacy: files go over TLS 1.3, files are encrypted
        at rest while we process them, and files (input PDF, signature image,
        output PDF) are deleted within one hour. We don&apos;t look at your
        documents.
      </p>
      <p>
        On legal weight: a visual signature on a PDF is generally accepted
        for everyday business — same legal status as a hand-written
        signature scanned to a PDF. For <em>qualified</em> signatures backed
        by identity verification (legally distinct, sometimes required for
        property transfers, government filings, or high-value contracts),
        you need a dedicated provider — DocuSign, Adobe Sign, or a national
        e-ID provider in your country.
      </p>
      <Callout icon={AlertTriangle} title="If the document is high-stakes" tone="warn">
        Sign it here for speed, but back it up with{" "}
        <Link href="/protect" className="text-primary hover:underline">password protection</Link>{" "}
        and consider following up with a wet-signed or qualified-e-signed
        copy. A drawn signature is fine for &quot;please confirm you agree&quot;;
        it&apos;s thin for contracts that might end up in court.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF signing tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Draw / Type / Upload</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> All three</td><td className="py-2 pr-4">Two</td><td className="py-2">All three</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Click-to-place signature</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Will the recipient see the signature even if they don't have my font?">
        Yes — the signature is embedded as an image, not text. Anyone with
        a PDF reader sees the exact pixels you drew.
      </Faq>
      <Faq q="Can I sign on multiple pages?">
        One page per pass. Run the signed PDF through the tool again to add
        a signature on another page.
      </Faq>
      <Faq q="What about signature blocks like 'Signed by: ___ on ___'?">
        Add a quick <Link href="/watermark" className="text-primary hover:underline">watermark</Link>{" "}
        with the date and your name, then sign on top. Two passes, but you
        end up with the same look as DocuSign.
      </Faq>
      <Faq q="Can I sign on a phone?">
        Yes — the drawing canvas works with touch. Tablets give the best
        result because there&apos;s more room, but a phone in landscape works fine.
      </Faq>
      <Faq q="What file size can I sign?">
        30 MB per upload as a guest, 50 MB when signed in.
      </Faq>
      <Faq q="Are signed PDFs accepted by my company's compliance team?">
        Depends on the company. Most accept visually-signed PDFs for
        internal documents and routine vendor contracts. For audit trails,
        check with compliance — they may require a qualified e-signature provider.
      </Faq>
      <Faq q="Is there a usage limit?">
        No. Free, no daily cap, no sign-up wall, no watermark.
      </Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">
        After signing, you can{" "}
        <Link href="/protect" className="font-semibold text-primary hover:underline">password-protect it</Link>,{" "}
        <Link href="/watermark" className="font-semibold text-primary hover:underline">stamp a date</Link>,{" "}
        <Link href="/merge" className="font-semibold text-primary hover:underline">bundle it with attachments</Link>, or{" "}
        <Link href="/compress" className="font-semibold text-primary hover:underline">compress it</Link>{" "}
        before emailing. All free.
      </Callout>
      <p>
        Or browse{" "}
        <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.
      </p>
    </Section>
  </>
);

export const signPdfPost: BlogPost = {
  slug: "how-to-sign-a-pdf-online-free",
  title: "How to Sign a PDF Online — Free, No Software, No Watermark",
  description: "Sign any PDF in your browser — draw with a finger, type a name, or upload an image, then click to place it. Free, no sign-up, no watermark. Step-by-step guide, what visual signatures cover legally, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2021-10-18",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "sign pdf",
    "sign pdf online",
    "e-sign pdf",
    "electronic signature pdf",
    "sign pdf free",
    "draw signature on pdf",
    "sign pdf no watermark",
  ],
  heroEmoji: "✍️",
  toc: [
    { id: "why",      label: "When you need it" },
    { id: "how",      label: "Step-by-step" },
    { id: "behind",   label: "Under the hood" },
    { id: "problems", label: "Common problems" },
    { id: "privacy",  label: "Privacy + legal" },
    { id: "vs",       label: "vs Smallpdf / iLovePDF" },
    { id: "faq",      label: "FAQ" },
    { id: "next",     label: "What to do next" },
  ],
  body: Body,
};
