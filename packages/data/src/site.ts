import type { SiteConfig } from "@converto/types";

export const siteConfig: SiteConfig = {
  name: "Converto",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description: "PDF tools that don't feel like 2008. Free, fast, zero watermarks.",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/converto",
    github: "https://github.com/converto",
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
