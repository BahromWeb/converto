import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { AuthGate } from "@/components/auth/auth-gate";
import { CVBuilderClient } from "./cv-builder-client";

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description:
    "Build, redesign, or talk your CV into existence. 20 languages, ATS-friendly templates, free forever for the basics.",
  alternates: { canonical: "/cv-builder" },
};

export default function CVBuilderPage() {
  const tool = getToolBySlug("cv-builder");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="38" variant="AI-powered">
      <AuthGate>
        <CVBuilderClient />
      </AuthGate>
    </ToolPageShell>
  );
}
