import type { BlogPost } from "./types";
import { mergePdfPost } from "./how-to-merge-pdf-files-online-free-no-watermark";
import { splitPdfPost } from "./how-to-split-pdf-files-online-free-no-watermark";
import { removePagePdfPost } from "./how-to-remove-pages-from-pdf-online-free";
import { extractPdfPost } from "./how-to-extract-pages-from-pdf-online-free";
import { pdfToWordPost } from "./how-to-convert-pdf-to-word-online-free";
import { wordToPdfPost } from "./how-to-convert-word-to-pdf-online-free";
import { jpgToPdfPost } from "./how-to-convert-jpg-to-pdf-online-free";
import { pdfToJpgPost } from "./how-to-convert-pdf-to-jpg-online-free";
import { excelToPdfPost } from "./how-to-convert-excel-to-pdf-online-free";
import { pptToPdfPost } from "./how-to-convert-powerpoint-to-pdf-online-free";
import { pdfToExcelPost } from "./how-to-convert-pdf-to-excel-online-free";
import { pdfToPptPost } from "./how-to-convert-pdf-to-powerpoint-online-free";
import { htmlToPdfPost } from "./how-to-convert-html-to-pdf-online-free";

// Re-export the BlogPost type for downstream importers.
export type { BlogPost } from "./types";

// Newest first.
export const posts: BlogPost[] = [
  mergePdfPost,
  splitPdfPost,
  removePagePdfPost,
  extractPdfPost,
  pdfToWordPost,
  wordToPdfPost,
  jpgToPdfPost,
  pdfToJpgPost,
  excelToPdfPost,
  pptToPdfPost,
  pdfToExcelPost,
  pdfToPptPost,
  htmlToPdfPost,
];

export function postBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
