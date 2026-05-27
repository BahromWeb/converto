"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import {
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  FileText,
  Download,
  PanelLeftClose,
  PanelLeft,
  Paperclip,
  X,
  Image as ImageIcon,
} from "lucide-react";
import {
  createChatSession,
  deleteChatSession,
  getChatSession,
  listChatMessages,
  listChatSessions,
  streamChatMessage,
  uploadFile,
} from "@/lib/chat/api";
import { chatToMarkdown, downloadMarkdown } from "@/lib/chat/export";
import type {
  ChatMessage,
  ChatSession,
  ChatSessionDetail,
} from "@/lib/chat/types";
import { SessionSidebar } from "./components/session-sidebar";
import { UploadZone } from "./components/upload-zone";
import { MessageBubble } from "./components/message-bubble";
import { PdfViewer, type PdfViewerHandle } from "./components/pdf-viewer";
import { ToastProvider, useToast } from "./components/toast";

/**
 * Outer wrapper just to mount the ToastProvider — the inner component
 * holds all the chat state. Keeps the toast hook callable from anywhere
 * in the tree without prop-drilling.
 *
 * The optional props control the upload zone — the same component
 * powers /chat (PDF), /chat-word, /chat-excel and /chat-powerpoint,
 * differing only in which file types they accept and the wording on
 * the empty-state landing card.
 */
export interface ChatPageClientProps {
  /** MIME / extension filter for the upload picker (default: PDF only). */
  accept?: string;
  /** Big heading on the empty-state upload card. */
  uploadPrompt?: string;
  /** Short hint chip under the upload card. */
  uploadHint?: string;
}

export function ChatPageClient(props: ChatPageClientProps = {}) {
  return (
    <AuthGate>
      <ToastProvider>
        <ChatPageInner {...props} />
      </ToastProvider>
    </AuthGate>
  );
}

function ChatPageInner({ accept, uploadPrompt, uploadHint }: ChatPageClientProps) {
  const toast = useToast();

  // URL is the source of truth for the active session — that way a hard
  // refresh, a browser back button, and a shared link all land the user
  // on the same conversation. We hydrate from ?session= on mount and
  // mirror state changes back into the URL via history.replaceState (no
  // new history entries — feels native when toggling between sessions).
  const initialSessionId =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("session");

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveIdRaw] = useState<string | null>(initialSessionId);
  const [detail, setDetail] = useState<ChatSessionDetail | null>(null);

  // setActiveId wraps the raw setter so every state change also rewrites
  // the query string. Use null to clear (e.g. "New chat" button).
  const setActiveId = useCallback((id: string | null) => {
    setActiveIdRaw(id);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set("session", id);
    } else {
      url.searchParams.delete("session");
    }
    window.history.replaceState({}, "", url.toString());
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPdf, setShowPdf] = useState(true);

  // Pending image attachment: kept in state until the user hits send.
  // We also stash an object-URL preview so the thumbnail can render
  // without re-reading the file on every render.
  const [attachment, setAttachment] = useState<{
    file: File;
    previewUrl: string;
  } | null>(null);
  const attachInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    return () => {
      if (attachment) URL.revokeObjectURL(attachment.previewUrl);
    };
  }, [attachment]);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PdfViewerHandle | null>(null);

  // ─── Initial sessions load ───────────────────────────────────────────
  useEffect(() => {
    listChatSessions()
      .then((s) => setSessions(s))
      .catch(() => undefined);
  }, []);

  // ─── Poll status while indexing ─────────────────────────────────────
  useEffect(() => {
    if (!activeId || detail?.status !== "indexing") return;
    const interval = setInterval(async () => {
      try {
        const d = await getChatSession(activeId);
        setDetail(d);
        setSessions((prev) =>
          prev.map((s) => (s.id === d.id ? { ...s, ...d } : s)),
        );
        if (d.status !== "indexing") {
          clearInterval(interval);
          if (d.status === "ready") toast.show("success", "PDF indexed — ready to chat");
          if (d.status === "failed") toast.show("error", "Indexing failed");
        }
      } catch {
        /* keep polling */
      }
    }, 2_000);
    return () => clearInterval(interval);
  }, [activeId, detail?.status, toast]);

  // ─── Load detail + history on session switch ────────────────────────
  useEffect(() => {
    if (!activeId) {
      setDetail(null);
      setMessages([]);
      return;
    }
    Promise.all([getChatSession(activeId), listChatMessages(activeId)])
      .then(([d, m]) => {
        setDetail(d);
        setMessages(m);
      })
      .catch(() => undefined);
  }, [activeId]);

  // ─── Auto-scroll on new tokens / messages ───────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, streamingText]);

  // ─── Upload + create session ────────────────────────────────────────
  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setUploadError(null);
      try {
        const up = await uploadFile(file);
        const sess = await createChatSession(up.id);
        setSessions((prev) => [sess, ...prev]);
        setActiveId(sess.id);
        toast.show("info", `Indexing "${file.name}"…`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        setUploadError(msg);
        toast.show("error", msg);
      } finally {
        setUploading(false);
      }
    },
    [toast],
  );

  // ─── Send message + consume SSE stream ──────────────────────────────
  const handleSend = useCallback(
    async (content: string) => {
      if (!activeId || streaming) return;
      // Allow attachment-only sends — fall back to a default prompt so
      // the backend still has text for retrieval/embedding.
      const hasText = content.trim().length > 0;
      if (!hasText && !attachment) return;
      const effectiveText = hasText ? content : "What's in this image?";

      setInput("");
      setStreamError(null);
      setStreaming(true);
      setStreamingText("");

      // Capture the attachment for this send + clear the staging UI
      // before the optimistic message renders.
      const pendingAttachment = attachment;
      setAttachment(null);

      const optimistic: ChatMessage = {
        id: `tmp-${Date.now()}`,
        session_id: activeId,
        role: "user",
        content: effectiveText,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        let assistantText = "";
        let citations: ChatMessage["citations"] = [];

        await streamChatMessage(
          activeId,
          effectiveText,
          (ev) => {
            if (ev.type === "meta") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === optimistic.id ? { ...m, id: ev.user_msg_id } : m,
                ),
              );
            } else if (ev.type === "token") {
              assistantText += ev.text;
              setStreamingText(assistantText);
            } else if (ev.type === "citations") {
              citations = ev.citations;
            } else if (ev.type === "done") {
              const finalMsg: ChatMessage = {
                id: ev.assistant_msg_id,
                session_id: activeId,
                role: "assistant",
                content: assistantText,
                citations,
                tokens_in: ev.tokens_in,
                tokens_out: ev.tokens_out,
                latency_ms: ev.latency_ms,
                created_at: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, finalMsg]);
              setStreamingText("");
            } else if (ev.type === "error") {
              setStreamError(ev.error);
              toast.show("error", ev.error);
            }
          },
          ctrl.signal,
          pendingAttachment
            ? { blob: pendingAttachment.file, mime: pendingAttachment.file.type || "image/jpeg" }
            : undefined,
        );
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        const msg = e instanceof Error ? e.message : "Stream failed";
        setStreamError(msg);
        toast.show("error", msg);
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [activeId, streaming, toast],
  );

  // ─── Delete session ─────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this chat? The PDF stays in your files.")) return;
      try {
        await deleteChatSession(id);
        setSessions((prev) => prev.filter((s) => s.id !== id));
        if (activeId === id) setActiveId(null);
        toast.show("success", "Chat deleted");
      } catch {
        toast.show("error", "Couldn't delete chat");
      }
    },
    [activeId, toast],
  );

  // ─── Citation click → PDF jump ──────────────────────────────────────
  const handleJumpToPage = useCallback(
    (page: number) => {
      if (!showPdf) setShowPdf(true);
      pdfRef.current?.jumpToPage(page);
    },
    [showPdf],
  );

  // ─── Export chat ────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    if (!detail) return;
    const md = chatToMarkdown(detail, messages);
    const stem = (detail.title || "chat").replace(/[^\w-]+/g, "_").slice(0, 40);
    downloadMarkdown(`${stem}-${detail.id.slice(0, 8)}.md`, md);
    toast.show("success", "Chat exported as Markdown");
  }, [detail, messages, toast]);

  // ─── Suggested-question click ───────────────────────────────────────
  const handleSuggestion = (q: string) => {
    setInput(q);
    void handleSend(q);
  };

  // ─── Layout classes — collapse PDF panel on small screens ───────────
  const layoutCols = useMemo(() => {
    const sidebar = sidebarOpen ? "260px" : "0px";
    if (!activeId || !detail || detail.status !== "ready" || !showPdf) {
      return `${sidebar} 1fr`;
    }
    return `${sidebar} minmax(0,1fr) minmax(0,1fr)`;
  }, [sidebarOpen, activeId, detail, showPdf]);

  return (
    <div
      className="grid h-[calc(100vh-180px)] min-h-[600px] gap-4 transition-[grid-template-columns] duration-200"
      style={{ gridTemplateColumns: layoutCols }}
    >
      {/* ── Sessions sidebar (collapsible) ── */}
      {sidebarOpen && (
        <SessionSidebar
          sessions={sessions}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={() => setActiveId(null)}
          onDelete={handleDelete}
        />
      )}

      {/* ── PDF panel (right of sidebar, shows only when session ready) ── */}
      {activeId && detail && detail.status === "ready" && showPdf && (
        <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
          <PdfViewer
            ref={pdfRef}
            fileId={detail.file_id}
            fileName={detail.title}
            pageCount={detail.page_count}
          />
        </div>
      )}

      {/* ── Chat panel (always present) ── */}
      <main className="flex flex-col overflow-hidden rounded-2xl border bg-card">
        {/* No session — upload landing */}
        {!activeId && (
          <UploadZone
            onFileSelected={handleUpload}
            busy={uploading}
            busyMessage="Preparing your document for chat…"
            accept={accept}
            prompt={uploadPrompt}
            hint={uploadHint}
          />
        )}
        {!activeId && uploadError && (
          <p className="px-8 pb-6 text-center text-sm text-destructive">
            {uploadError}
          </p>
        )}

        {/* Active session */}
        {activeId && detail && (
          <>
            <header className="flex items-center justify-between gap-2 border-b p-3">
              <div className="flex min-w-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="grid size-7 shrink-0 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                  title={sidebarOpen ? "Hide history" : "Show history"}
                >
                  {sidebarOpen ? (
                    <PanelLeftClose className="size-3.5" />
                  ) : (
                    <PanelLeft className="size-3.5" />
                  )}
                </button>
                <FileText className="size-4 shrink-0 text-primary" />
                <h2 className="truncate text-sm font-bold">
                  {detail.title || "Untitled PDF"}
                </h2>
                {detail.page_count != null && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    · {detail.page_count} pages
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    detail.status === "ready"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : detail.status === "indexing"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {detail.status}
                </span>
                {detail.status === "ready" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPdf((v) => !v)}
                      className="hidden size-7 shrink-0 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground md:grid"
                      title={showPdf ? "Hide PDF preview" : "Show PDF preview"}
                    >
                      <FileText className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleExport}
                      className="grid size-7 shrink-0 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Export chat as Markdown"
                    >
                      <Download className="size-3.5" />
                    </button>
                  </>
                )}
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {/* Indexing */}
              {detail.status === "indexing" && (
                <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Reading your PDF…</p>
                    <p className="text-xs text-muted-foreground">
                      Extracting text, chunking, and embedding. Usually 5–15 seconds.
                    </p>
                  </div>
                </div>
              )}

              {/* Failed */}
              {detail.status === "failed" && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                  <AlertCircle className="mt-0.5 size-4 text-destructive" />
                  <div>
                    <p className="font-semibold text-destructive">
                      Couldn&apos;t index this PDF
                    </p>
                    <p className="mt-1 text-muted-foreground">{detail.error}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Try a different PDF, or run OCR first if this is a scan.
                    </p>
                  </div>
                </div>
              )}

              {/* Ready, no messages yet — show summary + suggestions */}
              {detail.status === "ready" &&
                messages.length === 0 &&
                !streaming && (
                  <div className="space-y-4">
                    {detail.summary && (
                      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Sparkles className="size-4 text-primary" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                            Summary
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {detail.summary}
                        </p>
                      </div>
                    )}
                    {detail.suggested_questions &&
                      detail.suggested_questions.length > 0 && (
                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            💡 Try asking
                          </p>
                          <div className="flex flex-col gap-1.5">
                            {detail.suggested_questions.map((q, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleSuggestion(q)}
                                className="rounded-lg border bg-card px-3 py-2 text-left text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

              {/* Messages */}
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onJumpToPage={handleJumpToPage}
                />
              ))}

              {/* Streaming bubble */}
              {streaming && streamingText && (
                <MessageBubble
                  message={{ role: "assistant", content: streamingText }}
                  onJumpToPage={handleJumpToPage}
                  streaming
                />
              )}

              {/* Stream error */}
              {streamError && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <AlertCircle className="mt-0.5 size-4 text-destructive" />
                  <p className="text-destructive">{streamError}</p>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t p-3">
              {/* Staged image preview (shown above the input bar) */}
              {attachment && (
                <div className="mb-2 flex items-center gap-2 rounded-lg border bg-muted/30 p-2">
                  <img
                    src={attachment.previewUrl}
                    alt="Attachment preview"
                    className="size-12 shrink-0 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="truncate font-medium">{attachment.file.name}</p>
                    <p className="text-muted-foreground">
                      {(attachment.file.size / 1024).toFixed(0)} KB · attached to next message
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="grid size-7 shrink-0 place-items-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove attachment"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend(input);
                }}
                className="flex items-end gap-2 rounded-xl border bg-card p-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
              >
                {/* Attach image button */}
                <button
                  type="button"
                  onClick={() => attachInputRef.current?.click()}
                  disabled={detail.status !== "ready" || streaming}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
                  aria-label="Attach image"
                  title="Attach image"
                >
                  <Paperclip className="size-4" />
                </button>
                <input
                  ref={attachInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = ""; // allow re-selecting the same file
                    if (!f) return;
                    if (f.size > 10 * 1024 * 1024) {
                      toast.show("error", "Image too large — max 10 MB");
                      return;
                    }
                    setAttachment({
                      file: f,
                      previewUrl: URL.createObjectURL(f),
                    });
                  }}
                />

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend(input);
                    }
                  }}
                  placeholder={
                    detail.status === "ready"
                      ? attachment
                        ? "Add a question about the image (optional)…"
                        : "Ask anything about this PDF…"
                      : "Waiting for indexing to finish…"
                  }
                  disabled={detail.status !== "ready" || streaming}
                  rows={1}
                  className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={
                    (!input.trim() && !attachment) ||
                    detail.status !== "ready" ||
                    streaming
                  }
                  className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  aria-label="Send"
                >
                  {streaming ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </form>
              <p className="mt-2 flex items-center justify-between gap-2 px-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ImageIcon className="size-3" />
                  Gemini 2.5 Flash · text + image · answers cite the PDF
                </span>
                <span className="hidden sm:inline">
                  Enter to send · Shift+Enter for newline
                </span>
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
