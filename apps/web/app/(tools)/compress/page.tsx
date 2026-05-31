import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CompressCard } from "./compress-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compress PDF",
  description: "Smaller PDFs, same quality. Live preview of file size as you adjust.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/compress" },
};

export default function CompressPage() {
  const tool = getToolBySlug("compress");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="03" variant="live quality">
      <CompressCard />
    </ToolPageShell>
  );
}
