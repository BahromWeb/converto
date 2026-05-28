import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { SplitCard } from "./split-card";

export const metadata: Metadata = {
  title: "Split PDF",
  description: "Extract pages or chop a doc into pieces. Visual page picker.",
  alternates: { canonical: "/split" },
};

export default function SplitPage() {
  const tool = getToolBySlug("split");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="02" variant="visual picker">
      <SplitCard />
    </ToolPageShell>
  );
}
