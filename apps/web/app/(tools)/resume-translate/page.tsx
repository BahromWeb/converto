import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ResumeTranslateClient } from "./resume-translate-client";

export const metadata: Metadata = {
  title: "Translate Resume — 20 languages, ATS-clean",
  description:
    "Translate your CV to English, Russian, German, French, Spanish, Chinese, Arabic and more — AI keeps proper nouns intact and re-renders to PDF.",
  alternates: { canonical: "/resume-translate" },
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
