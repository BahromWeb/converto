import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";

export const metadata: Metadata = {
  title: "Chat with your CV — interview prep & resume Q&A",
  description:
    "Ask AI anything about your CV: practice interview answers, find gaps for a specific role, or rewrite weak bullets — all grounded in your real resume.",
  alternates: { canonical: "/chat-with-cv" },
};

export default function Page() {
  const tool = getToolBySlug("chat-with-cv");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06g" variant="AI Career">
      <CVRouterCard
        intent="?focus=chat"
        primaryCTA="Chat with my CV"
        secondaryCTA="Build CV first"
        benefits={[
          "Practice interview questions using your real experience.",
          "Get rewrite suggestions for any weak bullet point.",
          "Compare your CV against a job description in plain English.",
          "Every answer is grounded in the CV — no made-up claims.",
        ]}
        note="Need a CV first? Upload or build one, then chat with it from the editor."
      />
    </ToolPageShell>
  );
}
