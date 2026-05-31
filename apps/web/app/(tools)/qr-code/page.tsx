import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { QrCodeClient } from "./qr-code-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Add QR Code",
  description: "Embed a QR code anywhere on the page.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/qr-code" },
};

export default function Page() {
  const tool = getToolBySlug("qr-code");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="19">
      <QrCodeClient />
    </ToolPageShell>
  );
}
