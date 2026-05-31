import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Chat with PowerPoint",
  description:
    "Summarise decks, pull quotes from slides, search by speaker — answers cite the slide.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/chat-powerpoint" },
};

export default function ChatPowerPointPage() {
  const tool = getToolBySlug("chat-powerpoint");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="04p" variant="AI-powered">
      <ChatPageClient
        accept="application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.ppt,.pptx,.odp"
        uploadPrompt="Drop a slide deck to chat with it"
        uploadHint="PowerPoint, OpenDocument — auto-converted to PDF"
      />
    </ToolPageShell>
  );
}
