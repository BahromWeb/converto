import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ImageToTextClient } from "./image-to-text-client";

export const metadata: Metadata = {
  title: "Image to Text",
  description: "Read text from any photo or screenshot.",
  alternates: { canonical: "/image-to-text" },
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
