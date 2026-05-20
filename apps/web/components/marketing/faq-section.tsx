"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@converto/ui/components/accordion";
import { AnimateIn } from "@/components/ui/animate-in";
import { useT } from "@/lib/i18n/context";

const faqs = [
  {
    q: "Is Converto really free?",
    a: "Yes. Every tool, no daily limit, no watermark. We've committed to staying free until at least 2027 — and even after that, the basic web tools stay free forever.",
  },
  {
    q: "Are my files private and secure?",
    a: "Most processing happens entirely in your browser. When server-side processing is required, files are encrypted in transit (TLS 1.3) and at rest (AES-256), and are deleted within one hour.",
  },
  {
    q: "Do you add watermarks to output files?",
    a: "No. Zero watermarks. Ever. Output files are bit-for-bit clean.",
  },
  {
    q: "What is the file size limit?",
    a: "Up to 2 GB per file. There is no daily limit on the number of files you can process.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account, no email verification, nothing. Open the page, do the job, leave.",
  },
  {
    q: "Which languages does Converto support?",
    a: "32 languages, all translated by native speakers — including Uzbek, Russian, Turkish, Arabic, Chinese, Hindi, Spanish, French, German, and more.",
  },
  {
    q: "Is there a desktop app?",
    a: "Not yet. The web app handles every file size and format we currently support. A desktop wrapper is on the roadmap for late 2026.",
  },
  {
    q: "Can I use Converto for commercial work?",
    a: "Yes. The tools and their outputs are yours — use them in commercial work, client deliverables, or internal pipelines without restriction.",
  },
];

export function FaqSection() {
  const t = useT();

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
              href="mailto:hello@converto.com"
              className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary"
            >
              {t.faq.emailUs}
            </a>{" "}
            — we reply within a day.
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
