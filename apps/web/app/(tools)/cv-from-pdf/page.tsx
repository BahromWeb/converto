import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";

export const metadata: Metadata = {
  title: "CV from PDF — AI rebuilds your old resume",
  description:
    "Drop your old PDF resume and we'll extract every field with AI, rebuild it in a modern ATS-friendly template, and let you keep editing.",
  alternates: { canonical: "/cv-from-pdf" },
};

export default function Page() {
  const tool = getToolBySlug("cv-from-pdf");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06a" variant="AI Career">
      <CVRouterCard
        intent="?mode=upload"
        primaryCTA="Upload PDF resume"
        secondaryCTA="Start blank"
        benefits={[
          "AI extracts every section: experience, skills, education, projects.",
          "Pick from 10 templates inspired by Google, Stripe, McKinsey, Pentagram.",
          "Live preview as you edit — see changes the moment you type.",
          "Export back to PDF, DOCX, or plain TXT.",
        ]}
        note="PDF, DOCX, or even a screenshot — we OCR images too."
      />
    </ToolPageShell>
  );
}
