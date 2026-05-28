import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { UnlockCard } from "./unlock-card";

export const metadata: Metadata = {
  title: "Unlock PDF",
  description: "Remove the password from a PDF you own. Fast and secure.",
  alternates: { canonical: "/unlock" },
};

export default function UnlockPage() {
  const tool = getToolBySlug("unlock");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="10" variant="password removal">
      <UnlockCard />
    </ToolPageShell>
  );
}
