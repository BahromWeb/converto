import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ExtractClient } from "./extract-client";

export const metadata: Metadata = {
  title: "Extract Pages",
  description: "Keep only the pages you want, in their own PDF.",
  alternates: { canonical: "/extract" },
};

export default function Page() {
  const tool = getToolBySlug("extract");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="14">
      <ExtractClient />
    </ToolPageShell>
  );
}
