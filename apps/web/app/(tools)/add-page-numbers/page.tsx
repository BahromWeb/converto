import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { AddPageNumbersClient } from "./add-page-numbers-client";

export const metadata: Metadata = {
  title: "Add Page Numbers",
  description: "Sequential numbering with full style control.",
  alternates: { canonical: "/add-page-numbers" },
};

export default function Page() {
  const tool = getToolBySlug("add-page-numbers");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="17">
      <AddPageNumbersClient />
    </ToolPageShell>
  );
}
