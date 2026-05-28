import { api } from "@/lib/api";
import type {
  CVSession,
  CVSessionDetail,
  CVSection,
  CVTemplate,
  CVImproveResponse,
  CVATSRun,
  CVParsedSection,
} from "./types";

// All `/api/cv/*` endpoints require auth except templates list — the
// existing api wrapper attaches the Bearer token from localStorage.

// ─── Sessions ────────────────────────────────────────────────────────

export async function createCVSession(payload: {
  mode: "scratch" | "import" | "voice";
  source_file_id?: string;
  template_id?: string;
  locale?: string;
  title?: string;
}): Promise<CVSession> {
  const res = await api.post<CVSession>("/api/cv/sessions", payload);
  if (res.StatusCode >= 400) throw new Error(res.Description);
  return res.Data;
}

export async function getCVSession(id: string): Promise<CVSessionDetail> {
  const res = await api.get<CVSessionDetail>(`/api/cv/sessions/${id}`);
  if (res.StatusCode >= 400) throw new Error(res.Description);
  return res.Data;
}

export async function listCVSessions(): Promise<CVSession[]> {
  const res = await api.get<CVSession[]>("/api/cv/sessions");
  if (res.StatusCode >= 400) return [];
  return res.Data ?? [];
}

export async function updateCVSession(
  id: string,
  patch: { title?: string; template_id?: string; locale?: string },
): Promise<void> {
  await api.patch(`/api/cv/sessions/${id}`, patch);
}

export async function deleteCVSession(id: string): Promise<void> {
  await api.delete(`/api/cv/sessions/${id}`);
}

// ─── Sections ────────────────────────────────────────────────────────

export async function addCVSection(
  cvID: string,
  payload: {
    section_type: string;
    sort_order?: number;
    content: Record<string, unknown>;
  },
): Promise<CVSection> {
  const res = await api.post<CVSection>(`/api/cv/sessions/${cvID}/sections`, payload);
  if (res.StatusCode >= 400) throw new Error(res.Description);
  return res.Data;
}

export async function updateCVSection(
  cvID: string,
  sectionID: string,
  content: Record<string, unknown>,
): Promise<void> {
  await api.patch(`/api/cv/sessions/${cvID}/sections/${sectionID}`, content);
}

export async function deleteCVSection(cvID: string, sectionID: string): Promise<void> {
  await api.delete(`/api/cv/sessions/${cvID}/sections/${sectionID}`);
}

export async function reorderCVSections(cvID: string, order: string[]): Promise<void> {
  await api.post(`/api/cv/sessions/${cvID}/sections/reorder`, { order });
}

// ─── AI ───────────────────────────────────────────────────────────────

export async function improveCVField(
  cvID: string,
  payload: { field_path: string; current_text: string; context?: Record<string, unknown> },
): Promise<CVImproveResponse> {
  const res = await api.post<CVImproveResponse>(
    `/api/cv/sessions/${cvID}/improve`,
    payload,
  );
  if (res.StatusCode >= 400) throw new Error(res.Description);
  return res.Data;
}

export async function parseCVVoice(
  cvID: string,
  payload: { transcript: string; section_hint?: string; locale?: string },
): Promise<{ parsed_sections: CVParsedSection[] }> {
  const res = await api.post<{ parsed_sections: CVParsedSection[] }>(
    `/api/cv/sessions/${cvID}/voice`,
    payload,
  );
  if (res.StatusCode >= 400) throw new Error(res.Description);
  return res.Data;
}

export async function translateCV(cvID: string, target_locale: string): Promise<void> {
  await api.post(`/api/cv/sessions/${cvID}/translate`, { target_locale });
}

export async function runATSCheck(
  cvID: string,
  payload: { job_title?: string; job_description: string },
): Promise<CVATSRun> {
  const res = await api.post<CVATSRun>(
    `/api/cv/sessions/${cvID}/ats-check`,
    payload,
  );
  if (res.StatusCode >= 400) throw new Error(res.Description);
  return res.Data;
}

// ─── Templates ────────────────────────────────────────────────────────

export async function listCVTemplates(): Promise<CVTemplate[]> {
  const res = await api.get<CVTemplate[]>("/api/cv/templates");
  if (res.StatusCode >= 400) return [];
  return res.Data ?? [];
}

// ─── Export ───────────────────────────────────────────────────────────

export async function exportCV(
  cvID: string,
  payload: { format: "pdf" | "docx" | "txt"; template_id?: string },
): Promise<{ cv_id: string; format: string; hint: string }> {
  const res = await api.post<{ cv_id: string; format: string; hint: string }>(
    `/api/cv/sessions/${cvID}/export`,
    payload,
  );
  if (res.StatusCode >= 400) throw new Error(res.Description);
  return res.Data;
}

// ─── Preview URL helper ──────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

export function cvPreviewURL(cvID: string): string {
  // The preview endpoint is auth-required; the iframe approach is to
  // fetch it with the Bearer header and feed the HTML into a srcDoc.
  return `${API_BASE}/api/cv/sessions/${cvID}/preview`;
}
