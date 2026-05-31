import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { JpgToPdfCard } from "./jpg-to-pdf-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "JPG to PDF",
  description: "Bundle photos and scans into a single clean PDF.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/jpg-to-pdf" },
};

export default function JpgToPdfPage() {
  const tool = getToolBySlug("jpg-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="07" variant="multi-image">
      <JpgToPdfCard />
    </ToolPageShell>
  );
}
