import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { UrlToPdfClient } from "./url-to-pdf-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "URL to PDF",
  description: "Snapshot any public page as a PDF.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/url-to-pdf" },
};

export default function Page() {
  const tool = getToolBySlug("url-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="31">
      <UrlToPdfClient />
    </ToolPageShell>
  );
}
