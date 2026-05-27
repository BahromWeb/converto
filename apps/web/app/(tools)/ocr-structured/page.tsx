import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { OcrStructuredClient } from "./ocr-structured-client";

export const metadata: Metadata = {
  title: "Structured OCR",
  description: "OCR with layout info for downstream parsing.",
  alternates: { canonical: "/ocr-structured" },
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
