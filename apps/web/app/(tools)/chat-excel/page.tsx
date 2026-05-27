import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { ChatPageClient } from "../chat/chat-page-client";

export const metadata: Metadata = {
  title: "Chat with Excel",
  description:
    "Query spreadsheets in plain English — totals, formulas, comparisons. Numbers backed by page citations.",
  alternates: { canonical: "/chat-excel" },
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
