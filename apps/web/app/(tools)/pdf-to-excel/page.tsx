import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToExcelClient } from "./pdf-to-excel-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "PDF to Excel",
  description: "Layout-aware text into a workbook.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/pdf-to-excel" },
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
