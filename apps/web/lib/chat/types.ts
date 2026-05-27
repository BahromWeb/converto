// Types mirror api/models/chat.go on the backend. Keep the field names
// in sync — the backend serialises with snake_case JSON tags so the
// frontend reads them verbatim.

export type ChatSessionStatus = "indexing" | "ready" | "failed";

export interface ChatSession {
  id: string;
  user_id?: string;
  file_id: string;
  title?: string;
  summary?: string;
  status: ChatSessionStatus;
  error?: string;
  page_count?: number;
  chunk_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionDetail extends ChatSession {
  suggested_questions?: string[];
}

export interface ChatCitation {
  page: number;
  chunk_id?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: ChatCitation[];
  tokens_in?: number;
  tokens_out?: number;
  latency_ms?: number;
  created_at: string;
}

export interface RetrievedChunk {
  id: string;
  session_id: string;
  page_number: number;
  chunk_index: number;
  content: string;
  score: number;
}

// ─── SSE stream events ──────────────────────────────────────────────────

export type StreamEvent =
  | { type: "meta"; user_msg_id: string; retrieved: RetrievedChunk[] }
  | { type: "token"; text: string }
  | { type: "citations"; citations: ChatCitation[] }
  | { type: "done"; assistant_msg_id: string; tokens_in: number; tokens_out: number; latency_ms: number }
  | { type: "error"; error: string };
