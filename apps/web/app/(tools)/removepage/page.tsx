import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { RemovePageClient } from "./removepage-client";

export const metadata: Metadata = {
  title: "Remove Pages",
  description: "Drop specific pages from a PDF in seconds.",
  alternates: { canonical: "/removepage" },
};

export default function Page() {
  const tool = getToolBySlug("removepage");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="13">
      <RemovePageClient />
    </ToolPageShell>
  );
}
