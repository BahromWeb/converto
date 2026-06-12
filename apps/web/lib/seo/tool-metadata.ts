import type { Metadata } from "next";
import { siteConfig, getToolContent } from "@converto/data";
import { activeLocales, defaultLocale, localizePath } from "@/lib/i18n/locales";

const SITE = siteConfig.url.replace(/\/$/, "");
const abs = (path: string) => `${SITE}${path}`;

/** hreflang alternates + self canonical for a tool path across active locales. */
function buildAlternates(slug: string, locale: string): Metadata["alternates"] {
  const path = `/${slug}`;
  const languages: Record<string, string> = {};
  for (const code of activeLocales) {
    languages[code] = abs(localizePath(path, code));
  }
  languages["x-default"] = abs(localizePath(path, defaultLocale));
  return { canonical: abs(localizePath(path, locale)), languages };
}

/**
 * Wrap a tool page's inline English metadata with locale-correct hreflang +
 * canonical, overriding title/description from the localized SEO content for
 * non-default locales. English is returned essentially untouched (its inline
 * metadata is already hand-tuned); every locale gets real reciprocal hreflang,
 * replacing the old placeholder that pointed every language at the homepage.
 */
export function localizeToolMetadata(
  base: Metadata,
  slug: string,
  locale: string,
): Metadata {
  const alternates = buildAlternates(slug, locale);
  if (locale === defaultLocale) {
    return { ...base, alternates };
  }
  const c = getToolContent(slug, locale);
  if (!c) {
    // No localized copy yet — keep English text but still emit hreflang.
    return { ...base, alternates };
  }
  return {
    ...base,
    title: c.metaTitle,
    description: c.metaDescription,
    alternates,
    openGraph: base.openGraph
      ? {
          ...base.openGraph,
          title: c.metaTitle,
          description: c.metaDescription,
          url: abs(localizePath(`/${slug}`, locale)),
        }
      : undefined,
  };
}
