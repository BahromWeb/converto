import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";


// Static cache for one hour — every tool page is fully derivable from
// the registry at build time. Revalidates hourly so registry updates land.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Chat with Excel",
  description:
    "Query spreadsheets in plain English — totals, formulas, comparisons. Numbers backed by page citations.",
    alternates: {
    languages: {
      "en": "https://convertpdfgo.com",
      "ru": "https://convertpdfgo.com",
      "uz": "https://convertpdfgo.com",
      "es": "https://convertpdfgo.com",
      "ar": "https://convertpdfgo.com",
      "x-default": "https://convertpdfgo.com",
    }, canonical: "/chat-excel" },
};

export default function ChatExcelPage() {
  const tool = getToolBySlug("chat-excel");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="04x" variant="AI-powered">
      <ChatPageClient
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,.xls,.xlsx,.csv,.ods"
        uploadPrompt="Drop a spreadsheet to chat with it"
        uploadHint="Excel, CSV, OpenDocument — auto-converted to PDF"
      />
    </ToolPageShell>
  );
}
