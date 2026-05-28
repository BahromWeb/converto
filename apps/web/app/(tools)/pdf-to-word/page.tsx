import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToWordCard } from "./pdf-to-word-card";

export const metadata: Metadata = {
  title: "PDF to Word",
  description: "Convert PDF to editable .docx with formatting intact.",
  alternates: { canonical: "/pdf-to-word" },
};

export default function PdfToWordPage() {
  const tool = getToolBySlug("pdf-to-word");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="05" variant="layout-aware">
      <PdfToWordCard />
    </ToolPageShell>
  );
}
