import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { WatermarkCard } from "./watermark-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Watermark PDF",
  description: "Add a custom text or image watermark to any PDF page.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/watermark" },
};

export default function WatermarkPage() {
  const tool = getToolBySlug("watermark");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="12" variant="text · image">
      <WatermarkCard />
    </ToolPageShell>
  );
}
