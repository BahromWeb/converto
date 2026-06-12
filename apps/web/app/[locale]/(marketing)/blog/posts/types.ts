import type { ReactNode } from "react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  modified: string;
  author: string;
  tag: "Launch" | "Product" | "Story" | "Guide" | "Comparison" | "Milestone";
  readingMinutes: number;
  keywords: string[];
  // Heroes / OG
  heroEmoji: string;
  // Table of contents — anchors must match h2 ids in the body
  toc: Array<{ id: string; label: string }>;
  // Renders the article body. Wrap your sections with <Section id="..."> so
  // the TOC anchors line up.
  body: ReactNode;
}

// Posts are declared in /blog/posts/index.tsx (JSX support) and re-exported
// here typed. Keep this file source-of-truth for the BlogPost shape.
