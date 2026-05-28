import type { Metadata } from "next";
import en from "@/lib/i18n/locales/en";
import { FaqSection } from "@/components/marketing/faq-section";
import { FaqJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "FAQ — Free PDF tools, file privacy, watermarks, languages",
  description:
    "Common questions about convertpdfgo: is it free, are files private, file size limits, supported languages, commercial use.",
  alternates: { canonical: "/faq" },
};

// Server-render the EN copy of the questions into JSON-LD so Google can
// pick up the FAQPage rich result regardless of the user's runtime locale.
// The interactive list below still renders in the visitor's chosen language.
const faqItems = [
  { q: en.faq.q1, a: en.faq.a1 },
  { q: en.faq.q2, a: en.faq.a2 },
  { q: en.faq.q3, a: en.faq.a3 },
  { q: en.faq.q4, a: en.faq.a4 },
  { q: en.faq.q5, a: en.faq.a5 },
  { q: en.faq.q6, a: en.faq.a6 },
  { q: en.faq.q7, a: en.faq.a7 },
  { q: en.faq.q8, a: en.faq.a8 },
];

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd items={faqItems} />
      <FaqSection />
    </>
  );
}
