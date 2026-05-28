import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToExcelClient } from "./pdf-to-excel-client";

export const metadata: Metadata = {
  title: "PDF to Excel",
  description: "Layout-aware text into a workbook.",
  alternates: { canonical: "/pdf-to-excel" },
};

export default function Page() {
  const tool = getToolBySlug("pdf-to-excel");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="27">
      <PdfToExcelClient />
    </ToolPageShell>
  );
}
