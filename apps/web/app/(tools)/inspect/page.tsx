import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { InspectClient } from "./inspect-client";

export const metadata: Metadata = {
  title: "Inspect PDF",
  description: "Instant page count and metadata. No polling.",
  alternates: { canonical: "/inspect" },
};

export default function Page() {
  const tool = getToolBySlug("inspect");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="21">
      <InspectClient />
    </ToolPageShell>
  );
}
