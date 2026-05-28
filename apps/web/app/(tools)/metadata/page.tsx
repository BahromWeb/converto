import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { MetadataClient } from "./metadata-client";

export const metadata: Metadata = {
  title: "Edit Metadata",
  description: "Rewrite title, author, subject, keywords, creator.",
  alternates: { canonical: "/metadata" },
};

export default function Page() {
  const tool = getToolBySlug("metadata");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="23">
      <MetadataClient />
    </ToolPageShell>
  );
}
