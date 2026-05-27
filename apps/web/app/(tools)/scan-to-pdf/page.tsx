import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ScanToPdfClient } from "./scan-to-pdf-client";

export const metadata: Metadata = {
  title: "Scan to PDF",
  description: "Photos of paper into one searchable PDF.",
  alternates: { canonical: "/scan-to-pdf" },
};

export default function Page() {
  const tool = getToolBySlug("scan-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="32"><AuthGate>
      <ScanToPdfClient />
    </AuthGate></ToolPageShell>
  );
}
