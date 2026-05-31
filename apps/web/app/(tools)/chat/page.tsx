import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "./chat-page-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Chat with PDF",
  description:
    "Upload a PDF and ask anything — answers are grounded in the document with page citations.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/chat" },
};

export default function ChatPage() {
  const tool = getToolBySlug("chat");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="04" variant="AI-powered">
      <ChatPageClient />
    </ToolPageShell>
  );
}
