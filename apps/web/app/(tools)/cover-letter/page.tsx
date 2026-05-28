import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator — tailored to any job",
  description:
    "Paste a job description and let AI write a tailored cover letter that highlights the exact experience the role asks for — using your real CV as the source.",
  alternates: { canonical: "/cover-letter" },
};

export default function Page() {
  const tool = getToolBySlug("cover-letter");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06e" variant="AI Career">
      <CVRouterCard
        intent="?focus=cover"
        primaryCTA="Generate cover letter"
        secondaryCTA="Build CV first"
        benefits={[
          "Pulls real achievements from your CV — no generic filler.",
          "Three tones: enthusiastic, formal, conversational.",
          "Matches the job description's keywords for ATS scanners.",
          "Export to PDF or DOCX in a click.",
        ]}
        note="You need a CV in your library first. Build or upload one, then come back."
      />
    </ToolPageShell>
  );
}
