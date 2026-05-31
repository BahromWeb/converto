import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ProtectCard } from "./protect-card";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Protect PDF",
  description: "Password-lock your PDF with AES-256 encryption.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/protect" },
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
