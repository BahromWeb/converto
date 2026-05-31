import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ExtractClient } from "./extract-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Extract Pages",
  description: "Keep only the pages you want, in their own PDF.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/extract" },
};

export default function Page() {
  const tool = getToolBySlug("extract");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="14">
      <ExtractClient />
    </ToolPageShell>
  );
}
