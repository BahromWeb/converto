import en from "@/lib/i18n/locales/en";
import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ToolsGrid } from "@/components/marketing/tools-grid";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqJsonLd, HomeJsonLd } from "@/components/seo/json-ld";

// EN copy of the homepage FAQ — same questions the on-page accordion shows,
// but server-rendered so Google's FAQ rich snippet treatment fires.
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

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <FaqJsonLd items={faqItems} />
      <Hero />
      <StatsBar />
      <ToolsGrid />
      <HowItWorks />
      <FaqSection />
      <CtaSection />
    </>
  );
}
