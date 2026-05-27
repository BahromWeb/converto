import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { OcrDetectLangClient } from "./ocr-detect-lang-client";

export const metadata: Metadata = {
  title: "Detect Language",
  description: "What language is this document in?",
  alternates: { canonical: "/ocr-detect-lang" },
};

export default function Page() {
  const tool = getToolBySlug("ocr-detect-lang");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="35"><AuthGate>
      <OcrDetectLangClient />
    </AuthGate></ToolPageShell>
  );
}
