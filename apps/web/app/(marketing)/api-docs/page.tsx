import type { Metadata } from "next";
import Link from "next/link";
import {
  Github,
  Package,
  Code2,
  Terminal,
  FileCode,
  Shield,
  Zap,
  Copy,
  ArrowRight,
  ExternalLink,
  Container,
  Scale,
} from "lucide-react";

// Marketing pages are mostly static — render at build time and revalidate hourly
// so the next-build picks up locale + tools.length changes within an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Go SDK + REST API — convertpdfgo for developers",
  description:
    "Open-source Go SDK for PDF: compress, merge, split, rotate, watermark, protect, unlock, PDF↔Word/Excel/PowerPoint/JPG. MIT licensed. Docker support. Bearer-token REST API launching soon.",
  alternates: { canonical: "/api-docs" },
  openGraph: {
    title: "Convert PDF Go SDK — open source PDF library for developers",
    description:
      "go get github.com/infosec554/golang-pdf-skd — compress, merge, split, rotate, watermark, protect, unlock + Office conversions. MIT licensed.",
    type: "website",
  },
};

const SDK_REPO = "https://github.com/infosec554/golang-pdf-skd";
const SDK_GET = "go get github.com/infosec554/golang-pdf-skd";

const sdkFeatures = [
  { icon: Package,   label: "Compress",      hint: "tiered quality presets" },
  { icon: Code2,     label: "Merge / Split", hint: "byte-stable output" },
  { icon: FileCode,  label: "Rotate / Crop", hint: "page-precise" },
  { icon: Shield,    label: "Protect / Unlock", hint: "AES-256 + permissions" },
  { icon: Zap,       label: "Watermark",     hint: "text or image alpha" },
  { icon: Terminal,  label: "PDF ↔ Office",  hint: "Word, Excel, PowerPoint, JPG" },
];

const codeExample = `package main

import (
	"log"

	pdf "github.com/infosec554/golang-pdf-skd"
)

func main() {
	// Compress a PDF down to recommended quality.
	if err := pdf.Compress("input.pdf", "out.pdf", pdf.QualityRecommended); err != nil {
		log.Fatal(err)
	}

	// Merge several PDFs in order.
	if err := pdf.Merge([]string{"a.pdf", "b.pdf", "c.pdf"}, "merged.pdf"); err != nil {
		log.Fatal(err)
	}

	// Convert Word to PDF (uses LibreOffice under the hood).
	if err := pdf.WordToPDF("report.docx", "report.pdf"); err != nil {
		log.Fatal(err)
	}
}`;

export default function ApiDocsPage() {
  return (
    <article className="container py-16 lg:py-24">
      {/* Schema.org SoftwareSourceCode markup — helps Google associate the
          page with the GitHub repository for "golang pdf sdk" searches. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: "Convert PDF Go SDK",
            description:
              "Open-source Go library for working with PDFs: compress, merge, split, rotate, watermark, protect, unlock, PDF↔Word/Excel/PowerPoint/JPG conversion.",
            codeRepository: SDK_REPO,
            programmingLanguage: "Go",
            runtimePlatform: "Go 1.21+",
            license: "https://opensource.org/licenses/MIT",
            author: {
              "@type": "Organization",
              name: "convertpdfgo",
              url: "https://convertpdfgo.com",
            },
            sameAs: [SDK_REPO],
          }),
        }}
      />

      {/* Hero */}
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          For developers
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Open-source Go SDK
          <span className="block text-primary">for everything PDF.</span>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          The same engine that powers convertpdfgo.com, packaged as a Go library
          and a Docker image. MIT licensed. No API key. No rate limits.
          Run it yourself.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={SDK_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            <Github className="size-4" />
            View on GitHub
            <ExternalLink className="size-3 opacity-60" />
          </a>
          <a
            href={`${SDK_REPO}/blob/main/README.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <FileCode className="size-4" />
            Read the docs
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Container className="size-3.5" /> Docker image
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Scale className="size-3.5" /> MIT License
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Github className="size-3.5" /> Issues + PRs welcome
          </span>
        </div>
      </header>

      {/* Quickstart */}
      <section className="mx-auto mt-20 max-w-4xl">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Terminal className="size-3.5 text-primary" /> Quickstart
        </div>
        <h2 className="text-2xl font-bold">Install in one line</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border bg-foreground text-background">
          <div className="flex items-center justify-between border-b border-background/10 px-4 py-2.5 text-xs text-background/60">
            <span className="font-mono">go.sum</span>
            <span className="inline-flex items-center gap-1.5">
              <Copy className="size-3" /> copy
            </span>
          </div>
          <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
            <code className="font-mono">{SDK_GET}</code>
          </pre>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Three calls, three problems solved</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border bg-foreground text-background">
          <div className="flex items-center justify-between border-b border-background/10 px-4 py-2.5 text-xs text-background/60">
            <span className="font-mono">main.go</span>
            <span>Go 1.21+</span>
          </div>
          <pre className="overflow-x-auto p-5 text-xs leading-relaxed sm:text-sm">
            <code className="font-mono">{codeExample}</code>
          </pre>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Every function in the SDK has a synchronous variant for one-off jobs
          and a context-aware variant for cancellable workflows.
        </p>
      </section>

      {/* Feature grid */}
      <section className="mx-auto mt-20 max-w-5xl">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Package className="size-3.5 text-primary" /> What's inside
        </div>
        <h2 className="text-2xl font-bold">Same coverage as the web app</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The SDK exposes every operation that powers convertpdfgo.com. If a tool
          works in the browser, you can call it from Go.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sdkFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="rounded-xl border bg-card p-5">
                <Icon className="size-5 text-primary" />
                <p className="mt-3 font-bold">{f.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust block — license, contributions */}
      <section className="mx-auto mt-20 max-w-4xl">
        <div className="grid gap-4 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-6 sm:grid-cols-3">
          <div>
            <Scale className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-bold">MIT licensed</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Use it commercially. Modify it. Redistribute it. Just keep the
              license notice.
            </p>
          </div>
          <div>
            <Container className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-bold">Docker image</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Run the full toolbox in a single container — LibreOffice +
              poppler + Tesseract bundled.
            </p>
          </div>
          <div>
            <Github className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-bold">Open contributions</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Bug reports, PRs, and feature requests welcome on GitHub. We
              respond within a working day.
            </p>
          </div>
        </div>
      </section>

      {/* REST API teaser */}
      <section className="mx-auto mt-20 max-w-4xl">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Code2 className="size-3.5 text-primary" /> Hosted REST API
        </div>
        <h2 className="text-2xl font-bold">
          Prefer not to self-host?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A hosted REST API is launching soon — same endpoints as the SDK, but
          Bearer-token authenticated, with managed scaling and asynq-backed jobs
          for the heavy lifters. Drop us a line at{" "}
          <a
            href="mailto:api@convertpdfgo.com"
            className="font-semibold text-primary hover:underline"
          >
            api@convertpdfgo.com
          </a>{" "}
          to join the waitlist.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/swagger"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            OpenAPI spec preview
            <ArrowRight className="size-3.5" />
          </Link>
          <a
            href="mailto:api@convertpdfgo.com"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Join API waitlist
          </a>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto mt-20 max-w-4xl border-t pt-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          More for developers
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/docs" className="text-sm font-semibold text-primary hover:underline">
            Tool documentation →
          </Link>
          <Link href="/security" className="text-sm font-semibold text-primary hover:underline">
            Security model →
          </Link>
          <Link href="/changelog" className="text-sm font-semibold text-primary hover:underline">
            Changelog →
          </Link>
        </div>
      </section>
    </article>
  );
}
