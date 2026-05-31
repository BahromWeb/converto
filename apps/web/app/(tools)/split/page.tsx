import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { SplitCard } from "./split-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Split PDF",
  description: "Extract pages or chop a doc into pieces. Visual page picker.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/split" },
};

export default function SplitPage() {
  const tool = getToolBySlug("split");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="02" variant="visual picker">
      <SplitCard />
    </ToolPageShell>
  );
}
