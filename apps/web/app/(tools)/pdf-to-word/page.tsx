import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToWordCard } from "./pdf-to-word-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "PDF to Word",
  description: "Convert PDF to editable .docx with formatting intact.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/pdf-to-word" },
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
