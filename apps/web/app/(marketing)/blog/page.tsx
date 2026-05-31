import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User, Sparkles } from "lucide-react";
import { posts } from "./posts";

// Marketing pages are mostly static — render at build time and revalidate hourly.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — convertpdfgo product updates and PDF guides",
  description:
    "Long-form guides and behind-the-scenes posts from the convertpdfgo team. Free PDF tools, the right way.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Blog
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Notes from the team.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Long-form guides, engineering deep dives, and the occasional milestone
          post. Mostly written by whoever shipped the thing.
        </p>
      </header>

      {/* Featured (animated entrance from corner) */}
      {featured && (
        <section className="mx-auto mt-16 max-w-5xl">
          <p className="mb-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Featured guide
          </p>
          <Link
            href={`/blog/${featured.slug}`}
            className="animate-fade-in-up group relative block overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:p-12"
          >
            {/* Decorative blob in the top-right corner — gives the card visual mass */}
            <div
              className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:bg-primary/30"
              aria-hidden
            />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 font-semibold text-blue-700 dark:text-blue-300">
                  {featured.tag}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="size-3.5" />
                  {new Date(featured.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5" />
                  {featured.readingMinutes} min read
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <User className="size-3.5" />
                  {featured.author}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featured.description}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform group-hover:scale-105">
                Read the guide
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Additional posts will appear here as they're written */}
      {rest.length > 0 && (
        <section className="mx-auto mt-20 max-w-5xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            More from the blog
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="animate-fade-in-up group flex flex-col gap-3 rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">
                    {p.tag}
                  </span>
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="text-lg font-bold leading-tight transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Read more
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state guidance — there's only one post so far */}
      {rest.length === 0 && (
        <section className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            More guides are on the way. In the meantime, try one of our{" "}
            <Link href="/tools" className="font-semibold text-primary hover:underline">
              49 free PDF tools
            </Link>{" "}
            or read{" "}
            <Link href="/about" className="font-semibold text-primary hover:underline">
              the project story
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  );
}
