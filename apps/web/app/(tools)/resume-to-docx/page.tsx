import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ResumeToDocxClient } from "./resume-to-docx-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume to Word DOCX — clean rebuild, fully editable",
  description:
    "Drop your PDF resume; AI rebuilds it into a clean ATS-friendly Word document you can keep editing in Word, Google Docs, or LibreOffice.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/resume-to-docx" },
};

export default function Page() {
  const tool = getToolBySlug("resume-to-docx");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06f" variant="AI Career">
      <ResumeToDocxClient />
    </ToolPageShell>
  );
}
