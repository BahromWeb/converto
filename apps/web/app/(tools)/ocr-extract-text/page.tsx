import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { OcrExtractTextClient } from "./ocr-extract-text-client";

export const metadata: Metadata = {
  title: "Extract Text (OCR)",
  description: "Pull words out of a scanned PDF.",
  alternates: { canonical: "/ocr-extract-text" },
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
