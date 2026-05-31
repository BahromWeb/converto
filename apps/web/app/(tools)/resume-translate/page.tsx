import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ResumeTranslateClient } from "./resume-translate-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Translate Resume — 20 languages, ATS-clean",
  description:
    "Translate your CV to English, Russian, German, French, Spanish, Chinese, Arabic and more — AI keeps proper nouns intact and re-renders to PDF.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/resume-translate" },
};

export default function Page() {
  const tool = getToolBySlug("resume-translate");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06d" variant="AI Career">
      <ResumeTranslateClient />
    </ToolPageShell>
  );
}
