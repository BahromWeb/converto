import type { BlogPost } from "./types";
import { mergePdfPost } from "./how-to-merge-pdf-files-online-free-no-watermark";
import { splitPdfPost } from "./how-to-split-pdf-files-online-free-no-watermark";
import { removePagePdfPost } from "./how-to-remove-pages-from-pdf-online-free";

// Re-export the BlogPost type for downstream importers.
export type { BlogPost } from "./types";

// Newest first.
export const posts: BlogPost[] = [
  mergePdfPost,
  splitPdfPost,
  removePagePdfPost,
];

export function postBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
