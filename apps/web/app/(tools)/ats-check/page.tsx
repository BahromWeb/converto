import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ATSCheckClient } from "./ats-check-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ATS Score Check — beat the resume scanners",
  description:
    "Upload your resume, paste any job description, get a 0–100 ATS score with missing keywords, format warnings, and AI rewrite suggestions.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/ats-check" },
};

export default function Page() {
  const tool = getToolBySlug("ats-check");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06c" variant="AI Career">
      <ATSCheckClient />
    </ToolPageShell>
  );
}
