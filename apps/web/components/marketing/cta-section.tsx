"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { AnimateIn } from "@/components/ui/animate-in";
import { useT } from "@/lib/i18n/context";

export function CtaSection() {
  const t = useT();

  const trustPoints = [
    t.cta.trust1,
    t.cta.trust2,
    t.cta.trust3,
    t.cta.trust4,
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_0%,_rgba(255,255,255,0.18)_0%,_transparent_100%)]"
      />
      {/* Decorative circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-white/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-white/5 blur-3xl"
      />

      <div className="container relative py-28 text-center text-primary-foreground">
        <AnimateIn animation="fade-up">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            {t.cta.badge}
          </span>

          <h2 className="mx-auto mt-8 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
            {t.cta.heading1}
            <br />
            {t.cta.heading2}
          </h2>

          <p className="mx-auto mt-6 max-w-md text-lg text-primary-foreground/85">
            {t.cta.subtitle}
          </p>
        </AnimateIn>

        <AnimateIn animation="fade-up" delay={120}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-white font-bold text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white/90 hover:shadow-xl"
              asChild
            >
              <Link href="/#hero">
                {t.cta.tryFree}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white transition-all duration-200 hover:bg-white/10 hover:text-white hover:scale-105"
              asChild
            >
              <Link href="/tools">{t.cta.browseTools}</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-primary-foreground/75">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5">
                <span className="text-white/90">✓</span>
                {point}
              </span>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
