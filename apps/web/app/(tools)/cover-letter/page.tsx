import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CoverLetterClient } from "./cover-letter-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI Cover Letter Generator — tailored to any job",
  description:
    "Upload your CV, paste a job description, pick a tone. AI writes a tailored 250-word cover letter using only the real experience on your resume.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/cover-letter" },
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
