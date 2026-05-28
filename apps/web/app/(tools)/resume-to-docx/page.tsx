import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ResumeToDocxClient } from "./resume-to-docx-client";

export const metadata: Metadata = {
  title: "Resume to Word DOCX — clean rebuild, fully editable",
  description:
    "Drop your PDF resume; AI rebuilds it into a clean ATS-friendly Word document you can keep editing in Word, Google Docs, or LibreOffice.",
  alternates: { canonical: "/resume-to-docx" },
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
