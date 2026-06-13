import Link from "next/link";
import { Check, X, Info, AlertTriangle, ExternalLink } from "lucide-react";
import type { BlogPost } from "./types";

const SLUG = "how-to-merge-pdf-files-online-free-no-watermark";

export const mergePdfPost: BlogPost = {
  slug: SLUG,
  title:
    "How to Merge PDF Files Online — Free, Without Watermark, in 2026",
  description:
    "Step-by-step guide to combining multiple PDFs into one file online — free, no sign-up, no watermark. Tested on desktop and mobile, with tips on order, file size, and privacy.",
  date: "2026-06-01",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 8,
  heroEmoji: "📎",
  keywords: [
    "how to merge pdf",
    "merge pdf without watermark",
    "free pdf merger",
    "combine pdf files",
    "merge pdf online",
    "merge pdf on phone",
    "merge multiple pdfs into one",
    "pdf merger no signup",
    "merge pdf step by step",
  ],
  toc: [
    { id: "why-merge",         label: "Why merge PDFs?" },
    { id: "three-ways",        label: "Three ways to merge PDFs" },
    { id: "step-by-step",      label: "Step-by-step: merge in convertpdfgo" },
    { id: "mobile",            label: "How to merge PDFs on your phone" },
    { id: "order",             label: "Why page order matters" },
    { id: "common-problems",   label: "Common problems and how to fix them" },
    { id: "privacy",           label: "Privacy: where does your file go?" },
    { id: "vs-competitors",    label: "convertpdfgo vs Smallpdf vs iLovePDF" },
    { id: "faq",               label: "Frequently asked questions" },
    { id: "next-steps",        label: "Next steps" },
  ],
  body: (
    <>
      <Lead>
        Merging PDFs sounds simple — until you actually try the free tools
        most search results lead you to. Half of them watermark the output,
        the other half cap you at 2 files unless you create an account.
        This guide walks through the cleanest way to combine PDFs in 2026,
        whether you&apos;re on a laptop or a phone — without watermarks,
        without sign-up, without paying anyone.
      </Lead>

      <Section id="why-merge" h="Why merge PDFs?">
        <p>
          People merge PDFs for the same handful of reasons every day:
        </p>
        <ul>
          <li>
            <strong>Combining receipts and invoices</strong> for an expense
            report — one PDF per ticket goes in, a single attachment comes
            out.
          </li>
          <li>
            <strong>Bundling contract pages</strong> when the cover page,
            signatures, and exhibits live in separate files.
          </li>
          <li>
            <strong>Assembling a portfolio</strong> from individual project
            PDFs into one document a client can scroll through.
          </li>
          <li>
            <strong>Stitching scanned pages</strong> together when the
            scanner saved each page as a separate file.
          </li>
          <li>
            <strong>Joining chapter PDFs</strong> for academic reading lists
            so you only print or share one document.
          </li>
        </ul>
        <p>
          The underlying operation is the same in all of these cases:
          take N PDF files, concatenate them in the order you choose,
          produce one PDF whose pages run in that order.
        </p>
      </Section>

      <Section id="three-ways" h="Three ways to merge PDFs">
        <p>
          There are really only three places you can merge a PDF: in a
          browser, on a desktop, or on the command line. Each has tradeoffs.
        </p>

        <H3>1. In a browser (the path most people take)</H3>
        <p>
          Online PDF mergers work without installing software, run on any
          device, and produce a downloadable file in seconds. The catches
          are usually the ones we mentioned in the intro: watermarks, file
          limits, or paywalls. We&apos;ll cover how to dodge them in the
          step-by-step below.
        </p>

        <H3>2. On the desktop</H3>
        <p>
          On macOS,{" "}
          <a
            href="https://support.apple.com/guide/preview/welcome/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview <ExternalIcon />
          </a>{" "}
          can merge PDFs natively — drag a PDF onto another in the sidebar
          to insert it. On Windows, Microsoft Edge can open PDFs but not
          merge them. Adobe Acrobat Pro is the canonical choice and a
          paid one (subscription starts around $20/month).
        </p>

        <H3>3. On the command line</H3>
        <p>
          Engineers reach for{" "}
          <a
            href="https://github.com/pdfcpu/pdfcpu"
            target="_blank"
            rel="noopener noreferrer"
          >
            pdfcpu <ExternalIcon />
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/qpdf/qpdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            qpdf <ExternalIcon />
          </a>
          . Both are free, both are open source, both are perfect for
          scripting batch jobs. Beginners typically don&apos;t want to
          install a CLI tool just to merge two invoices.
        </p>

        <Callout type="info" title="Our pick for everyday merging">
          Browser-based — specifically a free, watermark-free tool like
          <Link href="/merge"> convertpdfgo&apos;s merge tool</Link>.
          You don&apos;t install anything, your laptop stays clean, and
          the result is bit-for-bit identical to what a paid desktop tool
          would produce.
        </Callout>
      </Section>

      <Section id="step-by-step" h="Step-by-step: merge in convertpdfgo">
        <p>
          Here&apos;s the actual workflow, end to end. The whole thing takes
          under a minute for typical-sized files.
        </p>

        <Step n={1} title="Open the merge tool">
          <p>
            Go to{" "}
            <Link href="/merge">convertpdfgo.com/merge</Link>. The page loads
            in under a second and you&apos;ll see an upload area with a big
            dotted border in the middle.
          </p>
        </Step>

        <Step n={2} title="Add your PDFs">
          <p>
            Drag your files into the upload area or click it to open a
            file picker. You can select multiple files at once. The
            interface accepts files up to 30 MB each as a guest, or 50 MB
            once you sign in (free).
          </p>
          <p>
            Each uploaded file appears as a small card with its name and
            size. You can keep adding files until you have everything you
            need.
          </p>
        </Step>

        <Step n={3} title="Reorder the cards (this matters)">
          <p>
            The order of the cards is the order pages will appear in the
            final merged PDF. Drag the cards left and right to reorder
            them. The first card becomes page 1.
          </p>
          <p>
            If you uploaded files in the wrong order — say, the contract
            came in after the cover page — just drag them into the order
            you want before merging.
          </p>
        </Step>

        <Step n={4} title="Hit Merge now">
          <p>
            The Merge now button at the bottom of the card runs the
            operation. We use{" "}
            <a
              href="https://github.com/pdfcpu/pdfcpu"
              target="_blank"
              rel="noopener noreferrer"
            >
              pdfcpu <ExternalIcon />
            </a>{" "}
            in relaxed validation mode, so even slightly malformed PDFs
            (e.g. older scans) merge without complaints.
          </p>
          <p>
            For typical file sizes (up to 10 MB total), the merge finishes
            in under 3 seconds.
          </p>
        </Step>

        <Step n={5} title="Download the merged file">
          <p>
            The Download merged PDF button appears as soon as the merge is
            done. Click it. The browser downloads the file directly —
            no preview screen, no upsell, no &quot;create an account to
            access your file&quot; gate.
          </p>
          <p>
            The merged file is bit-for-bit watermark-free. Open it in any
            PDF reader to confirm.
          </p>
        </Step>
      </Section>

      <Section id="mobile" h="How to merge PDFs on your phone">
        <p>
          The same flow works on a phone. The tool detects mobile and
          swaps the drag-and-drop interface for a tap-to-add list with
          long-press to reorder.
        </p>
        <p>
          Typical mobile workflow:
        </p>
        <ol>
          <li>
            Tap <strong>Select PDFs</strong> and pick files from your
            Files app (iOS) or Files / Downloads (Android).
          </li>
          <li>
            For PDFs in Gmail, use the &quot;Save to Files&quot; option in
            the attachment preview first, then come back to the merger.
          </li>
          <li>
            Long-press a card and drag to reorder.
          </li>
          <li>
            Tap <strong>Merge now</strong>. The download lands in your
            phone&apos;s default Downloads folder.
          </li>
        </ol>

        <Callout type="info" title="iPhone tip">
          Recent iOS versions can also merge PDFs natively from the Files
          app — long-press a PDF, tap Create PDF on the second file,
          done. It works but doesn&apos;t let you reorder pages, so for
          anything more than two files an online merger is faster.
        </Callout>
      </Section>

      <Section id="order" h="Why page order matters">
        <p>
          A PDF is just a sequence of pages. Merging doesn&apos;t rearrange
          anything inside the files — it concatenates them end-to-end.
          That means the order you put files in is exactly the order you
          get pages out.
        </p>
        <p>
          Three patterns where order trips people up:
        </p>
        <ul>
          <li>
            <strong>Cover pages get buried.</strong> If you uploaded the
            cover after the content, drag it to position 1 before merging.
          </li>
          <li>
            <strong>Appendices land in the middle.</strong> Same idea —
            drag them to the end.
          </li>
          <li>
            <strong>Scanner output is reversed.</strong> Some sheet-fed
            scanners save the last page as file 1. Watch for this when
            stitching scans together.
          </li>
        </ul>
      </Section>

      <Section id="common-problems" h="Common problems and how to fix them">
        <Problem
          title="The merged PDF is much bigger than the originals"
          text={
            <>
              That&apos;s normal — PDFs include fonts and images that get
              concatenated rather than deduplicated. If the result is too
              big, run it through a{" "}
              <Link href="/compress">PDF compressor</Link> after merging.
              Most files shrink by 30-90% with no visible quality loss.
            </>
          }
        />
        <Problem
          title="The output has blank pages between sections"
          text={
            <>
              That happens when one of the input PDFs ended with a blank
              page (common in academic papers). Use{" "}
              <Link href="/detect-blank">detect blank pages</Link> on the
              merged output, then{" "}
              <Link href="/removepage">remove the empty pages</Link>.
            </>
          }
        />
        <Problem
          title="The merger says my file is not a valid PDF"
          text={
            <>
              The file probably isn&apos;t a real PDF — a common cause is
              accidentally saving a 404 error page as &quot;result.pdf&quot;
              when a download failed. Open the file in any PDF reader to
              confirm. If it doesn&apos;t open there either, the file is
              corrupted and needs to be re-downloaded.
            </>
          }
        />
        <Problem
          title="I uploaded the files in the wrong order"
          text={
            <>
              Don&apos;t re-upload — just drag the cards in the merge
              interface. The first card is page 1 of the output, and you
              can reorder before clicking Merge.
            </>
          }
        />
      </Section>

      <Section id="privacy" h="Privacy: where does your file go?">
        <p>
          When you use any online PDF merger, your files leave your device.
          That&apos;s a tradeoff worth knowing about, especially for
          sensitive documents like contracts or medical records.
        </p>
        <p>Here&apos;s the convertpdfgo policy in plain English:</p>
        <ul>
          <li>
            Files travel encrypted over the wire (TLS 1.3) — the same
            standard banks and email providers use.
          </li>
          <li>
            Files are stored encrypted at rest on our servers in
            Germany.
          </li>
          <li>
            Files are automatically deleted within one hour of processing,
            sooner if you delete them manually from the My files page
            (signed-in users only).
          </li>
          <li>
            We never look at your content. We never share it with third
            parties. We never train AI on it.
          </li>
        </ul>
        <p>
          For maximum-sensitivity documents, consider a desktop tool that
          processes locally — but understand that &quot;local&quot; is no
          guarantee against malware or backup leakage either.
        </p>
        <p>
          For the cryptographic details, see our{" "}
          <Link href="/security">security model</Link>.
        </p>
      </Section>

      <Section id="vs-competitors" h="convertpdfgo vs Smallpdf vs iLovePDF">
        <p>
          Here&apos;s how the most popular online PDF mergers compare for
          everyday use as of 2026:
        </p>
        <ComparisonTable />
        <p className="mt-3 text-xs">
          Comparison reflects the free-tier behaviour of each tool as of
          June 2026. Paid plans usually unlock more.
        </p>
      </Section>

      <Section id="faq" h="Frequently asked questions">
        <Faq
          q="Is merging PDFs free?"
          a="Yes. convertpdfgo merges PDFs for free with no signup, no daily limit, and no watermark. There is no paid tier."
        />
        <Faq
          q="How many PDFs can I merge at once?"
          a="As many as fit within the upload limits (30 MB per file as a guest, 50 MB signed in). There's no cap on the number of files in a single batch — 2 files or 50 files both work."
        />
        <Faq
          q="Will the merged PDF have a watermark?"
          a="No. Every PDF that comes out of convertpdfgo is watermark-free, regardless of which tool you used."
        />
        <Faq
          q="Can I merge a password-protected PDF?"
          a={
            <>
              Unlock it first with the{" "}
              <Link href="/unlock">unlock PDF tool</Link> if you have the
              password, then drop the unlocked file into the merger.
            </>
          }
        />
        <Faq
          q="Can I merge PDFs offline?"
          a="convertpdfgo is a web app, so it needs an internet connection. If you need an offline solution, our open-source Go SDK ships as a self-contained binary you can run locally."
        />
        <Faq
          q="Does the merged PDF keep bookmarks and links?"
          a="Yes — internal links, bookmarks, and form fields are preserved per source file. Page numbers in cross-references will refer to the original page numbering, so update internal references manually if needed."
        />
        <Faq
          q="Can I merge PDFs into a specific page of another PDF?"
          a="The merge tool concatenates files in order. To insert one PDF into the middle of another, split the larger PDF first, then merge the pieces with the new file in the desired position."
        />
      </Section>

      <Section id="next-steps" h="Next steps">
        <p>
          You probably came here to do one specific thing — merge a few
          PDFs and get on with your day. Now that the file is merged,
          here are the most common follow-ups:
        </p>
        <ul>
          <li>
            <Link href="/compress">Compress the merged PDF</Link> if it&apos;s
            larger than the email or upload limit you need.
          </li>
          <li>
            <Link href="/add-page-numbers">Add page numbers</Link> if you
            need to reference pages of the combined document.
          </li>
          <li>
            <Link href="/sign">Sign the PDF</Link> with a digital
            signature before sending.
          </li>
          <li>
            <Link href="/protect">Password-protect it</Link> if the
            content is sensitive.
          </li>
          <li>
            <Link href="/chat">Chat with the PDF</Link> using AI if you
            need to find or summarise something in it.
          </li>
        </ul>
        <p>
          Or browse <Link href="/tools">all 49 tools</Link> if you have a
          different PDF task to handle.
        </p>
      </Section>

      <hr className="my-12 border-border/40" />

      <p className="text-sm text-muted-foreground">
        Was this guide useful? Share it with someone who&apos;s still
        wrestling with watermarked PDF mergers. Found a mistake?{" "}
        <Link href="/contact">Let us know</Link> — we update these
        guides whenever the underlying tools change.
      </p>
    </>
  ),
};

// ─── Tiny inline components used inside the article body ──────────────

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
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
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

function Problem({ title, text }: { title: string; text: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border bg-card p-5">
      <p className="font-bold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
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
      <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</div>
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
    { feat: "No signup for basic merge", us: true, sm: false, ilove: false },
    { feat: "Unlimited daily merges", us: true, sm: false, ilove: true },
    { feat: "Drag to reorder pages", us: true, sm: true, ilove: true },
    { feat: "Mobile friendly", us: true, sm: true, ilove: true },
    { feat: "Files auto-delete within 1 hour", us: true, sm: true, ilove: true },
    { feat: "Open source SDK", us: true, sm: false, ilove: false },
    { feat: "27-language UI", us: true, sm: false, ilove: true },
  ];
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Feature</th>
            <th className="px-4 py-3 text-center font-semibold text-primary">convertpdfgo</th>
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
  return <ExternalLink className="inline size-3 align-baseline opacity-70" />;
}
