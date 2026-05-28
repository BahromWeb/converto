import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { QrCodeClient } from "./qr-code-client";

export const metadata: Metadata = {
  title: "Add QR Code",
  description: "Embed a QR code anywhere on the page.",
  alternates: { canonical: "/qr-code" },
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
