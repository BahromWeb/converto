import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { UrlToPdfClient } from "./url-to-pdf-client";

export const metadata: Metadata = {
  title: "URL to PDF",
  description: "Snapshot any public page as a PDF.",
  alternates: { canonical: "/url-to-pdf" },
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
