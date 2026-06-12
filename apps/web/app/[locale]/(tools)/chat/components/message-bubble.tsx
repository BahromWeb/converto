"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { renderWithCitations } from "./citation-badge";
import type { ChatMessage } from "@/lib/chat/types";

export function MessageBubble({
  message,
  onJumpToPage,
  streaming = false,
}: {
  message: Pick<ChatMessage, "role" | "content" | "citations" | "latency_ms" | "tokens_out"> & {
    id?: string;
  };
  onJumpToPage?: (page: number) => void;
  /** Append a blinking cursor to the bubble while the LLM is still streaming. */
  streaming?: boolean;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={`group flex gap-2 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="size-7 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 grid place-items-center">
          <Sparkles className="size-3.5 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-md bg-primary text-primary-foreground"
              : "rounded-tl-md bg-muted text-foreground"
          }`}
        >
          {renderWithCitations(message.content, onJumpToPage)}
          {streaming && (
            <span className="ml-0.5 inline-block w-0.5 h-3.5 -mb-0.5 animate-pulse bg-primary" />
          )}
        </div>

        {/* Action row — copy + stats on assistant messages only */}
        {!isUser && !streaming && message.content && (
          <div className="mt-1 flex items-center gap-2 px-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  Copy
                </>
              )}
            </button>
            {(message.latency_ms || message.tokens_out) && (
              <span className="text-[10px] text-muted-foreground">
                ·{" "}
                {message.latency_ms ? `${(message.latency_ms / 1000).toFixed(1)}s` : ""}
                {message.tokens_out ? ` · ${message.tokens_out} tokens` : ""}
              </span>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="size-7 shrink-0 rounded-full bg-primary/15 grid place-items-center text-[10px] font-bold text-primary">
          You
        </div>
      )}
    </div>
  );
}
