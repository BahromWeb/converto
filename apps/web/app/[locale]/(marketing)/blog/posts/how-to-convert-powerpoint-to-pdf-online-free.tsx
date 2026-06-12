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
      You presented to the board this morning. Now you need to email the deck
      to a partner, share it on Slack, hand it to a journalist as a handout.
      Sending the .pptx is the wrong move — they might be on a Mac, on Keynote,
      on Google Slides, without your custom fonts. Fonts swap, animations
      break, your &quot;15% Y/Y&quot; turns into &quot;15&percnt; Y/Y&quot;.
      The fix is to send a PDF. Here&apos;s how, in fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">Why decks need to become PDFs</H2>
      <p>
        PowerPoint files are <em>edit</em> formats. They store slides + style
        information and let the receiving app redraw the layout using whatever
        fonts and PowerPoint version that machine happens to have. Open the
        same .pptx in Keynote and rebuild begins: your custom Sora font becomes
        Helvetica, the carefully positioned arrow shifts 12 pixels, a chart
        re-renders with slightly different axis labels.
      </p>
      <p>
        PDFs are <em>display</em> formats. The PDF&apos;s slides are the slides
        you saw — fonts embedded, charts as vector graphics, positions locked.
        Open the PDF in Adobe Reader, Preview, Chrome, or on a phone: identical
        layout, every time.
      </p>
      <Callout icon={Lightbulb} title="When to send .pptx vs PDF" tone="tip">
        Send <strong>.pptx</strong> when the recipient needs to edit or
        re-present the deck. Send <strong>PDF</strong> when the deck is final:
        investor decks, board materials, conference handouts, anything you
        wouldn&apos;t want re-titled or re-coloured before being passed around.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert a deck to PDF, step by step</H2>

      <Step n={1} title="Open the PowerPoint to PDF tool">
        Go to <Link href="/ppt-to-pdf" className="text-primary hover:underline">convertpdfgo.com/ppt-to-pdf</Link>.
        No account, no email, no installation. Page loads in under a second.
      </Step>
      <Step n={2} title="Drop the .pptx (or .ppt) in">
        Drag the file onto the upload area or click to pick it. Files up to
        30 MB go through without a queue. Encrypted in transit (TLS 1.3),
        encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="Wait for the render">
        The conversion runs server-side: each slide is rendered at the slide&apos;s
        native aspect ratio (16:9 or 4:3), fonts embedded, animations flattened
        to their final visual state. A 20-slide deck takes ~10 seconds.
      </Step>
      <Step n={4} title="Download the PDF">
        That&apos;s it. One PDF page per slide, in the original order. Open in
        any reader on any device — identical layout to your PowerPoint view.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What we preserve and what we flatten</H2>
      <p>
        Layout: every text box, image, shape, and chart stays at its exact
        position. A logo at (x: 100, y: 80) stays there in the PDF.
      </p>
      <p>
        Fonts: every font embedded in the .pptx carries through. Fonts
        referenced but not embedded fall back to the closest system match —
        which on our server uses the full Liberation family (free metrics-
        compatible matches for Arial, Times, Courier, plus matching extended
        Latin support).
      </p>
      <p>
        Charts and SmartArt: native PowerPoint charts and SmartArt come
        through as <em>vector</em> graphics. They stay crisp at any zoom
        level — even zooming to 800% in a PDF reader doesn&apos;t pixelate
        them.
      </p>
      <p>
        Animations and transitions: PDF is a static format. Animations
        flatten to their <em>final</em> state — the slide you would see at
        the end of clicking through all builds. If you need to preserve the
        animation sequence, export the original as a video instead.
      </p>
      <p>
        Speaker notes: not visible in the default PDF. PowerPoint&apos;s
        &quot;Save as PDF with notes&quot; format isn&apos;t round-tripped
        through online tools — convert with notes locally in PowerPoint
        first if you need them.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Custom fonts swap to defaults</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The font is referenced but not embedded. Fix in PowerPoint:
          <strong> File → Options → Save → Embed fonts in the file → Embed
          all characters</strong>, save, then re-upload. The embedded fonts
          travel with the file.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Charts look flat or off-colour</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Native PowerPoint charts come through as vector graphics — that&apos;s
          the good case. The risk is exotic chart types (waterfall, 3D
          surface, complex SmartArt with custom animations) that don&apos;t
          round-trip cleanly. Workaround: in PowerPoint, right-click the
          chart → <strong>Save as Picture</strong> → paste back as an image
          on the slide. Then convert.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Embedded videos disappear</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          PDF can&apos;t play videos — only display static images. The video&apos;s
          poster image (the still frame shown before play) carries through; the
          video itself doesn&apos;t. For the recipient to watch, send the
          original .pptx, or host the video and link to it from the PDF.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The deck is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t convert a file you can&apos;t open. Remove the password
          in PowerPoint first (<strong>File → Info → Protect Presentation →
          Encrypt with Password</strong> → delete password), save, then convert.
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
        Decks with embargoed financials, M&A plans, or unreleased product
        previews get the same treatment as any other file.
      </p>
      <Callout icon={AlertTriangle} title="If the deck is under embargo" tone="warn">
        After converting, lock the PDF with{" "}
        <Link href="/protect" className="text-primary hover:underline">our protect tool</Link>{" "}
        and{" "}
        <Link href="/watermark" className="text-primary hover:underline">add a watermark</Link>{" "}
        (recipient name + date) so leaks are traceable.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PowerPoint-to-PDF tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Charts kept as vector</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Does it work with both .pptx and .pps / .ppt?">
        Yes. Modern .pptx (PowerPoint 2007+), the legacy .ppt, and the
        autoplay .pps format all go through the same converter.
      </Faq>
      <Faq q="What about Keynote files?">
        Not directly. Open the .key file in Keynote and use Keynote&apos;s
        <em> File → Export To → PowerPoint</em>, save the .pptx, then convert.
      </Faq>
      <Faq q="Will hyperlinks in my slides stay clickable in the PDF?">
        Yes. URLs, email links, and slide-to-slide jumps come through as
        clickable links.
      </Faq>
      <Faq q="What page size and aspect ratio does the PDF use?">
        Each slide uses the slide&apos;s native aspect ratio — 16:9 widescreen
        for modern decks, 4:3 for legacy. PDF page sizes match exactly.
      </Faq>
      <Faq q="How long does conversion take?">
        About 0.5 seconds per slide on a typical deck. A 30-slide deck takes
        ~15 seconds; a 100-slide deck about a minute.
      </Faq>
      <Faq q="Can I convert multiple decks in one go?">
        Right now the tool is one-at-a-time. To combine several decks into a
        single PDF, convert each, then use{" "}
        <Link href="/merge" className="text-primary hover:underline">our merge tool</Link>{" "}
        to bundle the output PDFs.
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
        Now that the deck is a PDF, you can{" "}
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

export const pptToPdfPost: BlogPost = {
  slug: "how-to-convert-powerpoint-to-pdf-online-free",
  title: "How to Convert a PowerPoint Deck to PDF Online — Free, No Watermark",
  description:
    "Convert any .pptx or .ppt deck to a PDF that looks identical on every machine — slides, fonts, charts preserved. Free, no sign-up, no watermark. Step-by-step guide, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-03-21",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "powerpoint to pdf",
    "pptx to pdf",
    "convert powerpoint to pdf",
    "ppt to pdf online free",
    "slides to pdf",
    "powerpoint to pdf no watermark",
    "free pptx to pdf converter",
  ],
  heroEmoji: "📽️",
  toc: [
    { id: "why",      label: "Why decks become PDFs" },
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
