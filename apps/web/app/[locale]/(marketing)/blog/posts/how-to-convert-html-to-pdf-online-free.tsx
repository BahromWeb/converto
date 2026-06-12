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
      You designed an invoice as HTML+CSS because that&apos;s the easiest way to
      lay one out. You have a generated report your script outputs as
      .html. You want to ship a styled email receipt as a PDF attachment.
      Rendering HTML to a PDF used to mean buying wkhtmltopdf, configuring
      Puppeteer, or shipping Chromium binaries. None of that is needed. Drop
      the HTML on a page, get a PDF that looks exactly like Chrome shows it.
      Here&apos;s how, in fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">When you actually need HTML → PDF</H2>
      <p>
        Real cases: invoices generated from a template, receipts that need
        to email as attachments, exported reports from your analytics tool,
        printable versions of a webpage built locally, AI-generated content
        you want to share as a static file, and any time a designer hands
        you HTML+CSS and asks for a print-ready PDF.
      </p>
      <p>
        Why HTML in the first place? Because CSS is the most expressive
        layout language we have. Flexbox positions a header. Grid lays out
        a four-column report. <code>@media print</code> hides navigation
        and shows page numbers. None of this is easy in Word; all of it is
        easy in HTML.
      </p>
      <Callout icon={Lightbulb} title="When you want URL to PDF instead" tone="tip">
        If the page is already live on the web (a blog post, a Medium
        article, a documentation page), use{" "}
        <Link href="/url-to-pdf" className="text-primary hover:underline">URL to PDF</Link>{" "}
        — paste the URL, get a PDF. HTML to PDF is for HTML you control:
        local files, pasted markup, generated output.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert HTML to PDF, step by step</H2>

      <Step n={1} title="Open the HTML to PDF tool">
        Go to <Link href="/html-to-pdf" className="text-primary hover:underline">convertpdfgo.com/html-to-pdf</Link>.
        No account, no email, no installation. Page loads in under a second.
      </Step>
      <Step n={2} title="Paste your HTML (or drop the file)">
        Paste markup directly into the textarea, or drop an .html file from
        your device. External CSS and image URLs are fetched at render
        time; inline styles work without any network access at all.
      </Step>
      <Step n={3} title="A real Chromium engine renders it">
        Behind the scenes, your HTML goes through a server-side headless
        Chrome. That means whatever Chrome shows is what you get in the
        PDF — Flexbox, Grid, transforms, animations frozen to their final
        state, web fonts, custom properties (variables), the works.
      </Step>
      <Step n={4} title="Download the PDF">
        The output is a single PDF, A4 portrait by default. CSS <code>@page</code>
        rules in your HTML are honoured — set <code>@page &#123; size: Letter
        landscape; margin: 0.5in; &#125;</code> to override.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What renders well — the full Chrome surface</H2>
      <p>
        Because we use a real Chromium engine (not wkhtmltopdf, not an
        ad-hoc HTML parser), almost everything that works in Chrome works
        here:
      </p>
      <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
        <li><strong>Layout:</strong> Flexbox, Grid, multi-column, floats, positioned elements — all honoured.</li>
        <li><strong>Typography:</strong> system fonts, embedded <code>@font-face</code> rules, Google Fonts via <code>@import</code> or <code>&lt;link&gt;</code>, font ligatures, OpenType features.</li>
        <li><strong>Colour and effects:</strong> gradients, box-shadow, border-radius, opacity, blend modes, SVG filters.</li>
        <li><strong>Images:</strong> JPG, PNG, WebP, SVG, all at their original resolution.</li>
        <li><strong>JavaScript:</strong> runs during rendering, so dynamic content (Chart.js, D3, React, Vue) lands in the PDF. It&apos;s a one-shot render — interactivity is gone — but the rendered output is there.</li>
        <li><strong>Print-specific CSS:</strong> <code>@page</code> rules for size/margin, <code>@media print</code> for hiding nav / showing footers, <code>page-break-before</code>, <code>page-break-inside: avoid</code>.</li>
      </ul>
    </Section>

    <Section>
      <H2 id="page-control">Controlling page size, margins, and breaks</H2>
      <p>
        For control over the final PDF&apos;s page layout, use standard CSS
        print rules in your HTML. Three you&apos;ll use most:
      </p>
      <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs font-mono leading-relaxed">{`@page {
  size: A4 portrait;        /* or Letter landscape, 8.5in 11in, ... */
  margin: 2cm 1.5cm;        /* top/bottom, left/right */
}

@media print {
  .no-print { display: none; }
  .invoice  { page-break-after: always; }
  table     { page-break-inside: avoid; }
}

h1, h2 {
  page-break-after: avoid;  /* keep heading + first paragraph together */
}`}</pre>
      <Callout icon={Lightbulb} title="For headers and footers on every page" tone="tip">
        Standard CSS Paged Media supports <code>@page :first / :left /
        :right</code> with <code>@top-left</code>, <code>@top-right</code>,
        <code>@bottom-center</code> for repeating headers and footers. The
        Chromium engine implements the common patterns; complex ones
        (running headers from the document content) may need a workaround.
      </Callout>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Fonts come out as Times New Roman</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The font was referenced but not loaded. Fix: include a Google
          Fonts <code>&lt;link&gt;</code> in the <code>&lt;head&gt;</code>,
          or inline an <code>@font-face</code> rule with a base64 data URL
          for fully self-contained HTML. Both work — the difference is whether
          the renderer has internet access at conversion time (it does).
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Page breaks happen mid-paragraph</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Add <code>p, h1, h2 &#123; page-break-inside: avoid; &#125;</code>
          to your CSS for tighter control, and <code>page-break-after:
          always</code> on elements you want to force onto a new page (like
          chapter headings or section dividers).
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Background colours are missing</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Chrome&apos;s default print stylesheet hides backgrounds for ink
          savings. Override with{" "}
          <code>* &#123; -webkit-print-color-adjust: exact;
          print-color-adjust: exact; &#125;</code> at the top of your CSS.
          The renderer respects this.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Dynamic content from JS arrives empty</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The renderer waits ~3 seconds for JavaScript to settle, then
          snapshots. If your dynamic content takes longer (async API calls,
          large data loads), pre-render server-side first and pass the
          settled HTML instead.
        </p>
      </div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>
        Three things to know. <strong>One</strong>: pasted HTML and uploaded
        files go over TLS 1.3.
        <strong> Two</strong>: HTML and output PDFs are encrypted at rest
        while we process them, then deleted automatically within one hour.
        <strong> Three</strong>: we don&apos;t look at your content, train
        on it, or send it anywhere. If your HTML references external assets
        (images, CSS, fonts), those URLs are fetched at render time —
        check that the asset hosts are ones you trust.
      </p>
      <Callout icon={AlertTriangle} title="If the HTML contains secrets" tone="warn">
        Don&apos;t paste API keys, tokens, or internal URLs into the
        textarea. They&apos;d be in the input even if encrypted in transit
        and at rest. Strip them, or render locally with a headless Chrome
        you control.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free HTML-to-PDF tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Renderer</td><td className="py-2 pr-4"><strong>Real Chromium</strong></td><td className="py-2 pr-4">Chromium</td><td className="py-2">Chromium</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2 files/day</td><td className="py-2">Optional</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">JavaScript executes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4">Partial</td><td className="py-2">Partial</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Can I include images via remote URLs?">
        Yes. The renderer fetches remote images, CSS, and fonts at render
        time. Self-contained HTML with base64 data URLs also works and
        doesn&apos;t require network access.
      </Faq>
      <Faq q="What about JavaScript libraries like Chart.js or D3?">
        They run. The renderer waits a few seconds for JavaScript to
        settle, then snapshots — so a Chart.js bar chart renders into the
        PDF as the SVG/canvas Chrome painted.
      </Faq>
      <Faq q="Can I get headers and footers on every page?">
        Yes — use CSS Paged Media: <code>@page &#123; @top-left &#123; content:
        &quot;My Title&quot;; &#125; @bottom-right &#123; content: counter(page);
        &#125; &#125;</code>.
      </Faq>
      <Faq q="What's the maximum HTML size?">
        Pasted HTML up to 5 MB, uploaded .html files up to 30 MB.
        External assets (images, CSS) can be larger as long as the HTML
        itself fits.
      </Faq>
      <Faq q="How long does conversion take?">
        About 2–4 seconds for typical HTML. Heavier pages with lots of
        JavaScript or remote images can take up to 15 seconds — we wait
        for the page to settle before rendering.
      </Faq>
      <Faq q="Can I use this from a server-side script?">
        The tool itself runs in the browser, but if you have a real
        programmatic need, our same renderer is on the roadmap as a
        documented API endpoint.
      </Faq>
      <Faq q="Is there a usage limit?">
        No. The tool is free, with no daily cap, no sign-up wall, no
        watermark, and no upsell.
      </Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">
        Now that your HTML is a PDF, you can{" "}
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

export const htmlToPdfPost: BlogPost = {
  slug: "how-to-convert-html-to-pdf-online-free",
  title: "How to Convert HTML to PDF Online — Free, CSS Preserved, No Watermark",
  description:
    "Render any HTML markup or .html file as a crisp PDF — Flexbox, Grid, web fonts, JavaScript output, all preserved by a real Chromium engine. Free, no sign-up, no watermark. Step-by-step guide, page control with @page, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2022-01-12",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 10,
  keywords: [
    "html to pdf",
    "convert html to pdf",
    "html file to pdf",
    "css to pdf",
    "html to pdf online free",
    "html to pdf with css",
    "render html as pdf",
  ],
  heroEmoji: "🌐",
  toc: [
    { id: "why",          label: "When you need it" },
    { id: "how",          label: "Step-by-step how-to" },
    { id: "behind",       label: "What renders well" },
    { id: "page-control", label: "@page and @media print" },
    { id: "problems",     label: "Common problems" },
    { id: "privacy",      label: "Privacy notes" },
    { id: "vs",           label: "vs Smallpdf / iLovePDF" },
    { id: "faq",          label: "FAQ" },
    { id: "next",         label: "What to do next" },
  ],
  body: Body,
};
