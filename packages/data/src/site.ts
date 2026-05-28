import type { SiteConfig } from "@converto/types";

export const siteConfig: SiteConfig = {
  name: "convertpdfgo",
  // Default to production so SEO tags (og:url, canonical, sitemap) ship the
  // right host even when NEXT_PUBLIC_SITE_URL isn't passed as a build arg —
  // Next.js inlines NEXT_PUBLIC_* at build time, not runtime, so the docker
  // compose `environment:` block never reaches a baked client bundle.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://convertpdfgo.com",
  description:
    "Free online PDF tools — merge, split, compress, convert (PDF↔Word/Excel/PPT/JPG), OCR, watermark, protect, unlock. No watermarks, files auto-deleted in 1 hour.",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/convertpdfgo",
    github: "https://github.com/convertpdfgo",
  },
};

export const adminUrl =
  process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";

export const mainNav = [
  { label: "Tools", href: "/#tools" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "AI Chat", href: "/chat" },
  { label: "API", href: "/api-docs" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerNav = {
  product: [
    { label: "All tools", href: "/tools" },
    { label: "Merge PDF", href: "/merge" },
    { label: "Split PDF", href: "/split" },
    { label: "Compress PDF", href: "/compress" },
    { label: "Chat with PDF", href: "/chat" },
    { label: "API", href: "/api-docs" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Press kit", href: "/press" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "GDPR", href: "/gdpr" },
  ],
} as const;
