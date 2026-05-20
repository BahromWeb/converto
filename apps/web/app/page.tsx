import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ToolsGrid } from "@/components/marketing/tools-grid";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ToolsGrid />
      <HowItWorks />
      <FaqSection />
      <CtaSection />
    </>
  );
}
