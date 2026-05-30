import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Wrench,
  Cloud,
  Sparkles,
  Settings,
  Code2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation — How to use convertpdfgo",
  description:
    "Quickstart guides for every tool category: PDF conversion, OCR, compression, AI chat. Plus API reference and FAQs.",
  alternates: { canonical: "/docs" },
};

const sections = [
  {
    icon: FileText,
    title: "Convert PDFs",
    href: "/tools",
    body:
      "Word, Excel, PowerPoint, JPG, HTML — both directions. Drop a file on the homepage and we route you to the right converter.",
    links: [
      { label: "PDF ↔ Word", to: "/pdf-to-word" },
      { label: "Excel → PDF", to: "/excel-to-pdf" },
      { label: "JPG ↔ PDF", to: "/jpg-to-pdf" },
      { label: "HTML → PDF", to: "/html-to-pdf" },
    ],
  },
  {
    icon: Wrench,
    title: "Edit PDFs",
    href: "/tools",
    body:
      "Merge, split, rotate, crop, compress, add page numbers, watermark, protect/unlock — the everyday operations.",
    links: [
      { label: "Merge", to: "/merge" },
      { label: "Split", to: "/split" },
      { label: "Compress", to: "/compress" },
      { label: "Watermark", to: "/watermark" },
    ],
  },
  {
    icon: Sparkles,
    title: "AI features",
    href: "/chat",
    body:
      "Chat with PDF/Word/Excel/PowerPoint, OCR scanned documents, detect languages. Free with limits — sign in for the higher tier.",
    links: [
      { label: "Chat with PDF", to: "/chat" },
      { label: "Chat with Word", to: "/chat-word" },
      { label: "OCR PDF", to: "/ocr" },
      { label: "Detect Language", to: "/ocr-detect-lang" },
    ],
  },
  {
    icon: Cloud,
    title: "Cloud connections",
    href: "/account/connections",
    body:
      "Import from Dropbox or Google Drive without downloading first. Export results back to the same place with one click.",
    links: [
      { label: "Connect Dropbox", to: "/account/connections" },
      { label: "Connect Google Drive", to: "/account/connections" },
    ],
  },
  {
    icon: Settings,
    title: "Account & files",
    href: "/account",
    body:
      "Manage your uploads, see history, switch language, sign out. Guests can use most tools — sign-in unlocks AI features and bigger file caps.",
    links: [
      { label: "Account dashboard", to: "/account" },
      { label: "My files", to: "/account/files" },
      { label: "Cloud connections", to: "/account/connections" },
    ],
  },
  {
    icon: Code2,
    title: "API",
    href: "/api-docs",
    body:
      "Programmatic access to every tool. Bearer-token authenticated, JSON in/out, asynq-backed jobs for the heavy ones.",
    links: [
      { label: "API reference", to: "/api-docs" },
      { label: "OpenAPI spec", to: "/swagger" },
    ],
  },
];

const quickstart = [
  {
    step: "1",
    title: "Drop a file",
    body:
      "Drag a file onto the homepage or click Choose files. PDFs, Word, Excel, PowerPoint, images, HTML — we accept all of them.",
  },
  {
    step: "2",
    title: "Pick the tool",
    body:
      "We route based on file type — PDFs land on /tools so you pick the operation; others go straight to the matching converter.",
  },
  {
    step: "3",
    title: "Download or send to cloud",
    body:
      "Results download to your device by default. Connect Dropbox/Drive in /account/connections to save with one click.",
  },
];

export default function DocsPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Docs</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Everything works the same way.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Drop a file, pick a tool, get a result. No tutorials needed for the
          basics — these pages cover the edges, the cloud integrations, and the
          API for when you want to script it.
        </p>
      </div>

      {/* Quickstart */}
      <div className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-bold">Quickstart</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {quickstart.map((q) => (
            <div key={q.step} className="rounded-2xl border bg-card p-6">
              <div className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {q.step}
              </div>
              <h3 className="mt-4 text-base font-bold">{q.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{q.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section grid */}
      <div className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-bold">Browse the docs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="flex flex-wrap gap-2">
                  {s.links.map((l) => (
                    <Link
                      key={l.to}
                      href={l.to}
                      className="rounded-full border bg-secondary/30 px-2.5 py-1 text-xs font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href={s.href}
                  className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Browse all <ArrowRight className="size-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
        <h2 className="text-xl font-bold">Stuck on something?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The FAQ covers the most common questions. If yours isn&apos;t there, ping
          us — we&apos;re a small team and we answer.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/faq"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Read the FAQ
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            Email us
          </Link>
        </div>
      </div>
    </div>
  );
}
