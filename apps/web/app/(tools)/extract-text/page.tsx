import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ExtractTextClient } from "./extract-text-client";

export const metadata: Metadata = {
  title: "Extract Text",
  description: "Plain text out of a PDF with a text layer.",
  alternates: { canonical: "/extract-text" },
};

export default function Page() {
  const tool = getToolBySlug("extract-text");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="37">
      <ExtractTextClient />
    </ToolPageShell>
  );
}
