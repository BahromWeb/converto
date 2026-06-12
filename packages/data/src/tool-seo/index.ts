import type { ToolSeoContent, ToolSeoMap } from "./types";
import { uz } from "./uz";
import { ru } from "./ru";
import { es } from "./es";

export type { ToolSeoContent, ToolSeoMap } from "./types";

/** Locale → (slug → SEO content). English is intentionally absent: tool
 *  pages keep their inline English metadata and registry name/description. */
const toolSeoByLocale: Record<string, ToolSeoMap> = {
  uz,
  ru,
  es,
};

/**
 * Localized SEO content for a tool, or `undefined` to signal "use the English
 * fallback" (the page's inline metadata / registry name + description).
 */
export function getToolContent(
  slug: string,
  locale: string,
): ToolSeoContent | undefined {
  return toolSeoByLocale[locale]?.[slug];
}
