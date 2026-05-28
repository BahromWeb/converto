import type { MetadataRoute } from "next";
import { siteConfig } from "@converto/data";

// Next.js convention: this becomes /robots.txt at build time. We disallow
// account-only and admin-only paths so they don't get indexed (their
// content is per-user / requires auth and would surface as noise in SERPs).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/admin/", "/api/", "/auth/", "/_next/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
