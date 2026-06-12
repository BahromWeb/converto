"use client";

import { Plus, FileText, Trash2 } from "lucide-react";
import type { ChatSession } from "@/lib/chat/types";

export function SessionSidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <aside className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="border-b p-3">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No chats yet. Upload a PDF to start.
          </p>
        )}

        {sessions.map((s) => {
          const active = s.id === activeId;
          return (
            <div key={s.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                className={`mb-1 w-full rounded-lg p-2.5 text-left transition-colors ${
                  active
                    ? "border border-primary/20 bg-primary/[0.08]"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText
                    className={`size-3.5 shrink-0 ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="truncate text-xs font-semibold">
                    {s.title || "Untitled PDF"}
                  </span>
                </div>
                <p className="mt-0.5 pl-5 text-[10px] capitalize text-muted-foreground">
                  {s.status === "indexing" && "Indexing…"}
                  {s.status === "ready" && relativeTime(s.updated_at)}
                  {s.status === "failed" && (
                    <span className="text-destructive">Failed</span>
                  )}
                </p>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                className="absolute right-1.5 top-1.5 hidden size-7 place-items-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover:grid"
                aria-label="Delete chat"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
