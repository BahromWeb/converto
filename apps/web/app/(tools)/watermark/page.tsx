import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { WatermarkCard } from "./watermark-card";

export const metadata: Metadata = {
  title: "Watermark PDF",
  description: "Add a custom text or image watermark to any PDF page.",
  alternates: { canonical: "/watermark" },
};

export default function WatermarkPage() {
  const tool = getToolBySlug("watermark");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="12" variant="text · image">
      <WatermarkCard />
    </ToolPageShell>
  );
}
