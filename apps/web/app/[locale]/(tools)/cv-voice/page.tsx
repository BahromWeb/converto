import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "Voice Resume — speak it, AI writes it",
  description:
    "Talk through your work history in your own words. AI structures it into experience, skills, projects — ready to edit in seconds.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/cv-voice" },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "cv-voice", locale);
}

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("cv-voice");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} locale={locale} index="06b" variant="AI Career">
      <CVRouterCard
        intent="?mode=voice"
        primaryCTA="Start voice mode"
        secondaryCTA="Type instead"
        benefits={[
          "Speak each section: experience, skills, education, projects.",
          "AI converts your speech into ATS-clean bullet points.",
          "Switch between voice and keyboard at any time.",
          "Works in 27 languages — speak in your native language.",
        ]}
        note="Microphone access uses your browser's built-in speech engine — Chrome / Edge / Safari."
      />
    </ToolPageShell>
  );
}
