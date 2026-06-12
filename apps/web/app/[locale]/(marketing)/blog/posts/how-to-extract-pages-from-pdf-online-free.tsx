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
      A 60-page bank statement. A 200-page court filing. A textbook PDF you only
      need three chapters from. Every PDF you receive in real life carries
      twenty pages you actually want — and a hundred you don&apos;t. Extracting
      the ones that matter into a single new PDF is the single most useful
      thing you can do with a long PDF, and it takes about thirty seconds.
      Here&apos;s how.
    </Lead>

    <Section>
      <H2 id="why">Why you usually need to extract pages</H2>
      <p>
        Extracting pages is the inverse of{" "}
        <Link href="/removepage" className="text-primary hover:underline">removing pages</Link>.
        If the PDF you start with has 80 pages and you only care about 5,
        removing 75 pages is a chore; extracting 5 is one click. The bigger
        the original, the more sense it makes to think in terms of what you
        want to <em>keep</em>, not what you want to <em>drop</em>.
      </p>
      <p>
        Real-world examples we see every week: people email us PDFs of an
        entire textbook to extract a single chapter for class, a 100-page
        bank statement to pull January and March only, a contract bundle to
        keep the exhibit pages while losing the cover letter and TOC, or a
        scanned PDF to save the page where their signature already lives so
        they can sign a new copy without re-printing.
      </p>
    </Section>

    <Section>
      <H2 id="vs">Extract vs split vs remove — which one do you want?</H2>
      <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
        <li><strong>Extract</strong> — you want one new PDF that contains <em>only</em> the pages you picked. Most common.</li>
        <li><Link href="/split" className="text-primary hover:underline">Split</Link> — you want multiple new PDFs, one per range you defined.</li>
        <li><Link href="/removepage" className="text-primary hover:underline">Remove pages</Link> — you want the same PDF minus a few pages, with everything else preserved.</li>
        <li><Link href="/merge" className="text-primary hover:underline">Merge</Link> — you have separate PDFs and want to combine them.</li>
      </ul>
      <Callout icon={Lightbulb} title="A 5-second test" tone="tip">
        If you wrote down the pages you want as a comma-separated list,
        extract is the tool. If you wrote them as &quot;everything except
        these pages,&quot; you want remove. If you wrote them as
        &quot;every chapter as its own file,&quot; you want split.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to extract pages from a PDF, step by step</H2>
      <Step n={1} title="Open the Extract Pages tool">
        Go to <Link href="/extract" className="text-primary hover:underline">convertpdfgo.com/extract</Link>.
        No account, no email, no installation. The page loads in under a
        second.
      </Step>
      <Step n={2} title="Drop the PDF in">
        Drag the PDF onto the upload area or click to pick from your device.
        Files up to 30 MB go through without a queue. Encrypted in transit
        (TLS 1.3), encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="Type the pages you want to keep">
        Use the page-ranges input — for example
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono">1-3,5,7-9</code>
        means &quot;pages 1 through 3, then page 5, then pages 7 through 9.&quot;
        Whitespace and comma placement are forgiving.
      </Step>
      <Step n={4} title="Click Extract pages">
        The tool reads only the pages you listed (in the order they appear
        in the original PDF), reconstructs them as a fresh PDF, and gives
        you a single download link. Total time: 2–4 seconds.
      </Step>
      <Step n={5} title="Download the extracted PDF">
        That&apos;s it. The output keeps the original fonts, embedded
        signatures, internal links, bookmarks, and form fields where they
        apply. Nothing about your PDF is &quot;flattened&quot; or re-rendered.
      </Step>
    </Section>

    <Section>
      <H2 id="ranges">Page-range syntax cheat sheet</H2>
      <p>
        The input accepts the same syntax you&apos;d use in Adobe Acrobat:
        commas separate items, hyphens make ranges.
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-bold">Input</th>
              <th className="py-2 font-bold">What you get out</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">3</code></td><td className="py-2">Just page 3 (1-page PDF)</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">1-3</code></td><td className="py-2">Pages 1, 2, 3 (3-page PDF)</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">2,4,6</code></td><td className="py-2">Pages 2, 4, 6 (3-page PDF)</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">1-5,8</code></td><td className="py-2">Pages 1 through 5, then page 8 (6-page PDF)</td></tr>
            <tr><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">1-2,5-7,10-12</code></td><td className="py-2">Pages 1–2, 5–7, 10–12 (8-page PDF)</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Pages always come out in their original document order, no matter
        what order you typed them — so
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono">5,1,3</code>
        and
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono">1,3,5</code>
        produce the same file.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common extraction problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Printed page numbers don&apos;t match the input</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A PDF&apos;s <em>printed</em> page numbers (the &quot;Page 7&quot;
          at the bottom) often don&apos;t match its <em>physical</em> page
          positions — TOCs and prefaces are often numbered i, ii, iii and
          then page 1 starts later. The extract input wants the physical
          position, counting from 1. The visual picker avoids this entirely.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Bookmarks point to nothing after extraction</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We rewrite bookmarks so the ones pointing at kept pages still work
          (their page numbers are remapped). Bookmarks pointing at pages you
          dropped are removed. Same for internal hyperlinks.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t extract from a PDF you can&apos;t open. If you have
          the password, remove it first via
          {" "}<Link href="/protect" className="text-primary hover:underline">our protect tool</Link>{" "}
          (set to &quot;remove&quot;), then run Extract.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Asking for pages that don&apos;t exist</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If the PDF has 10 pages and you type
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono">12</code>,
          the job rejects with an explicit &quot;out of range&quot; error
          rather than silently dropping it. Same for typos like
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono">5--7</code>
          (double hyphen).
        </p>
      </div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>
        Three things to know. <strong>One</strong>: files go over TLS 1.3 —
        the same encryption your bank uses. <strong>Two</strong>: files are
        encrypted at rest while we process them, then deleted automatically
        within one hour. <strong>Three</strong>: we don&apos;t look at your
        files, train on them, or send them anywhere. If a PDF really
        shouldn&apos;t leave your laptop, no online tool — ours or anyone
        else&apos;s — is the right answer; use Adobe Acrobat offline or
        macOS Preview.
      </p>
      <Callout icon={AlertTriangle} title="If you&apos;re extracting from a sensitive PDF" tone="warn">
        Run a{" "}
        <Link href="/compress" className="text-primary hover:underline">compress</Link>{" "}
        pass on the output. Some PDFs hold leftover copies of unused page
        objects in their internal stream until the file is re-saved through a
        cleanup pipeline.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs-others">How we compare to other free tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">File size cap</td><td className="py-2 pr-4">30 MB</td><td className="py-2 pr-4">5 MB</td><td className="py-2">100 MB</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Visual page picker</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="How many pages can I extract at once?">
        Up to every page in the source PDF — there&apos;s no fixed maximum.
        The 30 MB upload limit caps the input, not the count.
      </Faq>
      <Faq q="Will extraction reduce file size?">
        Yes, often dramatically. A 50-page PDF where you extract 5 pages
        typically goes from 5 MB to ~500 KB. Run the output through{" "}
        <Link href="/compress" className="text-primary hover:underline">compress</Link>{" "}
        for an extra 30–60% reduction if it&apos;s image-heavy.
      </Faq>
      <Faq q="Can I extract pages from a scanned PDF?">
        Yes. The tool works on any PDF — scanned or born-digital. The
        existing OCR layer (if there is one) is preserved per kept page.
      </Faq>
      <Faq q="What happens to form fields on extracted pages?">
        AcroForm fields are preserved on the kept pages. Fields that lived
        on dropped pages are removed from the form definition.
      </Faq>
      <Faq q="Does extracting preserve the order I typed?">
        No. Pages always come out in their original document order, no
        matter what order you typed them. To re-order pages, extract first,
        then{" "}
        <Link href="/merge" className="text-primary hover:underline">merge</Link>{" "}
        in the order you want.
      </Faq>
      <Faq q="Will the result have all the original bookmarks?">
        Bookmarks pointing at kept pages survive, with their page numbers
        remapped. Bookmarks pointing at dropped pages are removed.
      </Faq>
      <Faq q="Is there a free limit?">
        No. The whole tool is free, with no daily cap, no sign-up, no
        watermark, and no upsell to a paid tier.
      </Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">
        Now that the PDF is trimmed, you can{" "}
        <Link href="/compress" className="font-semibold text-primary hover:underline">compress it</Link>,{" "}
        <Link href="/merge" className="font-semibold text-primary hover:underline">merge it with another file</Link>,{" "}
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

export const extractPdfPost: BlogPost = {
  slug: "how-to-extract-pages-from-pdf-online-free",
  title: "How to Extract Pages from a PDF Online — Free, No Watermark",
  description:
    "Save only the pages you need from any PDF as a single new file — no sign-up, no watermark. Step-by-step guide, page-range syntax, privacy notes, and the seven questions everyone asks.",
  date: "2022-09-08",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "extract pages from pdf",
    "extract pdf pages",
    "save pdf pages",
    "pdf page extractor",
    "extract pdf range online free",
    "pull pages out of pdf",
    "extract specific pages from pdf",
  ],
  heroEmoji: "📑",
  toc: [
    { id: "why",       label: "Why you need it" },
    { id: "vs",        label: "Extract vs split vs remove" },
    { id: "how",       label: "Step-by-step how-to" },
    { id: "ranges",    label: "Page-range syntax" },
    { id: "problems",  label: "Common problems" },
    { id: "privacy",   label: "Privacy notes" },
    { id: "vs-others", label: "vs Smallpdf / iLovePDF" },
    { id: "faq",       label: "FAQ" },
    { id: "next",      label: "What to do next" },
  ],
  body: Body,
};
