import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { DetectBlankClient } from "./detect-blank-client";

export const metadata: Metadata = {
  title: "Detect Blank Pages",
  description: "Find every empty page so you can prune them.",
  alternates: { canonical: "/detect-blank" },
};

export default function Page() {
  const tool = getToolBySlug("detect-blank");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="22">
      <DetectBlankClient />
    </ToolPageShell>
  );
}
