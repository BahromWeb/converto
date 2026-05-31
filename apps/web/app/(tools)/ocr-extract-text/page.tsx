import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { OcrExtractTextClient } from "./ocr-extract-text-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Extract Text (OCR)",
  description: "Pull words out of a scanned PDF.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/ocr-extract-text" },
};

export default function Page() {
  const tool = getToolBySlug("ocr-extract-text");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="33"><AuthGate>
      <OcrExtractTextClient />
    </AuthGate></ToolPageShell>
  );
}
