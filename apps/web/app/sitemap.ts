import type { MetadataRoute } from "next";
import { siteConfig, tools } from "@converto/data";
import { activeLocales, localizePath } from "@/lib/i18n/locales";

// Marketing/static slugs that ship as their own route under (marketing).
// Hand-listed because the (marketing) directory mixes real pages with
// route-group boilerplate; coupling sitemap correctness to a fs.readdir
// would create a quiet drift risk.
const marketingSlugs = [
  "about",
  "api-docs",
  "blog",
  "careers",
  "changelog",
  "contact",
  "docs",
  "faq",
  "gdpr",
  "press",
  "privacy",
  "security",
  "status",
  "terms",
  "tools",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");
  const abs = (path: string) => `${base}${path}`;

  // Every public path is emitted once per active locale, with reciprocal
  // hreflang `alternates` so Google connects the language variants.
  const altLanguages = (path: string) =>
    Object.fromEntries(activeLocales.map((code) => [code, abs(localizePath(path, code))]));

  const entries: MetadataRoute.Sitemap = [];
  const emit = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number,
  ) => {
    const languages = altLanguages(path);
    for (const code of activeLocales) {
      entries.push({
        url: abs(localizePath(path, code)),
        lastModified: now,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  };

  emit("/", "daily", 1);
  // Only live tools — coming-soon pages aren't usable yet, keep them out of
  // the index. Tools are the breadwinners → above marketing copy.
  tools
    .filter((t) => !t.comingSoon)
    .forEach((t) => emit(`/${t.slug}`, "weekly", 0.9));
  marketingSlugs.forEach((slug) => emit(`/${slug}`, "monthly", 0.5));

  return entries;
}
