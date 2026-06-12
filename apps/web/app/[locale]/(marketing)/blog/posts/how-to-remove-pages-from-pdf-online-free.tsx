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
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 text-lg font-bold">{children}</h3>;
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
      You opened a PDF, scrolled to page 7, and there it is — a blank, a duplicate,
      a confidential signature page, a fax cover from someone else's office.
      Most people Google &quot;remove page from PDF&quot; and end up on a tool
      that asks for a sign-up, watermarks the file, or quietly uploads it to a
      server they don&apos;t recognize. None of that is needed. Below is the
      exact way to delete pages from any PDF — free, watermark-free, and
      finished in under a minute.
    </Lead>

    <Section>
      <H2 id="why">Why you usually need to remove pages</H2>
      <p>
        Every PDF you receive in real life is a little messy. Scanners insert
        blank back-sides; bank statements bundle promotional pages; meeting
        minutes carry a draft watermark page; signature pages appear out of
        order. None of it belongs in the version you send to a client, a
        teacher, or a hiring manager.
      </p>
      <p>
        Acrobat Pro can remove pages, but it&apos;s a $239/year subscription for
        a one-minute task. Preview on macOS can do it too — until the PDF is
        protected or the sidebar refuses to render thumbnails. The web tool
        approach skips both. You drag the PDF in, click the pages you don&apos;t
        want, and download a new PDF without them.
      </p>
    </Section>

    <Section>
      <H2 id="when">When removing pages is the right move</H2>
      <p>
        Not every PDF problem is a remove-pages problem. A quick filter:
      </p>
      <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground">
        <li><strong>Remove pages</strong> when one or two specific pages need to go and the rest stays.</li>
        <li><Link href="/extract" className="text-primary hover:underline">Extract pages</Link> when you only want a few pages out of a long PDF — it&apos;s the inverse.</li>
        <li><Link href="/split" className="text-primary hover:underline">Split a PDF</Link> when you need every chapter as its own file.</li>
        <li><Link href="/protect" className="text-primary hover:underline">Protect with a password</Link> if the goal is restricting access, not removing content.</li>
      </ul>
      <Callout icon={Lightbulb} title="The simplest rule" tone="tip">
        If you can name the page numbers you want gone, you need
        Remove Pages. If you can name the page numbers you want to keep,
        you usually want Extract Pages.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to remove pages from a PDF, step by step</H2>
      <p>The whole flow is three clicks. Here it is in detail:</p>

      <Step n={1} title="Open the Remove Pages tool">
        Head to <Link href="/removepage" className="text-primary hover:underline">convertpdfgo.com/removepage</Link>.
        No account, no email, nothing to install. The page loads in under a
        second.
      </Step>
      <Step n={2} title="Drop the PDF in">
        Drag it onto the upload area or click to pick from your device. Files
        up to 30 MB work without a wait. The file is encrypted in transit
        (TLS 1.3), stored encrypted at rest, and deleted automatically after
        one hour.
      </Step>
      <Step n={3} title="Pick the pages to delete">
        Two ways to do it. Either type the page numbers — for example
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono">2,5-7,9</code>
        — or use the visual page picker to click the thumbnails. The visual
        picker is the friendlier one when the PDF is unfamiliar.
      </Step>
      <Step n={4} title="Click Remove now">
        The tool processes the PDF locally on our infrastructure (no third
        party), reconstructs the file without the removed pages, and gives you
        a download link. Counting clicks: 3. Counting seconds: usually 2–4.
      </Step>
      <Step n={5} title="Download the cleaned PDF">
        That&apos;s it. The output keeps the original fonts, embedded
        signatures, internal links, bookmarks, and form fields where they were.
        Nothing about your PDF is &quot;flattened&quot; or re-rendered.
      </Step>
    </Section>

    <Section>
      <H2 id="ranges">How page ranges work — quick syntax</H2>
      <p>
        The text input accepts the same syntax you use in Acrobat. Commas
        separate items, hyphens make ranges:
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-bold">Input</th>
              <th className="py-2 font-bold">What it deletes</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">3</code></td><td className="py-2">Just page 3</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">2,5,9</code></td><td className="py-2">Pages 2, 5, and 9</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">1-3</code></td><td className="py-2">Pages 1, 2, 3</td></tr>
            <tr className="border-b"><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">2,5-7,12</code></td><td className="py-2">Pages 2, 5, 6, 7, and 12</td></tr>
            <tr><td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono">1,3,5,7,9</code></td><td className="py-2">All odd pages up to 9</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Whitespace is fine — <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono">2, 5-7, 12</code>
        and <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono">2,5-7,12</code> mean the same
        thing.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common page-removal problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Page numbers in the PDF don&apos;t match the input</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          PDFs sometimes display &quot;Page i&quot;, &quot;Page ii&quot;, and
          then &quot;Page 1&quot; for the start of chapter 1. Page numbers in
          the remove-pages input are <strong>physical</strong> page numbers,
          counting from 1 — not the printed numbers. The visual picker avoids
          this confusion entirely.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Scanned PDFs lose their OCR layer</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Removing pages does not re-OCR the file — the existing OCR text layer
          is preserved per page. If the file was never OCR&apos;d, send it
          through <Link href="/ocr" className="text-primary hover:underline">our OCR tool</Link> first
          if you need searchable text after removal.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The PDF is password-protected</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t edit a PDF you don&apos;t own. If you have the password,
          remove it first via <Link href="/protect" className="text-primary hover:underline">our protect tool</Link> (set
          to &quot;remove&quot;), then run Remove Pages.
        </p>
      </div>
    </Section>

    <Section>
      <H2 id="privacy">A note on privacy</H2>
      <p>
        Every minute we&apos;ve been online, we&apos;ve heard the same question:
        &quot;Is my PDF safe?&quot;
      </p>
      <p>
        Three things to know. <strong>One</strong>: files go over TLS 1.3 —
        the same encryption your bank uses. <strong>Two</strong>: files are
        encrypted at rest while we process them, then deleted automatically
        within one hour. <strong>Three</strong>: we don&apos;t look at your
        files. We can&apos;t even build features on them — we don&apos;t train
        on user data. If a file shouldn&apos;t leave your laptop in the first
        place, no online tool — ours or anyone else&apos;s — is the right
        answer; use Adobe Acrobat offline or macOS Preview.
      </p>
      <Callout icon={AlertTriangle} title="One more boring tip" tone="warn">
        If the PDF has sensitive information you&apos;re removing, also run a{" "}
        <Link href="/compress" className="text-primary hover:underline">compress</Link> pass after.
        Some PDFs hold a hidden copy of the removed page in their internal
        object stream until the file is re-saved.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Auto-delete window</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
            <tr><td className="py-2 pr-4">Visual page picker</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Does removing pages change the file size?">
        Yes, slightly — the new PDF is smaller because the removed pages are
        gone. For a noticeable size drop, run the output through{" "}
        <Link href="/compress" className="text-primary hover:underline">our compress tool</Link>{" "}
        afterward.
      </Faq>
      <Faq q="Can I remove pages from a scanned PDF?">
        Yes. The tool works on any PDF — scanned or born-digital. If the
        scanned PDF has an OCR text layer, it&apos;s preserved per remaining page.
      </Faq>
      <Faq q="What happens to bookmarks pointing at removed pages?">
        Bookmarks that targeted removed pages are dropped automatically.
        Bookmarks pointing at remaining pages are preserved, with their
        targets remapped to the new page numbers.
      </Faq>
      <Faq q="Will hyperlinks inside the PDF still work?">
        Internal links (table-of-contents jumps, citation links) get remapped
        to the new page positions automatically. External links (URLs) work
        exactly as before.
      </Faq>
      <Faq q="Is there a limit on how many pages I can remove?">
        No fixed limit — you can remove 1 page or 90% of the file, as long as
        at least one page remains. (A PDF with zero pages is invalid by
        definition.)
      </Faq>
      <Faq q="Can I undo a page removal?">
        Not on the same output — once the new PDF is generated, the deleted
        pages are gone from it. But your original upload is still there for
        one hour after upload — refresh the page and re-pick different pages
        from the same file.
      </Faq>
      <Faq q="Do you keep a copy of my PDF after I download it?">
        No. Files are deleted from our servers within one hour of upload,
        whether you downloaded the result or not. We never copy files to
        backups, logs, or analytics.
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

export const removePagePdfPost: BlogPost = {
  slug: "how-to-remove-pages-from-pdf-online-free",
  title: "How to Remove Pages from a PDF Online — Free, No Watermark",
  description:
    "Delete pages from any PDF in seconds — no sign-up, no watermark. Step-by-step guide, page-range syntax, privacy notes, and answers to the seven questions everyone asks.",
  date: "2022-11-14",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: [
    "remove pages from pdf",
    "delete pages from pdf",
    "remove page pdf online",
    "pdf page remover",
    "delete pdf pages free",
    "remove pages from pdf without acrobat",
    "remove blank pages from pdf",
  ],
  heroEmoji: "✂️",
  toc: [
    { id: "why",      label: "Why you need it" },
    { id: "when",     label: "When it's the right move" },
    { id: "how",      label: "Step-by-step how-to" },
    { id: "ranges",   label: "Page-range syntax" },
    { id: "problems", label: "Common problems" },
    { id: "privacy",  label: "Privacy notes" },
    { id: "vs",       label: "vs Smallpdf / iLovePDF" },
    { id: "faq",      label: "FAQ" },
    { id: "next",     label: "What to do next" },
  ],
  body: Body,
};
