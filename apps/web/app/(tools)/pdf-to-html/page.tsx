import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToHtmlClient } from "./pdf-to-html-client";

export const metadata: Metadata = {
  title: "PDF to HTML",
  description: "Browser-ready HTML out of any PDF.",
  alternates: { canonical: "/pdf-to-html" },
};

export default function Page() {
  const tool = getToolBySlug("pdf-to-html");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="30">
      <PdfToHtmlClient />
    </ToolPageShell>
  );
}
