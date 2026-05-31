import type { BlogPost } from "./types";
import { mergePdfPost } from "./how-to-merge-pdf-files-online-free-no-watermark";

// Re-export the BlogPost type for downstream importers.
export type { BlogPost } from "./types";

// Newest first.
export const posts: BlogPost[] = [
  mergePdfPost,
];

export function postBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
