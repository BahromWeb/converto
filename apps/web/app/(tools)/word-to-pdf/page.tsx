import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { WordToPdfCard } from "./word-to-pdf-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Word to PDF",
  description: "Convert Word documents to PDF. Pristine output, every font preserved.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/word-to-pdf" },
};

export default function WordToPdfPage() {
  const tool = getToolBySlug("word-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="06" variant="font-perfect">
      <WordToPdfCard />
    </ToolPageShell>
  );
}
