import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { OcrStructuredClient } from "./ocr-structured-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Structured OCR",
  description: "OCR with layout info for downstream parsing.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/ocr-structured" },
};

export default function Page() {
  const tool = getToolBySlug("ocr-structured");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="36"><AuthGate>
      <OcrStructuredClient />
    </AuthGate></ToolPageShell>
  );
}
