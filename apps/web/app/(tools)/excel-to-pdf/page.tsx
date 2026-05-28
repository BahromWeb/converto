import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ExcelToPdfClient } from "./excel-to-pdf-client";

export const metadata: Metadata = {
  title: "Excel to PDF",
  description: "Workbooks to clean PDFs.",
  alternates: { canonical: "/excel-to-pdf" },
};

export default function Page() {
  const tool = getToolBySlug("excel-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="25">
      <ExcelToPdfClient />
    </ToolPageShell>
  );
}
