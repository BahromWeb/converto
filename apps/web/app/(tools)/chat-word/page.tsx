import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Chat with Word",
  description:
    "Drop a Word document and ask anything — answers are grounded in the doc with page citations.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/chat-word" },
};

export default function ChatWordPage() {
  const tool = getToolBySlug("chat-word");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="04w" variant="AI-powered">
      <ChatPageClient
        accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx,.rtf,.odt"
        uploadPrompt="Drop a Word doc to chat with it"
        uploadHint="Word, RTF, OpenDocument — auto-converted to PDF"
      />
    </ToolPageShell>
  );
}
