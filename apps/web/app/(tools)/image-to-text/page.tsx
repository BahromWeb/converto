import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ImageToTextClient } from "./image-to-text-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Image to Text",
  description: "Read text from any photo or screenshot.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/image-to-text" },
};

export default function Page() {
  const tool = getToolBySlug("image-to-text");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="34"><AuthGate>
      <ImageToTextClient />
    </AuthGate></ToolPageShell>
  );
}
