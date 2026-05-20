"use client";

import { UploadCloud, SlidersHorizontal, Download } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";
import { useT } from "@/lib/i18n/context";

export function HowItWorks() {
  const t = useT();

  const steps = [
    {
      icon: UploadCloud,
      n: "01",
      title: t.howItWorks.step1Title,
      body: t.howItWorks.step1Body,
      tag: t.howItWorks.step1Tag,
    },
    {
      icon: SlidersHorizontal,
      n: "02",
      title: t.howItWorks.step2Title,
      body: t.howItWorks.step2Body,
      tag: t.howItWorks.step2Tag,
    },
    {
      icon: Download,
      n: "03",
      title: t.howItWorks.step3Title,
      body: t.howItWorks.step3Body,
      tag: t.howItWorks.step3Tag,
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <AnimateIn animation="fade-up" className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">{t.howItWorks.sectionLabel}</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t.howItWorks.heading}
          </h2>
          <p className="mt-4 text-muted-foreground">{t.howItWorks.subheading}</p>
        </AnimateIn>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connector gradient lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] top-10 hidden h-0.5 bg-gradient-to-r from-border via-primary/40 to-border md:block"
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <AnimateIn key={step.n} animation="fade-up" delay={i * 100}>
                <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                  {/* Icon circle with hover animation */}
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    <Icon className="size-7" />
                  </div>

                  <span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                    Step {step.n}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>

                  <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {step.tag}
                  </span>
                </div>
              </AnimateIn>
            );
          })}
        </div>

        <AnimateIn animation="fade-in" delay={300}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {t.howItWorks.avgTime.split(":")[0]}:{" "}
            <span className="font-semibold text-foreground">
              {t.howItWorks.avgTime.split(":")[1]}
            </span>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
