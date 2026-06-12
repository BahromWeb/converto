/**
 * Per-locale, SEO-optimized content for a single tool page. English is NOT
 * stored here — each tool page keeps its hand-crafted English metadata inline
 * and falls back to the registry `name`/`description`. Only non-default
 * locales need entries; missing fields fall back to English.
 */
export interface ToolSeoContent {
  /** <title> — keep ≤ 60 chars, lead with the localized search keyword. */
  metaTitle: string;
  /** meta description — ≤ 155 chars, localized search phrasing. */
  metaDescription: string;
  /** On-page H1 (the big heading). */
  h1: string;
  /** One-line sub-headline shown under the H1. */
  description: string;
}

/** slug → content, for one locale. */
export type ToolSeoMap = Record<string, ToolSeoContent>;
