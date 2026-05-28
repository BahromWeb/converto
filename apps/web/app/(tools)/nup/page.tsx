import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { NupClient } from "./nup-client";

export const metadata: Metadata = {
  title: "N-up Layout",
  description: "Fit 2, 4, 6, or 9 pages onto a single sheet.",
  alternates: { canonical: "/nup" },
};

export default function Page() {
  const tool = getToolBySlug("nup");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="20">
      <NupClient />
    </ToolPageShell>
  );
}
