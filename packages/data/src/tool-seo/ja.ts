import type { ToolSeoMap } from "./types";

// Japanese SEO content for tool pages. SEO-optimized phrasing (real search
// keywords) rather than literal translation. Tools without an entry fall
// back to English. Covers every live tool.
export const ja: ToolSeoMap = {
  merge: {
    metaTitle: "PDF結合 — 無料オンライン、透かしなし",
    metaDescription:
      "PDFファイルを好きな順番で無料オンライン結合。透かしなし・登録不要。スマホでもPCでも使えます。",
    h1: "PDF結合",
    description: "複数のPDFを好きな順番で結合。ドラッグ＆ドロップで完了。",
  },
  split: {
    metaTitle: "PDF分割 — ページを分ける、無料オンライン",
    metaDescription:
      "PDFをページ単位や複数の部分に分割。無料オンライン、透かしなし・登録不要。",
    h1: "PDF分割",
    description: "ページを抽出、または文書を複数に分割。",
  },
  compress: {
    metaTitle: "PDF圧縮 — ファイルサイズを縮小、無料オンライン",
    metaDescription:
      "PDFのサイズを無料オンラインで縮小、画質はそのまま。透かしなし・登録不要。高速で安全。",
    h1: "PDF圧縮",
    description: "ファイルは小さく、品質はそのまま。さらに小さくも。",
  },
  chat: {
    metaTitle: "PDFとチャット — AIに質問、無料",
    metaDescription:
      "PDFに質問し、出典付きの回答を取得。AIでPDFとチャット、無料オンライン・登録不要。",
    h1: "PDFとチャット",
    description: "質問すると、出典の引用付きで回答します。",
  },
  "chat-word": {
    metaTitle: "Wordとチャット — AIで文書に質問",
    metaDescription:
      "Word文書をアップロードして何でも質問——回答はページを参照します。無料オンライン、AI搭載。",
    h1: "Wordとチャット",
    description: "Wordをアップして何でも質問、回答がページを示します。",
  },
  "chat-excel": {
    metaTitle: "Excelとチャット — AIで表に質問",
    metaDescription:
      "Excelの表を普通の言葉で質問——数値・数式・合計。AI分析を無料オンラインで。",
    h1: "Excelとチャット",
    description: "表を普通の言葉で質問：数値・数式・合計。",
  },
  "chat-powerpoint": {
    metaTitle: "PowerPointとチャット — AIでプレゼン処理",
    metaDescription:
      "プレゼンを要約し、スライドから引用を抽出——出典付き。AIでPowerPointとチャット、無料。",
    h1: "PowerPointとチャット",
    description: "プレゼンを要約し、スライドから引用を抽出。",
  },
  "pdf-to-word": {
    metaTitle: "PDFをWordに変換 — 編集可能な.docx、無料",
    metaDescription:
      "PDFを編集可能なWord(.docx)に変換、書式はそのまま。無料オンライン、透かしなし。",
    h1: "PDFをWordに変換",
    description: "書式を保ったまま編集できる.docx。",
  },
  "word-to-pdf": {
    metaTitle: "WordをPDFに変換 — 無料オンライン変換",
    metaDescription:
      "Word文書をPDFに変換、すべてのフォントを保持。無料オンライン、透かしなし・登録不要。",
    h1: "WordをPDFに変換",
    description: "きれいな仕上がり、すべてのフォントを保持。",
  },
  "jpg-to-pdf": {
    metaTitle: "JPGをPDFに変換 — 画像をPDFへ、無料",
    metaDescription:
      "JPGの写真やスキャンを1つのPDFにまとめる。無料オンライン、透かしなし・登録不要。",
    h1: "JPGをPDFに変換",
    description: "写真やスキャンを1つのPDFにきれいにまとめます。",
  },
  sign: {
    metaTitle: "PDFに署名 — オンライン電子署名、無料",
    metaDescription:
      "PDFに署名して送り返す。オンライン電子署名——無料、透かしなし・登録不要。",
    h1: "PDFに署名",
    description: "署名を置いて送り返すだけ、完了。",
  },
  protect: {
    metaTitle: "PDFにパスワード — 無料オンラインで保護",
    metaDescription:
      "ワンクリックでPDFをパスワード保護。無料オンライン、登録不要、ファイルは安全。",
    h1: "PDFを保護",
    description: "ワンクリックでファイルをパスワードロック。",
  },
  unlock: {
    metaTitle: "PDFのパスワード解除 — 無料オンライン",
    metaDescription:
      "PDFからパスワードを解除（権限がある場合）。無料オンライン、登録不要、高速で安全。",
    h1: "PDFのパスワード解除",
    description: "パスワードを解除（権限がある場合）。",
  },
  ocr: {
    metaTitle: "PDF OCR — スキャンを検索可能に、無料",
    metaDescription:
      "スキャンしたPDFを検索・コピー可能にする。OCRを無料オンラインで、透かしなし。",
    h1: "PDF OCR",
    description: "スキャンしたPDFを検索・コピー可能にします。",
  },
  watermark: {
    metaTitle: "PDFに透かし — 無料オンラインで追加",
    metaDescription:
      "どのページにも自分の透かしを追加。無料オンライン、登録不要、速くて簡単。",
    h1: "PDFに透かし",
    description: "どのページにも自分の透かしを追加。",
  },
  removepage: {
    metaTitle: "PDFのページ削除 — 無料オンライン",
    metaDescription:
      "PDFから不要なページを削除——範囲を選んで実行。無料オンライン、透かしなし。",
    h1: "PDFのページ削除",
    description: "不要なページを削除——範囲をドラッグして実行。",
  },
  extract: {
    metaTitle: "PDFのページ抽出 — 無料オンライン",
    metaDescription:
      "欲しいページだけを別のPDFとして取り出す。無料オンライン、透かしなし・登録不要。",
    h1: "PDFのページ抽出",
    description: "欲しいページだけを別のPDFに取り出します。",
  },
  rotate: {
    metaTitle: "PDFを回転 — ページを回す、無料オンライン",
    metaDescription:
      "1ページまたは全ページを90°、180°、270°回転。PDF回転を無料オンラインで、登録不要。",
    h1: "PDFを回転",
    description: "1ページまたは全ページを90°、180°、270°回転。",
  },
  crop: {
    metaTitle: "PDFをトリミング — 余白を削除、無料オンライン",
    metaDescription:
      "余白を切り取るか、各ページの領域を絞る。PDFトリミングを無料オンラインで、透かしなし。",
    h1: "PDFをトリミング",
    description: "余白を切り取るか、領域を絞り込みます。",
  },
  "add-page-numbers": {
    metaTitle: "PDFにページ番号 — 無料オンラインで追加",
    metaDescription:
      "スタイルと位置を自在に、PDFに連番のページ番号を追加。無料オンライン、登録不要。",
    h1: "ページ番号を追加",
    description: "スタイルと位置を自在に、連番で番号付け。",
  },
  "header-footer": {
    metaTitle: "PDFにヘッダー・フッター — 無料オンライン",
    metaDescription:
      "数秒で各ページにヘッダーやフッターを追加。無料オンライン、透かしなし。",
    h1: "ヘッダー・フッターを追加",
    description: "数秒で各ページにヘッダーやフッターを追加。",
  },
  "qr-code": {
    metaTitle: "PDFにQRコード — 無料オンラインで追加",
    metaDescription:
      "ページの好きな場所にQRコードを挿入——リンク、vCardなど何でも。無料オンライン、登録不要。",
    h1: "PDFにQRコードを追加",
    description: "好きな場所にQRコード：リンク、vCardなど。",
  },
  nup: {
    metaTitle: "1枚に複数ページ(N-up) — 無料オンライン",
    metaDescription:
      "1枚に2、4、6、9ページを配置。N-upレイアウトを無料オンラインで、透かしなし。",
    h1: "N-upレイアウト",
    description: "1枚に2、4、6、9ページを配置。",
  },
  inspect: {
    metaTitle: "PDFを検査 — メタデータ表示、無料オンライン",
    metaDescription:
      "ページ数、作成者、タイトル、キーワードを即座に。PDFメタデータビューアを無料オンラインで。",
    h1: "PDFを検査",
    description: "ページ数、作成者、タイトル、キーワードを即座に。",
  },
  "detect-blank": {
    metaTitle: "PDFの空白ページ検出 — 無料オンライン",
    metaDescription:
      "印刷前に取り除けるよう、PDFのすべての空白ページを検出。無料オンライン、登録不要。",
    h1: "空白ページを検出",
    description: "すべての空白ページを見つけ、印刷前に削除。",
  },
  metadata: {
    metaTitle: "PDFメタデータ編集 — 無料オンライン",
    metaDescription:
      "タイトル、作成者、件名、キーワード、作成元を書き換え。PDFメタデータエディタを無料オンラインで。",
    h1: "PDFメタデータ編集",
    description: "タイトル、作成者、件名、キーワード、作成元を書き換え。",
  },
  "pdf-to-jpg": {
    metaTitle: "PDFをJPGに変換 — ページを画像に、無料",
    metaDescription:
      "各ページを個別のJPGに、さらに全部入りのZIPも。PDFをJPGに無料オンライン、透かしなし。",
    h1: "PDFをJPGに変換",
    description: "各ページを個別のJPGに、さらに全部入りのZIPも。",
  },
  "excel-to-pdf": {
    metaTitle: "ExcelをPDFに変換 — 無料オンライン変換",
    metaDescription:
      "ExcelブックをきれいなPDFに変換、1シート1ページ。無料オンライン、透かしなし。",
    h1: "ExcelをPDFに変換",
    description: "ブックをきれいなPDFに、1シート1ページ。",
  },
  "ppt-to-pdf": {
    metaTitle: "PowerPointをPDFに変換 — 無料オンライン",
    metaDescription:
      "スライドをPDFに変換、1スライド1ページ。PowerPointをPDFに無料オンライン、登録不要。",
    h1: "PowerPointをPDFに変換",
    description: "スライドをPDFに、1スライド1ページ。",
  },
  "pdf-to-excel": {
    metaTitle: "PDFをExcelに変換 — 表に変換、無料オンライン",
    metaDescription:
      "PDFの文字をレイアウトに沿ってExcelブックに抽出。PDFをExcelに無料オンライン、登録不要。",
    h1: "PDFをExcelに変換",
    description: "レイアウトに沿って文字をブックに抽出。",
  },
  "pdf-to-ppt": {
    metaTitle: "PDFをPowerPointに変換 — 編集可能なスライド、無料",
    metaDescription:
      "PDFを編集可能なプレゼンに変換、1ページ1スライド。無料オンライン、登録不要。",
    h1: "PDFをPowerPointに変換",
    description: "編集できるプレゼンに、1ページ1スライド。",
  },
  "html-to-pdf": {
    metaTitle: "HTMLをPDFに変換 — 無料オンライン変換",
    metaDescription:
      "HTMLを貼り付けて、ChromiumがレンダリングするきれいなPDFを取得。HTMLをPDFに無料オンライン、登録不要。",
    h1: "HTMLをPDFに変換",
    description: "HTMLを貼り付け、Chromium描画のきれいなPDFを取得。",
  },
  "pdf-to-html": {
    metaTitle: "PDFをHTMLに変換 — ブラウザ対応、無料オンライン",
    metaDescription:
      "どんなPDFからもブラウザですぐ開けるHTMLを取得。PDFをHTMLに無料オンライン、透かしなし。",
    h1: "PDFをHTMLに変換",
    description: "どんなPDFからもブラウザ対応のHTMLを取得。",
  },
  "url-to-pdf": {
    metaTitle: "URLをPDFに変換 — Webページ保存、無料オンライン",
    metaDescription:
      "公開Webページを丸ごとPDFとして保存。URLをPDFに無料オンライン、登録不要。",
    h1: "URLをPDFに変換",
    description: "公開Webページを丸ごとPDFとして保存。",
  },
  "scan-to-pdf": {
    metaTitle: "スキャンをPDFに — 書類の写真から、無料",
    metaDescription:
      "紙の書類の写真を検索可能な1つのPDFに。無料オンライン、透かしなし・登録不要。",
    h1: "スキャンをPDFに",
    description: "紙の書類の写真 → 検索できる1つのPDF。",
  },
  "ocr-extract-text": {
    metaTitle: "テキスト抽出(OCR) — スキャンから、無料オンライン",
    metaDescription:
      "スキャンしたPDFのすべての語をプレーンテキストに抽出。OCRを無料オンラインで、登録不要。",
    h1: "テキスト抽出(OCR)",
    description: "スキャンしたPDFのすべての語をプレーンテキストに。",
  },
  "image-to-text": {
    metaTitle: "画像から文字 — テキスト認識、無料オンライン",
    metaDescription:
      "どんな写真やスクリーンショットからも文字を読み取り。画像から文字(OCR)を無料オンライン、登録不要。",
    h1: "画像から文字",
    description: "どんな写真やスクリーンショットからも文字を読み取り。",
  },
  "ocr-detect-lang": {
    metaTitle: "文書の言語を判定 — 無料オンライン",
    metaDescription:
      "この文書は何語？Tesseractが教えます。文書の言語判定を無料オンライン、登録不要。",
    h1: "文書の言語を判定",
    description: "この文書は何語？Tesseractが教えます。",
  },
  "ocr-structured": {
    metaTitle: "構造化OCR — レイアウト付き、無料オンライン",
    metaDescription:
      "レイアウト情報付きOCR——見出し、段組み、表を維持。無料オンライン、登録不要。",
    h1: "構造化OCR",
    description: "レイアウト付きOCR：見出し、段組み、表を維持。",
  },
  "extract-text": {
    metaTitle: "PDFからテキスト抽出 — 無料オンライン",
    metaDescription:
      "すでにテキストレイヤーを持つPDFからプレーンテキストを抽出。無料オンライン、透かしなし。",
    h1: "PDFからテキスト抽出",
    description: "テキストレイヤーがあるPDFからプレーンテキストを抽出。",
  },
  "pptx-builder": {
    metaTitle: "AI PowerPoint作成 — テーマからスライドへ、無料",
    metaDescription:
      "テーマを入力すると、AIが本物の.pptxを設計・作成。5言語・4トーン。AIプレゼン作成を無料オンラインで。",
    h1: "AI PowerPoint作成",
    description: "テーマを入力、AIが本物の.pptxを作成。5言語・4トーン。",
  },
  "xlsx-builder": {
    metaTitle: "AI Excel作成 — 説明すればAIが構築、無料",
    metaDescription:
      "必要なことを説明すると、AIが数式とグラフ付きで表を構築。AI Excel作成を無料オンラインで。",
    h1: "AI Excel作成",
    description: "必要なことを説明、AIが数式とグラフ付きで表を構築。",
  },
};
