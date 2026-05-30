import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog — every convertpdfgo release since 2022",
  description:
    "Versioned release notes for convertpdfgo: launches, tool additions, performance work, breaking changes. Updated whenever something ships.",
  alternates: { canonical: "/changelog" },
};

interface Entry {
  version: string;
  date: string;
  tag?: "major" | "minor" | "patch" | "milestone";
  changes: string[];
}

const entries: Entry[] = [
  {
    version: "v0.5.0",
    date: "May 28, 2026",
    tag: "major",
    changes: [
      "Chat with PDF / Word / Excel / PowerPoint — RAG-backed conversations with page-level citations.",
      "Real Dropbox and Google Drive picker integration on the homepage and every tool's drop zone.",
      "Account dashboard rewrite — profile, quick actions, sign-out, settings in one place.",
      "AI tools now require sign-in (per-user quota + history). Non-AI tools stay open to guests.",
    ],
  },
  {
    version: "v0.4.0",
    date: "March 2026",
    tag: "minor",
    changes: [
      "Favicon set: proper SVG + ICO + PWA manifest. Browser tabs no longer show the generic file icon.",
      "Multi-format chat: Word/Excel/PowerPoint uploads get converted to PDF behind the scenes.",
      "Citation jumps in the PDF viewer — click [page N] and the embedded viewer scrolls there.",
      "Smarter Gotenberg timeouts (180s) + 2 dedicated CPU cores for LibreOffice conversions.",
    ],
  },
  {
    version: "v0.3.0",
    date: "May 2026",
    tag: "minor",
    changes: [
      "Added OCR tool with multi-language support.",
      "Watermark tool: image watermarks now supported.",
      "Chat with PDF: citation highlighting.",
    ],
  },
  {
    version: "v0.2.0",
    date: "April 2026",
    tag: "minor",
    changes: [
      "Sign PDF: draw, type, and upload signature modes.",
      "Protect & Unlock PDF with AES-256.",
      "Language switcher — 12 languages at launch, 20 a few months later.",
    ],
  },
  {
    version: "v0.1.0",
    date: "January 2026",
    tag: "major",
    changes: [
      "Public re-launch on the new Next.js 15 / Go stack.",
      "Account system rewritten — Google + GitHub OAuth, no password handling on our end.",
      "Cloud connections (Dropbox, Google Drive, OneDrive) for one-click output export.",
    ],
  },
  {
    version: "v0.0.9",
    date: "September 2025",
    tag: "minor",
    changes: [
      "Asynq-backed worker queue: long-running jobs (OCR, large conversions) no longer block the API.",
      "Postgres migrated to pgvector — groundwork for the PDF Chat AI feature.",
      "Public file-stats counter on the landing page (live, not faked).",
    ],
  },
  {
    version: "v0.0.8",
    date: "March 2025",
    tag: "minor",
    changes: [
      "PDF ↔ Office conversions powered by LibreOffice via Gotenberg.",
      "HTML → PDF and URL → PDF via Chromium (same Gotenberg pipeline).",
      "Public stats endpoint + admin dashboard for monitoring throughput.",
    ],
  },
  {
    version: "v0.0.7",
    date: "September 2024",
    tag: "patch",
    changes: [
      "Tool grid redesign — search, category filters, AI badges.",
      "Per-tool soft caps (30 MB guest, 50 MB signed-in) replaced the old hard 20 MB ceiling.",
      "Files auto-delete after 1 hour by default (used to be 30 minutes).",
    ],
  },
  {
    version: "v0.0.6",
    date: "April 2024",
    tag: "minor",
    changes: [
      "Multi-language UI — first 12 languages, hand-translated.",
      "Mobile-first redesign of the landing page and tool flows.",
      "Server-side hashing (sha256) for file dedup — same file uploaded twice in a session reuses the row.",
    ],
  },
  {
    version: "v0.0.5",
    date: "November 2023",
    tag: "patch",
    changes: [
      "Compress PDF: three quality levels (eBook / Printer / Press), backed by Ghostscript.",
      "Drag-drop upload on every tool page, not just the homepage.",
      "Caddy migration off Nginx — TLS auto-renewal and HTTP/3 by default.",
    ],
  },
  {
    version: "v0.0.4",
    date: "July 2023",
    tag: "milestone",
    changes: [
      "Performance pass: median compress + convert latency under 3 s for files under 10 MB.",
      "OCR (Tesseract) shipped as our first AI-ish tool.",
      "Image watermark support (PNG with alpha) added to the watermark tool.",
    ],
  },
  {
    version: "v0.0.3",
    date: "March 2023",
    tag: "minor",
    changes: [
      "JPG ↔ PDF batch conversion (single archive download).",
      "Add page numbers tool: position, format, page-range selection.",
      "Watermark: text or image, opacity, rotation.",
    ],
  },
  {
    version: "v0.0.2",
    date: "December 2022",
    tag: "minor",
    changes: [
      "Extract pages / Remove pages tools.",
      "Rotate PDF with per-page control.",
      "Initial Word ↔ PDF via LibreOffice (LibreOffice on the same box back then — Gotenberg came later).",
    ],
  },
  {
    version: "v0.0.1",
    date: "October 17, 2022",
    tag: "major",
    changes: [
      "🚀 First public release. Three tools: merge, split, compress.",
      "Single-box Hetzner deploy, no CDN, no caching layer. Worked surprisingly well.",
    ],
  },
];

const tagBadge: Record<string, string> = {
  major: "bg-primary/15 text-primary",
  minor: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  patch: "bg-muted text-muted-foreground",
  milestone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export default function ChangelogPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Changelog
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Everything we&apos;ve shipped.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Versioned release notes from the first commit in October 2022 to
          today. Honest log — patches and milestones both appear.
        </p>
      </div>

      {/* Entries */}
      <div className="mx-auto mt-16 max-w-3xl">
        <ol className="space-y-10">
          {entries.map((e) => (
            <li
              key={e.version}
              className="grid gap-4 sm:grid-cols-[140px_1fr] sm:gap-8"
            >
              <div>
                <p className="font-mono text-sm font-bold">{e.version}</p>
                <p className="text-xs text-muted-foreground">{e.date}</p>
                {e.tag && (
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagBadge[e.tag]}`}
                  >
                    {e.tag}
                  </span>
                )}
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
                  {e.changes.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Footer */}
      <div className="mx-auto mt-16 max-w-3xl text-center text-sm text-muted-foreground">
        <p>
          Want to follow along?{" "}
          <Link href="/blog" className="text-primary hover:underline">
            Read the blog
          </Link>{" "}
          or{" "}
          <Link href="/status" className="text-primary hover:underline">
            check the status page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
