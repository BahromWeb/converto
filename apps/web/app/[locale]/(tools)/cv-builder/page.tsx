import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localizeToolMetadata } from "@/lib/seo/tool-metadata";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { AuthGate } from "@/components/auth/auth-gate";
import { CVBuilderClient } from "./cv-builder-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

const baseMetadata: Metadata = {
  title: "AI Resume Builder",
  description:
    "Build, redesign, or talk your CV into existence. 27 languages, ATS-friendly templates, free forever for the basics.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/cv-builder" },
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  return localizeToolMetadata(baseMetadata, "cv-builder", locale);
}

export default async function CVBuilderPage(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const tool = getToolBySlug("cv-builder");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} locale={locale} index="38" variant="AI-powered">
      <AuthGate>
        <CVBuilderClient />
      </AuthGate>
    </ToolPageShell>
  );
}
