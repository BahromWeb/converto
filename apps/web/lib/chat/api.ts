import { api, getAccessToken, uploadFile, type FileUploadResult } from "@/lib/api";
import type {
  ChatSession,
  ChatSessionDetail,
  ChatMessage,
  StreamEvent,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

// ─── Session CRUD ──────────────────────────────────────────────────────

export async function createChatSession(fileId: string): Promise<ChatSession> {
  const res = await api.post<ChatSession>("/api/chat/sessions", { file_id: fileId });
  if (res.StatusCode >= 400) {
    throw new Error(res.Description ?? "Failed to create chat session");
  }
  return res.Data;
}

export async function getChatSession(id: string): Promise<ChatSessionDetail> {
  const res = await api.get<ChatSessionDetail>(`/api/chat/sessions/${id}`);
  if (res.StatusCode >= 400) {
    throw new Error(res.Description ?? "Failed to load session");
  }
  return res.Data;
}

export async function listChatSessions(): Promise<ChatSession[]> {
  const res = await api.get<ChatSession[]>("/api/chat/sessions");
  if (res.StatusCode >= 400) return [];
  return res.Data ?? [];
}

export async function deleteChatSession(id: string): Promise<void> {
  await api.delete(`/api/chat/sessions/${id}`);
}

export async function listChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const res = await api.get<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`);
  if (res.StatusCode >= 400) return [];
  return res.Data ?? [];
}

// ─── Upload helper (re-exported for convenience) ───────────────────────

export { uploadFile };
export type { FileUploadResult };

// ─── SSE streaming send-message ────────────────────────────────────────

/**
 * Optional image attachment to send alongside a text question. The Blob
 * is read as base64 client-side and posted inline — no separate upload
 * round-trip, keeps the multimodal call path as cheap as the text-only
 * one.
 */
export interface ChatAttachment {
  blob: Blob;
  mime: string;
}

/**
 * Streams an assistant reply via Server-Sent Events. EventSource doesn't
 * support POST/auth headers so we use fetch + a manual frame parser.
 *
 * The returned Promise resolves when the stream completes (or rejects on
 * transport error). Each parsed event is delivered to onEvent as it
 * arrives — callers should update React state from there to render the
 * token-by-token "typewriter" effect.
 */
export async function streamChatMessage(
  sessionId: string,
  content: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
  attachment?: ChatAttachment,
): Promise<void> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const body: Record<string, string> = { content };
  if (attachment) {
    body.image_base64 = await blobToBase64(attachment.blob);
    body.image_mime = attachment.mime;
  }

  const res = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    let detail = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      detail = j?.Description ?? detail;
    } catch {
      /* ignore */
    }
    // Map common backend responses to friendlier copy so the toast and
    // inline error box don't say "Internal Server Error" when the API
    // told us something more useful.
    if (res.status === 429) {
      throw new Error(
        "We've hit the free AI quota for now — please wait a minute and try again. (Or sign in to use your own API key.)",
      );
    }
    if (res.status === 503) {
      throw new Error("Chat feature is temporarily unavailable. Try again in a moment.");
    }
    throw new Error(detail);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // SSE frames are separated by a blank line ("\n\n"); each frame may
  // contain `event:` and `data:` lines.
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nlIdx: number;
    while ((nlIdx = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, nlIdx);
      buffer = buffer.slice(nlIdx + 2);
      const parsed = parseFrame(frame);
      if (parsed) onEvent(parsed);
    }
  }
}

/**
 * Reads a Blob's binary content and returns the base64 string portion of
 * a FileReader data URL. We strip the "data:image/...;base64," prefix so
 * the backend doesn't have to guess where the actual data starts (it
 * still accepts the full data URL too, this is just cleaner on the wire).
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("unexpected reader result"));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(blob);
  });
}

function parseFrame(frame: string): StreamEvent | null {
  let event = "";
  let dataLines: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (!event || dataLines.length === 0) return null;
  try {
    const payload = JSON.parse(dataLines.join("\n"));
    return { type: event, ...payload } as StreamEvent;
  } catch {
    return null;
  }
}
