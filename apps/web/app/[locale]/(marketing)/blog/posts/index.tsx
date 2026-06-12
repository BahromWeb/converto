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
import { pdfToHtmlPost } from "./how-to-convert-pdf-to-html-online-free";
import { urlToPdfPost } from "./how-to-convert-url-to-pdf-online-free";
import { signPdfPost } from "./how-to-sign-a-pdf-online-free";
import { protectPdfPost } from "./how-to-password-protect-a-pdf-online-free";
import { unlockPdfPost } from "./how-to-unlock-a-pdf-online-free";
import { compressPdfPost } from "./how-to-compress-a-pdf-online-free";
import { watermarkPdfPost } from "./how-to-watermark-a-pdf-online-free";
import { rotatePdfPost } from "./how-to-rotate-pdf-pages-online-free";
import { cropPdfPost } from "./how-to-crop-a-pdf-online-free";
import { addPageNumbersPost } from "./how-to-add-page-numbers-to-pdf-online-free";
import { headerFooterPdfPost } from "./how-to-add-header-footer-to-pdf-online-free";
import { qrCodePdfPost } from "./how-to-add-qr-code-to-pdf-online-free";
import { nupPdfPost } from "./how-to-make-nup-pdf-layout-online-free";
import { inspectPdfPost } from "./how-to-inspect-pdf-metadata-online-free";
import { detectBlankPdfPost } from "./how-to-detect-blank-pages-in-pdf-online-free";
import { metadataPdfPost } from "./how-to-edit-pdf-metadata-online-free";
import { extractTextPost } from "./how-to-extract-text-from-pdf-online-free";
import { chatPdfPost } from "./how-to-chat-with-pdf-online-free";
import { ocrPdfPost } from "./how-to-ocr-pdf-online-free";
import { scanToPdfPost } from "./how-to-scan-paper-to-pdf-online-free";
import { ocrExtractTextPost } from "./how-to-ocr-extract-text-from-pdf-online-free";
import { imageToTextPost } from "./how-to-extract-text-from-image-online-free";
import { ocrDetectLangPost } from "./how-to-detect-pdf-language-online-free";
import { ocrStructuredPost } from "./how-to-do-structured-ocr-on-pdf-online-free";
import { chatWordPost } from "./how-to-chat-with-word-document-online-free";
import { chatExcelPost } from "./how-to-chat-with-excel-spreadsheet-online-free";
import { chatPowerPointPost } from "./how-to-chat-with-powerpoint-online-free";
import { chatCvPost } from "./how-to-chat-with-cv-online-free";
import { pptxBuilderPost } from "./how-to-build-pptx-with-ai-online-free";
import { xlsxBuilderPost } from "./how-to-build-xlsx-with-ai-online-free";

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
  pdfToHtmlPost,
  urlToPdfPost,
  signPdfPost,
  protectPdfPost,
  unlockPdfPost,
  compressPdfPost,
  watermarkPdfPost,
  rotatePdfPost,
  cropPdfPost,
  addPageNumbersPost,
  headerFooterPdfPost,
  qrCodePdfPost,
  nupPdfPost,
  inspectPdfPost,
  detectBlankPdfPost,
  metadataPdfPost,
  extractTextPost,
  chatPdfPost,
  ocrPdfPost,
  scanToPdfPost,
  ocrExtractTextPost,
  imageToTextPost,
  ocrDetectLangPost,
  ocrStructuredPost,
  chatWordPost,
  chatExcelPost,
  chatPowerPointPost,
  chatCvPost,
  pptxBuilderPost,
  xlsxBuilderPost,
];

export function postBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
