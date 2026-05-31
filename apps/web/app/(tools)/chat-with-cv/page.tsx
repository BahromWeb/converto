import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Chat with your CV — interview prep & resume Q&A",
  description:
    "Ask AI anything about your CV: practice interview answers, find gaps for a specific role, or rewrite weak bullets — all grounded in your real resume.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/chat-with-cv" },
};

export default function Page() {
  const tool = getToolBySlug("chat-with-cv");
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool} index="06g" variant="AI Career">
      <ChatPageClient
        accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        uploadPrompt="Drop your CV to chat with it"
        uploadHint="PDF or Word — AI keeps every answer grounded in your real resume"
      />
    </ToolPageShell>
  );
}
