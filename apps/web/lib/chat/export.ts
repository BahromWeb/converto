import type { ChatMessage, ChatSessionDetail } from "./types";

/**
 * Renders a chat session + its messages as a Markdown document. Used by
 * the "Export chat" button — gives the user a portable record they can
 * stash in Notion/Obsidian/etc. without us having to spin up a separate
 * PDF generator.
 */
export function chatToMarkdown(
  session: ChatSessionDetail,
  messages: ChatMessage[],
): string {
  const lines: string[] = [];
  lines.push(`# ${session.title || "PDF chat"}`);
  lines.push("");
  lines.push(`*Exported from convertpdfgo.com on ${new Date().toLocaleString()}*`);
  lines.push("");

  if (session.summary) {
    lines.push("## Summary");
    lines.push("");
    lines.push(session.summary);
    lines.push("");
  }

  lines.push("## Conversation");
  lines.push("");

  for (const m of messages) {
    if (m.role === "user") {
      lines.push(`### 🧑 You`);
    } else if (m.role === "assistant") {
      lines.push(`### 🤖 AI`);
    } else {
      continue;
    }
    lines.push("");
    lines.push(m.content);
    if (m.citations && m.citations.length > 0) {
      lines.push("");
      const refs = m.citations.map((c) => `page ${c.page}`).join(", ");
      lines.push(`_Sources: ${refs}_`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Triggers a browser download of a Markdown string. Lives here so the
 * UI components don't need to know about Blob/anchor element trickery.
 */
export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
