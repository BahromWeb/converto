import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToPptClient } from "./pdf-to-ppt-client";

export const metadata: Metadata = {
  title: "PDF to PowerPoint",
  description: "Page-per-slide deck you can keep editing.",
  alternates: { canonical: "/pdf-to-ppt" },
};

export default function Page() {
  const tool = getToolBySlug("pdf-to-ppt");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="28">
      <PdfToPptClient />
    </ToolPageShell>
  );
}
