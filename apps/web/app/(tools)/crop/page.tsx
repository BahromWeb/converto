import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CropClient } from "./crop-client";

export const metadata: Metadata = {
  title: "Crop PDF",
  description: "Trim margins or focus a region across every page.",
  alternates: { canonical: "/crop" },
};

export default function Page() {
  const tool = getToolBySlug("crop");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="16">
      <CropClient />
    </ToolPageShell>
  );
}
