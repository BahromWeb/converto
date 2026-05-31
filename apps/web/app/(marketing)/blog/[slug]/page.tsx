import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ChevronRight, ArrowLeft } from "lucide-react";
import { posts, postBySlug } from "../posts";

// Static cache for one hour — blog posts are content, not data.
export const revalidate = 3600;

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords.join(", "),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://convertpdfgo.com/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author],
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.modified,
    author: { "@type": "Organization", name: "convertpdfgo", url: "https://convertpdfgo.com" },
    publisher: {
      "@type": "Organization",
      name: "convertpdfgo",
      logo: { "@type": "ImageObject", url: "https://convertpdfgo.com/icon-512.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://convertpdfgo.com/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
    inLanguage: "en",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable-faq"],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://convertpdfgo.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://convertpdfgo.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://convertpdfgo.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="container py-12 lg:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-3" />
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </nav>

        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {post.tag}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.description}
          </p>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              {post.readingMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              {post.author}
            </span>
            {post.modified !== post.date && (
              <span className="text-muted-foreground/70">
                Updated <time dateTime={post.modified}>{
                  new Date(post.modified).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                }</time>
              </span>
            )}
          </div>
        </header>

        {/* Article + TOC layout */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[1fr_220px]">
          {/* Body */}
          <div className="prose prose-zinc max-w-3xl dark:prose-invert">
            {post.body}
          </div>

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                On this page
              </p>
              <nav className="mt-3 space-y-2 text-sm">
                {post.toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="block border-l-2 border-transparent pl-3 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {t.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 rounded-2xl border bg-card p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Try the tool
                </p>
                <Link
                  href="/merge"
                  className="mt-3 block rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Merge PDFs now →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom navigation */}
        <div className="mx-auto mt-16 max-w-3xl border-t pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>
        </div>
      </article>
    </>
  );
}
