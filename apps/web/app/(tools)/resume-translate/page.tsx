import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";

export const metadata: Metadata = {
  title: "Translate Resume — AI translation in 20 languages",
  description:
    "Translate your CV to English, German, French, Spanish, Russian, Chinese, Arabic and more — with industry-appropriate phrasing, not literal word-for-word.",
  alternates: { canonical: "/resume-translate" },
};

export default function Page() {
  const tool = getToolBySlug("resume-translate");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06d" variant="AI Career">
      <CVRouterCard
        intent="?focus=translate"
        primaryCTA="Open CV & translate"
        secondaryCTA="Upload a CV first"
        benefits={[
          "Translate your entire CV in one click to 20 supported languages.",
          "Preserves bullet structure, job titles, and certification names.",
          "Industry-appropriate phrasing — not a literal word-by-word swap.",
          "Switch back to the original at any time — no rework.",
        ]}
        note="Languages: English, German, French, Spanish, Russian, Chinese, Arabic, Japanese, Korean, Turkish, Uzbek, Hindi, Portuguese, Italian, Indonesian, Polish, Vietnamese, Dutch, Thai, Ukrainian."
      />
    </ToolPageShell>
  );
}
