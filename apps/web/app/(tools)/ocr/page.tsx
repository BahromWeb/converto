import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { OcrCard } from "./ocr-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OCR PDF",
  description: "Make scanned PDFs searchable and copy-pasteable with AI OCR.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/ocr" },
};

export default function OcrPage() {
  const tool = getToolBySlug("ocr");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="11" variant="AI-powered"><AuthGate>
      <OcrCard />
    </AuthGate></ToolPageShell>
  );
}
