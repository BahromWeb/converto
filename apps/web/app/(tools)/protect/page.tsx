import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ProtectCard } from "./protect-card";

export const metadata: Metadata = {
  title: "Protect PDF",
  description: "Password-lock your PDF with AES-256 encryption.",
  alternates: { canonical: "/protect" },
};

export default function ProtectPage() {
  const tool = getToolBySlug("protect");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="09" variant="AES-256">
      <ProtectCard />
    </ToolPageShell>
  );
}
