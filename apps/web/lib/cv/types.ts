// Mirrors api/models/cv.go on the backend. Field names are snake_case
// so the wire format matches what Gin emits directly.

export type CVMode = "scratch" | "import" | "voice";
export type CVStatus = "draft" | "parsing" | "ready" | "failed";

export interface CVSession {
  id: string;
  user_id: string;
  title: string;
  mode: CVMode;
  source_file_id?: string;
  template_id: string;
  locale: string;
  status: CVStatus;
  parse_error?: string;
  last_pdf_id?: string;
  created_at: string;
  updated_at: string;
}

// Each section's `content` shape depends on `section_type` — kept loose
// here so the editor can render any custom or future section without a
// type-level breaking change.
export interface CVSection {
  id: string;
  cv_id: string;
  section_type: string;
  sort_order: number;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CVSessionDetail extends CVSession {
  sections: CVSection[];
  ats_score?: number;
}

export interface CVTemplate {
  id: string;
  name: string;
  description?: string;
  is_ats_friendly: boolean;
  preview_url?: string;
  category?: string;
  sort_order: number;
}

export type CVImproveStyle =
  | "metric-driven"
  | "scope-focused"
  | "ownership-focused";

export interface CVSuggestion {
  text: string;
  style: CVImproveStyle | string;
}

export interface CVImproveResponse {
  suggestions: CVSuggestion[];
  tokens_used: number;
}

export interface CVATSRun {
  id: string;
  cv_id: string;
  job_title?: string;
  job_description: string;
  score: number;
  feedback: {
    keyword_score?: number;
    format_score?: number;
    content_score?: number;
    missing_keywords?: string[];
    format_issues?: string[];
    weak_bullets?: Array<{
      section_id?: string;
      item_index?: number;
      bullet_index?: number;
      text?: string;
      reason?: string;
    }>;
    suggestions?: string[];
  };
  created_at: string;
}

export interface CVParsedSection {
  section_type: string;
  content: Record<string, unknown>;
  confidence?: number;
}
