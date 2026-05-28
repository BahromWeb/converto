import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";

export const metadata: Metadata = {
  title: "Voice Resume — speak it, AI writes it",
  description:
    "Talk through your work history in your own words. AI structures it into experience, skills, projects — ready to edit in seconds.",
  alternates: { canonical: "/cv-voice" },
};

export default function Page() {
  const tool = getToolBySlug("cv-voice");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06b" variant="AI Career">
      <CVRouterCard
        intent="?mode=voice"
        primaryCTA="Start voice mode"
        secondaryCTA="Type instead"
        benefits={[
          "Speak each section: experience, skills, education, projects.",
          "AI converts your speech into ATS-clean bullet points.",
          "Switch between voice and keyboard at any time.",
          "Works in 20 languages — speak in your native language.",
        ]}
        note="Microphone access uses your browser's built-in speech engine — Chrome / Edge / Safari."
      />
    </ToolPageShell>
  );
}
