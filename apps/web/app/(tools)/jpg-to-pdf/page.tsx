import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { JpgToPdfCard } from "./jpg-to-pdf-card";

export const metadata: Metadata = {
  title: "JPG to PDF",
  description: "Bundle photos and scans into a single clean PDF.",
  alternates: { canonical: "/jpg-to-pdf" },
};

export default function JpgToPdfPage() {
  const tool = getToolBySlug("jpg-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="07" variant="multi-image">
      <JpgToPdfCard />
    </ToolPageShell>
  );
}
