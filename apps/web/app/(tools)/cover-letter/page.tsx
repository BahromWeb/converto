import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CoverLetterClient } from "./cover-letter-client";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator — tailored to any job",
  description:
    "Upload your CV, paste a job description, pick a tone. AI writes a tailored 250-word cover letter using only the real experience on your resume.",
  alternates: { canonical: "/cover-letter" },
};

export default function Page() {
  const tool = getToolBySlug("cover-letter");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06e" variant="AI Career">
      <CoverLetterClient />
    </ToolPageShell>
  );
}
