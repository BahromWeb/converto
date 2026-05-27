import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";

export const metadata: Metadata = {
  title: "Chat with PowerPoint",
  description:
    "Summarise decks, pull quotes from slides, search by speaker — answers cite the slide.",
  alternates: { canonical: "/chat-powerpoint" },
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
