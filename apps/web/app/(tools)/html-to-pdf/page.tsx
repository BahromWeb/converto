import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { HtmlToPdfClient } from "./html-to-pdf-client";

export const metadata: Metadata = {
  title: "HTML to PDF",
  description: "Paste HTML, get a clean PDF.",
  alternates: { canonical: "/html-to-pdf" },
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
