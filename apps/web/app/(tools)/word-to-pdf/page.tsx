import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { WordToPdfCard } from "./word-to-pdf-card";

export const metadata: Metadata = {
  title: "Word to PDF",
  description: "Convert Word documents to PDF. Pristine output, every font preserved.",
  alternates: { canonical: "/word-to-pdf" },
};

export default function WordToPdfPage() {
  const tool = getToolBySlug("word-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="06" variant="font-perfect">
      <WordToPdfCard />
    </ToolPageShell>
  );
}
