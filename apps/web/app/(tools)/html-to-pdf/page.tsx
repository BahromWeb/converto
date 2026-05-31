import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { HtmlToPdfClient } from "./html-to-pdf-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "HTML to PDF",
  description: "Paste HTML, get a clean PDF.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/html-to-pdf" },
};

export default function Page() {
  const tool = getToolBySlug("html-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="29">
      <HtmlToPdfClient />
    </ToolPageShell>
  );
}
