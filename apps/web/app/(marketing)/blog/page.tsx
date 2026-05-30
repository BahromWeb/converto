import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — convertpdfgo product updates and PDF guides",
  description:
    "Launch notes, deep dives on PDF tooling, and behind-the-scenes posts from the convertpdfgo team. Updated regularly since 2022.",
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    slug: "pdf-chat-ai-launch",
    title: "Chat with PDF, Word, Excel, and PowerPoint",
    date: "May 28, 2026",
    author: "Zarif",
    summary:
      "We launched AI chat for documents — ground answers in the file with page-level citations. Same RAG pipeline handles PDF, Word, Excel, and PowerPoint (Office docs get converted to PDF behind the scenes).",
    tag: "Launch",
  },
  {
    slug: "cloud-imports",
    title: "Real Dropbox and Drive imports, finally",
    date: "May 24, 2026",
    author: "Engineering",
    summary:
      "The cloud buttons on the homepage used to redirect to an OAuth connect page. Now they actually pick a file. Same for every tool's dropzone — both Dropbox Chooser and Google Picker integrated.",
    tag: "Launch",
  },
  {
    slug: "twenty-languages",
    title: "20 languages, including Uzbek and Arabic",
    date: "December 12, 2025",
    author: "Zarif",
    summary:
      "Tool labels, error messages, FAQ copy — all localised based on actual traffic patterns. Started with English, ended up adding Uzbek before German because that's where the early users were.",
    tag: "Product",
  },
  {
    slug: "cloud-connections",
    title: "Save outputs straight to Dropbox / Drive / OneDrive",
    date: "September 4, 2024",
    author: "Engineering",
    summary:
      "OAuth-connected cloud storage targets. Convert a file, hit Save to Dropbox, done — no download / re-upload loop. Refresh tokens stored encrypted at rest.",
    tag: "Launch",
  },
  {
    slug: "hello-world",
    title: "Hello world — convertpdfgo, day one",
    date: "October 17, 2022",
    author: "Zarif",
    summary:
      "Why we built another PDF site. Short version: existing free tools were full of watermarks, paid ones charged $10/month for a feature that's three lines of pdfcpu. So we shipped one.",
    tag: "Story",
  },
];

const tagColor: Record<string, string> = {
  Launch: "bg-primary/10 text-primary",
  Product: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Milestone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Story: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export default function BlogPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Blog</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Notes from the team.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Launch announcements, engineering deep dives, and the occasional
          milestone post. Mostly written by whoever shipped the thing.
        </p>
      </div>

      {/* Posts */}
      <div className="mx-auto mt-16 max-w-3xl space-y-4">
        {posts.map((p) => (
          <article
            key={p.slug}
            className="group flex flex-col gap-3 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span
                className={`rounded-full px-2 py-0.5 font-semibold ${tagColor[p.tag] ?? "bg-muted"}`}
              >
                {p.tag}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {p.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {p.author}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
              {p.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Read more <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </article>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
        <h2 className="text-xl font-bold">Want updates in your inbox?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We send one short email per launch — no marketing, no tracking pixels.
          Drop your address with us via the contact form.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Get in touch <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
