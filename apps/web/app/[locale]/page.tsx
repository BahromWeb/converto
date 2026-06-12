import { translations } from "@/lib/i18n/translations";
import { defaultLocale } from "@/lib/i18n/locales";
import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ToolsGrid } from "@/components/marketing/tools-grid";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqJsonLd, HomeJsonLd } from "@/components/seo/json-ld";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = (translations[locale] ?? translations[defaultLocale])!;
  // Localized FAQ, server-rendered so Google's FAQ rich-snippet treatment
  // fires in the page's language (same questions the on-page accordion shows).
  const faqItems = [
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
