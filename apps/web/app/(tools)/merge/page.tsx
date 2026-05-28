import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { MergeCard } from "./merge-card";

export const metadata: Metadata = {
  title: "Merge PDF",
  description: "Combine PDFs in the order you want. Drag, drop, done. No watermark.",
  alternates: { canonical: "/merge" },
};

export default function MergePage() {
  const tool = getToolBySlug("merge");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="01" variant="drag-to-reorder">
      <MergeCard />
    </ToolPageShell>
  );
}
