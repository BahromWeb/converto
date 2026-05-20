"use client";

import Link from "next/link";
import { Button } from "@converto/ui/components/button";
import { UploadCloud, GitMerge, Scissors, Minimize2, FileText, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/context";

const quickTools = [
  { slug: "merge", labelKey: "Merge PDF", icon: GitMerge },
  { slug: "split", labelKey: "Split PDF", icon: Scissors },
  { slug: "compress", labelKey: "Compress", icon: Minimize2 },
  { slug: "pdf-to-word", labelKey: "PDF to Word", icon: FileText },
];

const fileTypes = ["PDF", "DOCX", "JPG", "PNG", "XLSX", "PPTX"];

export function Hero() {
  const t = useT();

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Gradient backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px]" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/80 via-rose-50/50 to-background" />
      </div>

      <div className="container relative pt-16 pb-24 lg:pt-24">
        {/* Headline — staggered CSS animations (above fold) */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex animate-fade-in items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary"
            style={{ animationDelay: "0ms" }}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {t.hero.badge}
          </span>

          <h1
            className="mt-6 animate-fade-in-up text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {t.hero.headline1}
            <br />
            <span className="text-primary">{t.hero.headline2}</span>
          </h1>

          <p
            className="mt-5 animate-fade-in-up text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            {t.hero.subtitle}{" "}
            <span className="font-semibold text-foreground">
              Zero ads, zero watermarks, zero sign-up.
            </span>
          </p>

          {/* Format badges */}
          <div
            className="mt-6 flex animate-fade-in-up flex-wrap justify-center gap-2"
            style={{ animationDelay: "220ms" }}
          >
            {fileTypes.map((type) => (
              <span
                key={type}
                className="rounded-md border border-border bg-card px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground"
              >
                {type}
              </span>
            ))}
            <span className="self-center text-xs text-muted-foreground/60">+ 30 more</span>
          </div>
        </div>

        {/* Upload zone */}
        <div
          className="mx-auto mt-10 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex flex-col items-center gap-5">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <UploadCloud className="size-8" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{t.hero.dropzone}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t.hero.dropzoneSub.split("·")[0]}
                  <span className="font-semibold text-primary underline underline-offset-4">
                    browse your computer
                  </span>{" "}
                  · {t.hero.dropzoneSub.split("·")[1]}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                <Button size="lg" className="min-w-36 shadow-sm transition-transform hover:scale-105">
                  <UploadCloud className="size-4" />
                  {t.hero.chooseFiles}
                </Button>
                <Button size="lg" variant="outline" className="transition-transform hover:scale-105">
                  Dropbox
                </Button>
                <Button size="lg" variant="outline" className="transition-transform hover:scale-105">
                  Google Drive
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            <span className="font-bold text-primary">●</span> {t.hero.security}
          </p>
        </div>

        {/* Quick-access tool chips */}
        <div
          className="mx-auto mt-8 flex max-w-xl animate-fade-in-up flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "420ms" }}
        >
          <span className="text-xs font-medium text-muted-foreground">{t.hero.orGoTo}</span>
          {quickTools.map(({ slug, labelKey, icon: Icon }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow hover:-translate-y-0.5"
            >
              <Icon className="size-3.5" />
              {labelKey}
            </Link>
          ))}
          <Link
            href="/#tools"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
          >
            All tools <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
