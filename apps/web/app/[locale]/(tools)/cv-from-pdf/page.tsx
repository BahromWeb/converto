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
  title: "CV from PDF — AI rebuilds your old resume",
  description:
    "Drop your old PDF resume and we'll extract every field with AI, rebuild it in a modern ATS-friendly template, and let you keep editing.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/cv-from-pdf" },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "cv-from-pdf", locale);
}

export default async function Page(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("cv-from-pdf");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} locale={locale} index="06a" variant="AI Career">
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
