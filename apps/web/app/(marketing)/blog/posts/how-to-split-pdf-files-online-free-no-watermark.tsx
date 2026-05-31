import Link from "next/link";
import { Check, X, Info, AlertTriangle, ExternalLink } from "lucide-react";
import type { BlogPost } from "./types";

export const splitPdfPost: BlogPost = {
  slug: "how-to-split-pdf-files-online-free-no-watermark",
  title:
    "How to Split a PDF — Extract Pages, Split by Range, Free in 2022",
  description:
    "Step-by-step guide to splitting a PDF online — extract specific pages, split by page range, or break a doc into pieces. Free, no sign-up, no watermark. Tested on desktop and mobile.",
  date: "2022-10-24",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 7,
  heroEmoji: "✂️",
  keywords: [
    "how to split pdf",
    "split pdf by page range",
    "split pdf into multiple files",
    "extract pages from pdf",
    "pdf splitter free",
    "split pdf online",
    "split pdf no signup",
    "break pdf into parts",
    "split pdf on phone",
  ],
  toc: [
    { id: "why-split",         label: "Why split a PDF?" },
    { id: "three-modes",       label: "Three ways to split a PDF" },
    { id: "step-by-step",      label: "Step-by-step: split in convertpdfgo" },
    { id: "syntax",            label: "Page range syntax cheat sheet" },
    { id: "mobile",            label: "Split a PDF on your phone" },
    { id: "common-problems",   label: "Common problems and how to fix them" },
    { id: "privacy",           label: "Privacy: where does your file go?" },
    { id: "vs-competitors",    label: "convertpdfgo vs Smallpdf vs iLovePDF" },
    { id: "faq",               label: "Frequently asked questions" },
    { id: "next-steps",        label: "Next steps" },
  ],
  body: (
    <>
      <Lead>
        Splitting a PDF sounds trivial — until the free tools you find lock
        you out after the second file or stamp a watermark on the output.
        This guide walks through the cleanest way to split a PDF in 2022,
        whether you need a single page extracted or a whole document
        chopped into chapters. No watermark, no sign-up, no software to
        install.
      </Lead>

      <Section id="why-split" h="Why split a PDF?">
        <p>People split PDFs for the same handful of reasons every day:</p>
        <ul>
          <li>
            <strong>Sharing a single page</strong> — pulling page 4 of a
            contract for a colleague who doesn&apos;t need the other
            twenty.
          </li>
          <li>
            <strong>Email size limits</strong> — splitting a 60 MB document
            into three 20 MB pieces so each fits the attachment cap.
          </li>
          <li>
            <strong>Extracting a chapter</strong> from a book or report for
            personal reading.
          </li>
          <li>
            <strong>Separating receipts</strong> when a single scan
            contained ten of them.
          </li>
          <li>
            <strong>Removing pages</strong> — a related but distinct task
            that we cover with the{" "}
            <Link href="/removepage">remove pages tool</Link>.
          </li>
        </ul>
        <p>
          The underlying operation is the same: take one PDF, produce one
          or more smaller PDFs whose pages come from the original.
        </p>
      </Section>

      <Section id="three-modes" h="Three ways to split a PDF">
        <p>
          Online splitters generally support three split modes. Knowing
          which one to pick saves you from doing the job in two steps.
        </p>

        <H3>1. Extract specific pages</H3>
        <p>
          You list the page numbers you want and the splitter produces one
          PDF containing only those pages. Good for pulling a couple of
          pages out of a long document.
        </p>

        <H3>2. Split by page range</H3>
        <p>
          You list one or more ranges — each range becomes its own output
          PDF. For example, splitting a 30-page document with{" "}
          <code>1-10,11-20,21-30</code> gives you three 10-page files.
        </p>

        <H3>3. Split every N pages</H3>
        <p>
          You specify N and the splitter chops the document into fixed
          chunks. A 50-page PDF split every 5 pages becomes 10 files.
        </p>

        <Callout type="info" title="When to use which">
          Extract for a single page or a small selection. Split by range
          for chapter-style boundaries. Split every N when you need
          equal-size chunks — say, for an email attachment limit.
        </Callout>
      </Section>

      <Section id="step-by-step" h="Step-by-step: split in convertpdfgo">
        <p>Total time: under a minute for typical-sized files.</p>

        <Step n={1} title="Open the split tool">
          <p>
            Go to <Link href="/split">convertpdfgo.com/split</Link>. The
            page loads in under a second and shows a drop zone in the
            middle.
          </p>
        </Step>

        <Step n={2} title="Drop your PDF">
          <p>
            Drag the file into the drop zone or click to pick it. Files up
            to 30 MB work as a guest; sign in to lift the cap to 50 MB.
          </p>
        </Step>

        <Step n={3} title="Choose your split mode">
          <p>
            Pick <em>Extract pages</em>, <em>Split by ranges</em>, or
            <em> Split every N</em> from the tab strip at the top.
          </p>
          <p>
            The visual page picker shows every page as a thumbnail —
            click to select, or type the page numbers directly into the
            text field if you already know them.
          </p>
        </Step>

        <Step n={4} title="Hit Split now">
          <p>
            We use{" "}
            <a
              href="https://github.com/pdfcpu/pdfcpu"
              target="_blank"
              rel="noopener noreferrer"
            >
              pdfcpu <ExternalIcon />
            </a>{" "}
            in relaxed validation mode, so even older or slightly
            malformed PDFs split without complaints.
          </p>
          <p>
            For typical files, the split finishes in under 3 seconds.
          </p>
        </Step>

        <Step n={5} title="Download the pieces">
          <p>
            Each output PDF appears as its own download button. Single
            outputs download directly; multiple outputs are also bundled
            into a zip you can grab in one shot.
          </p>
          <p>The files are watermark-free, bit-for-bit clean.</p>
        </Step>
      </Section>

      <Section id="syntax" h="Page range syntax cheat sheet">
        <p>
          The text field accepts a small grammar that covers most needs.
          A quick reference:
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Input</th>
                <th className="px-4 py-3 font-semibold">Means</th>
                <th className="px-4 py-3 font-semibold">Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 font-mono">5</td>
                <td className="px-4 py-3">Page 5 only</td>
                <td className="px-4 py-3">1 PDF (1 page)</td>
              </tr>
              <tr className="bg-card">
                <td className="px-4 py-3 font-mono">1-5</td>
                <td className="px-4 py-3">Pages 1 through 5</td>
                <td className="px-4 py-3">1 PDF (5 pages)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono">1,3,7</td>
                <td className="px-4 py-3">Pages 1, 3, and 7</td>
                <td className="px-4 py-3">1 PDF (3 pages)</td>
              </tr>
              <tr className="bg-card">
                <td className="px-4 py-3 font-mono">1-3, 7-10</td>
                <td className="px-4 py-3">
                  Two ranges (split-by-ranges mode)
                </td>
                <td className="px-4 py-3">2 PDFs</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono">3-</td>
                <td className="px-4 py-3">Page 3 to the end</td>
                <td className="px-4 py-3">1 PDF</td>
              </tr>
              <tr className="bg-card">
                <td className="px-4 py-3 font-mono">-5</td>
                <td className="px-4 py-3">Beginning to page 5</td>
                <td className="px-4 py-3">1 PDF</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs">
          The same grammar works in our{" "}
          <Link href="/extract">extract pages tool</Link> and in the{" "}
          <Link href="/removepage">remove pages tool</Link>.
        </p>
      </Section>

      <Section id="mobile" h="Split a PDF on your phone">
        <p>
          The same flow works on iOS and Android. The visual page picker
          adapts to touch — tap pages to select instead of click, and
          long-press one to drag-select a range.
        </p>
        <ol>
          <li>
            Tap the drop zone and pick the PDF from your Files (iOS) or
            Files / Downloads (Android).
          </li>
          <li>
            Pick a split mode from the tabs.
          </li>
          <li>
            Tap thumbnails to select pages, or type the range manually.
          </li>
          <li>
            Tap <strong>Split now</strong>. The downloads land in your
            phone&apos;s default folder.
          </li>
        </ol>
      </Section>

      <Section id="common-problems" h="Common problems and how to fix them">
        <Problem
          title="My output split has all the original pages instead of just the ones I picked"
          text={
            <>
              That happens in split-by-ranges mode when you only enter one
              range — the splitter assumes you want the whole document
              chopped at that range. Switch to <em>Extract pages</em>{" "}
              mode if you want exactly the pages you listed and nothing
              else.
            </>
          }
        />
        <Problem
          title="Splitting a password-protected PDF fails"
          text={
            <>
              Unlock the PDF first with our{" "}
              <Link href="/unlock">unlock PDF tool</Link>, then drop the
              unlocked version into the splitter.
            </>
          }
        />
        <Problem
          title="The splitter rejects my file as 'not a valid PDF'"
          text={
            <>
              The file probably isn&apos;t a real PDF — a common cause is
              a 404 page accidentally saved as &quot;result.pdf&quot;.
              Open the file in any PDF reader to confirm. If it
              doesn&apos;t open there, the file is corrupted.
            </>
          }
        />
        <Problem
          title="My ranges produced too many files"
          text={
            <>
              You probably used split-by-ranges when you wanted extract.
              Switch modes — each range becomes a separate file in
              split-by-ranges, but extract puts everything into one
              output.
            </>
          }
        />
      </Section>

      <Section id="privacy" h="Privacy: where does your file go?">
        <p>
          Splitting happens server-side because PDFs need binary parsing
          tools that don&apos;t run reliably in the browser. The trade-off:
          your file leaves your device temporarily.
        </p>
        <p>convertpdfgo&apos;s policy in plain English:</p>
        <ul>
          <li>
            Files travel encrypted (TLS 1.3) — same standard as banks and
            email providers.
          </li>
          <li>
            Files are stored encrypted at rest on our servers in
            Germany.
          </li>
          <li>
            Files are automatically deleted within one hour of processing.
          </li>
          <li>
            We never look at your content, share it, or train AI on it.
          </li>
        </ul>
        <p>
          For the full cryptographic details, see our{" "}
          <Link href="/security">security model</Link>.
        </p>
      </Section>

      <Section id="vs-competitors" h="convertpdfgo vs Smallpdf vs iLovePDF">
        <p>
          How the most popular online splitters compare for everyday use:
        </p>
        <ComparisonTable />
        <p className="mt-3 text-xs">
          Reflects the free-tier behaviour of each tool. Paid plans
          typically unlock larger files and more daily operations.
        </p>
      </Section>

      <Section id="faq" h="Frequently asked questions">
        <Faq
          q="Is splitting PDFs free?"
          a="Yes. convertpdfgo splits PDFs for free with no signup, no daily limit, and no watermark. There is no paid tier for individuals."
        />
        <Faq
          q="What's the largest PDF I can split?"
          a="30 MB as a guest, 50 MB once you sign in. There's no daily cap on the number of splits you can run."
        />
        <Faq
          q="Will my split PDF have a watermark?"
          a="No. Output is watermark-free, identical to a desktop split."
        />
        <Faq
          q="Can I split scanned PDFs?"
          a={
            <>
              Yes. If the scan needs OCR first to be searchable, run it
              through <Link href="/ocr">our OCR tool</Link> before
              splitting.
            </>
          }
        />
        <Faq
          q="Can I split every N pages automatically?"
          a="Yes. The Split every N tab lets you enter a number — the splitter chops the document into equal chunks of that size, with the last chunk holding any remainder."
        />
        <Faq
          q="Do the split files keep bookmarks?"
          a="Internal links, bookmarks, and form fields scoped to the split range are preserved. Links pointing to pages outside the range become invalid (the target no longer exists in the output)."
        />
        <Faq
          q="What if I want to merge the splits back later?"
          a={
            <>
              Drop them into our <Link href="/merge">merge PDF tool</Link>.
              The file order in the merge interface becomes the page
              order in the merged output.
            </>
          }
        />
      </Section>

      <Section id="next-steps" h="Next steps">
        <p>
          You came to split a file and probably want to do one of these
          next:
        </p>
        <ul>
          <li>
            <Link href="/compress">Compress each split</Link> if file size
            is the reason you split in the first place.
          </li>
          <li>
            <Link href="/merge">Merge selected splits</Link> with other
            documents.
          </li>
          <li>
            <Link href="/sign">Sign individual splits</Link> before
            sending them to different people.
          </li>
          <li>
            <Link href="/protect">Password-protect a split</Link>{" "}
            containing sensitive pages.
          </li>
          <li>
            <Link href="/extract">Extract pages</Link> if your real need
            was pulling a subset, not chopping the doc.
          </li>
        </ul>
        <p>
          Or browse <Link href="/tools">all 49 tools</Link> for whatever
          PDF task is next.
        </p>
      </Section>

      <hr className="my-12 border-border/40" />

      <p className="text-sm text-muted-foreground">
        Was this guide useful? Share it with someone wrestling with
        watermarked splitters. Found a mistake?{" "}
        <Link href="/contact">Let us know</Link> — we update these
        guides whenever the underlying tools change.
      </p>
    </>
  ),
};

// ─── Inline components (same vocabulary as the merge post) ────────────

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg leading-relaxed text-muted-foreground first-letter:text-3xl first-letter:font-bold first-letter:text-foreground first-letter:mr-1">
      {children}
    </p>
  );
}

function Section({
  id,
  h,
  children,
}: {
  id: string;
  h: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{h}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 text-lg font-bold">{children}</h3>;
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 flex gap-4 rounded-2xl border bg-card p-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
        {n}
      </span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

function Callout({
  type,
  title,
  children,
}: {
  type: "info" | "warn";
  title: string;
  children: React.ReactNode;
}) {
  const Icon = type === "warn" ? AlertTriangle : Info;
  const tone =
    type === "warn"
      ? "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200"
      : "border-primary/30 bg-primary/5 text-foreground";
  return (
    <div className={`mt-5 flex gap-3 rounded-2xl border p-4 ${tone}`}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function Problem({
  title,
  text,
}: {
  title: string;
  text: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-2xl border bg-card p-5">
      <p className="font-bold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="speakable-faq group mt-3 rounded-2xl border bg-card open:shadow-sm">
      <summary className="flex cursor-pointer items-start justify-between gap-3 p-5 font-semibold list-none">
        {q}
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
        {a}
      </div>
    </details>
  );
}

function ComparisonTable() {
  const rows: Array<{
    feat: string;
    us: boolean;
    sm: boolean;
    ilove: boolean;
  }> = [
    { feat: "No watermark", us: true, sm: false, ilove: false },
    { feat: "No signup for basic split", us: true, sm: false, ilove: false },
    { feat: "Unlimited daily splits", us: true, sm: false, ilove: true },
    { feat: "Visual page picker", us: true, sm: true, ilove: true },
    { feat: "Split every N pages", us: true, sm: true, ilove: true },
    { feat: "Mobile friendly", us: true, sm: true, ilove: true },
    { feat: "Files auto-delete within 1 hour", us: true, sm: true, ilove: true },
    { feat: "Open source SDK", us: true, sm: false, ilove: false },
  ];
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Feature</th>
            <th className="px-4 py-3 text-center font-semibold text-primary">
              convertpdfgo
            </th>
            <th className="px-4 py-3 text-center font-semibold">Smallpdf</th>
            <th className="px-4 py-3 text-center font-semibold">iLovePDF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.feat} className={i % 2 ? "bg-card" : ""}>
              <td className="px-4 py-3">{r.feat}</td>
              <Cell ok={r.us} />
              <Cell ok={r.sm} />
              <Cell ok={r.ilove} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ ok }: { ok: boolean }) {
  return (
    <td className="px-4 py-3 text-center">
      {ok ? (
        <Check className="mx-auto size-4 text-emerald-600" />
      ) : (
        <X className="mx-auto size-4 text-rose-400" />
      )}
    </td>
  );
}

function ExternalIcon() {
  return (
    <ExternalLink className="inline size-3 align-baseline opacity-70" />
  );
}
