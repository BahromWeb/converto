import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";

export const metadata: Metadata = {
  title: "ATS Score Check — beat the resume scanners",
  description:
    "Paste any job description and we'll score your resume 0–100 — missing keywords, format issues, content gaps, and AI-suggested fixes.",
  alternates: { canonical: "/ats-check" },
};

export default function Page() {
  const tool = getToolBySlug("ats-check");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06c" variant="AI Career">
      <CVRouterCard
        intent="?focus=ats"
        primaryCTA="Run ATS check"
        secondaryCTA="Build CV first"
        benefits={[
          "0–100 score with three sub-scores: keywords, format, content.",
          "Missing keyword list — the exact terms recruiters search for.",
          "Format warnings: tables, images, unusual headings that break ATS.",
          "AI suggestions that rewrite weak bullets to match the job.",
        ]}
        note="Need a CV first? Build or upload one, then run the check from the editor toolbar."
      />
    </ToolPageShell>
  );
}
