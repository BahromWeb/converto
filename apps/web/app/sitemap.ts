import type { MetadataRoute } from "next";
import { siteConfig, tools } from "@converto/data";

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

  const homepage: MetadataRoute.Sitemap[number] = {
    url: `${base}/`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1,
  };

  const toolEntries: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${base}/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    // Tools are the breadwinners — keep them above marketing copy.
    priority: 0.9,
  }));

  const marketingEntries: MetadataRoute.Sitemap = marketingSlugs.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [homepage, ...toolEntries, ...marketingEntries];
}
