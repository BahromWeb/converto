import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PptToPdfClient } from "./ppt-to-pdf-client";

export const metadata: Metadata = {
  title: "PowerPoint to PDF",
  description: "Slides to PDF, one slide per page.",
  alternates: { canonical: "/ppt-to-pdf" },
};

export default function Page() {
  const tool = getToolBySlug("ppt-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="26">
      <PptToPdfClient />
    </ToolPageShell>
  );
}
