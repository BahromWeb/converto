import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { PdfToJpgClient } from "./pdf-to-jpg-client";

export const metadata: Metadata = {
  title: "PDF to JPG",
  description: "Every page as its own JPG, packaged in a ZIP.",
  alternates: { canonical: "/pdf-to-jpg" },
};

export default function Page() {
  const tool = getToolBySlug("pdf-to-jpg");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="24">
      <PdfToJpgClient />
    </ToolPageShell>
  );
}
