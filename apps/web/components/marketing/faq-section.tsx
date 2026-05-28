"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@converto/ui/components/accordion";
import { AnimateIn } from "@/components/ui/animate-in";
import { useT } from "@/lib/i18n/context";

export function FaqSection() {
  const t = useT();

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
    { q: t.faq.q7, a: t.faq.a7 },
    { q: t.faq.q8, a: t.faq.a8 },
  ];

  return (
    <section id="faq" className="py-24">
      <div className="container">
        {/* Section header */}
        <AnimateIn animation="fade-up" className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">{t.faq.sectionLabel}</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t.faq.heading}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t.faq.subheading}{" "}
            <a
              href="mailto:hello@convertpdfgo.com"
              className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary"
            >
              {t.faq.emailUs}
            </a>{" "}
            {t.faq.replyTime}
          </p>
        </AnimateIn>

        {/* FAQ cards grid */}
        <div className="mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <AnimateIn key={faq.q} animation="fade-up" delay={i * 50}>
                <AccordionItem
                  value={`item-${i}`}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="group px-6 py-5 hover:no-underline [&>svg]:text-muted-foreground [&[data-state=open]>svg]:text-primary">
                    <span className="flex items-center gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-left text-base font-semibold text-foreground group-hover:text-primary md:text-[17px]">
                        {faq.q}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0">
                    <p className="pl-11 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </AnimateIn>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
