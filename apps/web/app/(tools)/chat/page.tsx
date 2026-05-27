import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "./chat-page-client";

export const metadata: Metadata = {
  title: "Chat with PDF",
  description:
    "Upload a PDF and ask anything — answers are grounded in the document with page citations.",
  alternates: { canonical: "/chat" },
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
