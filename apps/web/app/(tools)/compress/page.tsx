import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { CompressCard } from "./compress-card";

export const metadata: Metadata = {
  title: "Compress PDF",
  description: "Smaller PDFs, same quality. Live preview of file size as you adjust.",
  alternates: { canonical: "/compress" },
};

export default function CompressPage() {
  const tool = getToolBySlug("compress");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="03" variant="live quality">
      <CompressCard />
    </ToolPageShell>
  );
}
