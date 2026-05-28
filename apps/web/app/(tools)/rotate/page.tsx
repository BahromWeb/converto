import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { RotateClient } from "./rotate-client";

export const metadata: Metadata = {
  title: "Rotate PDF",
  description: "Spin pages by 90, 180, or 270 degrees.",
  alternates: { canonical: "/rotate" },
};

export default function Page() {
  const tool = getToolBySlug("rotate");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="15">
      <RotateClient />
    </ToolPageShell>
  );
}
