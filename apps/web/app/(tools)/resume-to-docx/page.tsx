import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CVRouterCard } from "@/components/cv/cv-router-card";

export const metadata: Metadata = {
  title: "Resume to Word DOCX — keep editing in Microsoft Word",
  description:
    "Export your resume as an editable .docx — keeps fonts, bullets, and structure perfect for Microsoft Word, Google Docs, and Pages.",
  alternates: { canonical: "/resume-to-docx" },
};

export default function Page() {
  const tool = getToolBySlug("resume-to-docx");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06f" variant="AI Career">
      <CVRouterCard
        intent="?focus=export"
        primaryCTA="Export to DOCX"
        secondaryCTA="Build CV first"
        benefits={[
          "Fully editable .docx — opens in Word, Google Docs, LibreOffice, Pages.",
          "Bullets, headings, and dividers preserved.",
          "All 10 templates supported (including the corporate-style ones).",
          "PDF and TXT exports available from the same screen.",
        ]}
        note="Need a CV first? Build one or upload an existing PDF, then export."
      />
    </ToolPageShell>
  );
}
