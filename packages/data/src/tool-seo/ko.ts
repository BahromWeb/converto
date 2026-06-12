import type { ToolSeoMap } from "./types";

// Korean SEO content for tool pages. SEO-optimized phrasing (real search
// keywords) rather than literal translation. Tools without an entry fall
// back to English. Covers every live tool.
export const ko: ToolSeoMap = {
  merge: {
    metaTitle: "PDF 합치기 — 무료 온라인, 워터마크 없음",
    metaDescription:
      "PDF 파일을 원하는 순서로 무료 온라인 합치기. 워터마크 없음, 가입 불필요. 모바일과 PC 모두 지원.",
    h1: "PDF 합치기",
    description: "여러 PDF를 원하는 순서로 합치세요. 끌어다 놓으면 끝.",
  },
  split: {
    metaTitle: "PDF 분할 — 페이지 나누기, 무료 온라인",
    metaDescription:
      "PDF를 개별 페이지나 여러 부분으로 분할하세요. 무료 온라인, 워터마크 없음, 가입 불필요.",
    h1: "PDF 분할",
    description: "페이지를 추출하거나 문서를 여러 부분으로 나누세요.",
  },
  compress: {
    metaTitle: "PDF 압축 — 파일 크기 줄이기, 무료 온라인",
    metaDescription:
      "PDF 크기를 무료 온라인으로 줄이고 품질은 그대로. 워터마크 없음, 가입 불필요. 빠르고 안전합니다.",
    h1: "PDF 압축",
    description: "파일은 더 작게, 품질은 그대로. 아니면 더 작게.",
  },
  chat: {
    metaTitle: "PDF와 대화 — AI에게 질문, 무료",
    metaDescription:
      "PDF에 질문하고 출처가 포함된 답변을 받으세요. AI로 PDF와 대화, 무료 온라인이며 가입 불필요.",
    h1: "PDF와 대화",
    description: "질문하면 출처 인용과 함께 답변해 드립니다.",
  },
  "chat-word": {
    metaTitle: "Word와 대화 — AI로 문서에 질문",
    metaDescription:
      "Word 문서를 올리고 무엇이든 물어보세요 — 답변이 페이지를 인용합니다. 무료 온라인, AI 기반.",
    h1: "Word와 대화",
    description: "Word를 올리고 무엇이든 질문하면 답변이 페이지를 알려줍니다.",
  },
  "chat-excel": {
    metaTitle: "Excel과 대화 — AI로 시트에 질문",
    metaDescription:
      "Excel 시트를 쉬운 말로 질의하세요 — 숫자, 수식, 합계. AI 분석을 무료 온라인으로.",
    h1: "Excel과 대화",
    description: "시트를 쉬운 말로 질의: 숫자, 수식, 합계.",
  },
  "chat-powerpoint": {
    metaTitle: "PowerPoint와 대화 — AI로 발표자료 처리",
    metaDescription:
      "발표자료를 요약하고 슬라이드에서 인용을 추출 — 출처 포함. AI로 PowerPoint와 대화, 무료.",
    h1: "PowerPoint와 대화",
    description: "발표자료를 요약하고 슬라이드에서 인용을 추출하세요.",
  },
  "pdf-to-word": {
    metaTitle: "PDF를 Word로 — 편집 가능한 .docx, 무료",
    metaDescription:
      "PDF를 서식 그대로 편집 가능한 Word(.docx)로 변환. 무료 온라인, 워터마크 없음.",
    h1: "PDF를 Word로",
    description: "서식을 유지한 편집 가능한 .docx.",
  },
  "word-to-pdf": {
    metaTitle: "Word를 PDF로 — 무료 온라인 변환기",
    metaDescription:
      "Word 문서를 모든 글꼴을 유지하며 PDF로 변환. 무료 온라인, 워터마크 없음, 가입 불필요.",
    h1: "Word를 PDF로",
    description: "깔끔한 결과, 모든 글꼴 유지.",
  },
  "jpg-to-pdf": {
    metaTitle: "JPG를 PDF로 — 이미지를 PDF로, 무료",
    metaDescription:
      "JPG 사진과 스캔본을 하나의 PDF로 묶으세요. 무료 온라인, 워터마크 없음, 가입 불필요.",
    h1: "JPG를 PDF로",
    description: "사진과 스캔본을 하나의 깔끔한 PDF로 묶습니다.",
  },
  sign: {
    metaTitle: "PDF 서명 — 온라인 전자 서명, 무료",
    metaDescription:
      "PDF에 서명을 추가하고 돌려보내세요. 온라인 전자 서명 — 무료, 워터마크 없음, 가입 불필요.",
    h1: "PDF 서명",
    description: "서명을 넣고 돌려보내면 끝.",
  },
  protect: {
    metaTitle: "PDF 비밀번호 설정 — 무료 온라인 보호",
    metaDescription:
      "클릭 한 번으로 PDF를 비밀번호로 보호하세요. 무료 온라인, 가입 불필요, 파일은 안전합니다.",
    h1: "PDF 보호",
    description: "클릭 한 번으로 파일을 비밀번호로 잠그세요.",
  },
  unlock: {
    metaTitle: "PDF 비밀번호 해제 — 무료 온라인",
    metaDescription:
      "PDF에서 비밀번호를 제거하세요(권한이 있는 경우). 무료 온라인, 가입 불필요, 빠르고 안전.",
    h1: "PDF 비밀번호 해제",
    description: "비밀번호를 제거하세요(권한이 있는 경우).",
  },
  ocr: {
    metaTitle: "PDF OCR — 스캔을 검색 가능하게, 무료",
    metaDescription:
      "스캔한 PDF를 검색하고 복사할 수 있게 만드세요. OCR 무료 온라인, 워터마크 없음.",
    h1: "PDF OCR",
    description: "스캔한 PDF를 검색하고 복사할 수 있게 만드세요.",
  },
  watermark: {
    metaTitle: "PDF 워터마크 추가 — 무료 온라인",
    metaDescription:
      "어떤 페이지에도 나만의 워터마크를 추가하세요. 무료 온라인, 가입 불필요, 빠르고 간단.",
    h1: "PDF 워터마크 추가",
    description: "어떤 페이지에도 나만의 워터마크를 추가하세요.",
  },
  removepage: {
    metaTitle: "PDF 페이지 삭제 — 무료 온라인",
    metaDescription:
      "PDF에서 원하지 않는 페이지를 삭제 — 범위를 선택하면 끝. 무료 온라인, 워터마크 없음.",
    h1: "PDF 페이지 삭제",
    description: "원치 않는 페이지를 삭제 — 범위를 끌어 선택하면 끝.",
  },
  extract: {
    metaTitle: "PDF 페이지 추출 — 무료 온라인",
    metaDescription:
      "원하는 페이지만 별도의 PDF로 보관하세요. 무료 온라인, 워터마크 없음, 가입 불필요.",
    h1: "PDF 페이지 추출",
    description: "원하는 페이지만 별도의 PDF로 보관하세요.",
  },
  rotate: {
    metaTitle: "PDF 회전 — 페이지 돌리기, 무료 온라인",
    metaDescription:
      "한 페이지 또는 모든 페이지를 90°, 180°, 270° 회전. PDF 회전 무료 온라인, 가입 불필요.",
    h1: "PDF 회전",
    description: "한 페이지 또는 모든 페이지를 90°, 180°, 270° 회전.",
  },
  crop: {
    metaTitle: "PDF 자르기 — 여백 제거, 무료 온라인",
    metaDescription:
      "여백을 잘라내거나 각 페이지의 영역에 집중하세요. PDF 자르기 무료 온라인, 워터마크 없음.",
    h1: "PDF 자르기",
    description: "여백을 잘라내거나 원하는 영역에 집중하세요.",
  },
  "add-page-numbers": {
    metaTitle: "PDF 페이지 번호 추가 — 무료 온라인",
    metaDescription:
      "스타일과 위치를 완벽히 제어하며 PDF에 연속 페이지 번호를 추가. 무료 온라인, 가입 불필요.",
    h1: "페이지 번호 추가",
    description: "스타일과 위치를 완벽히 제어하는 연속 번호 매기기.",
  },
  "header-footer": {
    metaTitle: "PDF 머리글·바닥글 추가 — 무료 온라인",
    metaDescription:
      "몇 초 만에 모든 페이지에 머리글이나 바닥글을 추가. 무료 온라인, 워터마크 없음.",
    h1: "머리글·바닥글 추가",
    description: "몇 초 만에 모든 페이지에 머리글이나 바닥글을 추가.",
  },
  "qr-code": {
    metaTitle: "PDF에 QR 코드 추가 — 무료 온라인",
    metaDescription:
      "페이지 어디에나 QR 코드를 삽입 — 링크, vCard 등 무엇이든. 무료 온라인, 가입 불필요.",
    h1: "PDF에 QR 코드 추가",
    description: "어디에나 QR 코드: 링크, vCard 등.",
  },
  nup: {
    metaTitle: "한 장에 여러 페이지(N-up) — 무료 온라인",
    metaDescription:
      "한 장에 2, 4, 6, 9페이지를 배치하세요. N-up 레이아웃 무료 온라인, 워터마크 없음.",
    h1: "N-up 레이아웃",
    description: "한 장에 2, 4, 6, 9페이지를 배치하세요.",
  },
  inspect: {
    metaTitle: "PDF 검사 — 메타데이터 보기, 무료 온라인",
    metaDescription:
      "페이지 수, 작성자, 제목, 키워드를 즉시 확인. PDF 메타데이터 뷰어 무료 온라인.",
    h1: "PDF 검사",
    description: "페이지 수, 작성자, 제목, 키워드를 즉시 확인.",
  },
  "detect-blank": {
    metaTitle: "PDF 빈 페이지 감지 — 무료 온라인",
    metaDescription:
      "인쇄 전에 제거할 수 있도록 PDF의 모든 빈 페이지를 찾으세요. 무료 온라인, 가입 불필요.",
    h1: "빈 페이지 감지",
    description: "모든 빈 페이지를 찾아 인쇄 전에 제거하세요.",
  },
  metadata: {
    metaTitle: "PDF 메타데이터 편집 — 무료 온라인",
    metaDescription:
      "제목, 작성자, 주제, 키워드, 생성자를 다시 쓰세요. PDF 메타데이터 편집기 무료 온라인.",
    h1: "PDF 메타데이터 편집",
    description: "제목, 작성자, 주제, 키워드, 생성자를 다시 쓰세요.",
  },
  "pdf-to-jpg": {
    metaTitle: "PDF를 JPG로 — 페이지를 이미지로, 무료",
    metaDescription:
      "각 페이지를 개별 JPG로, 전체를 담은 ZIP까지. PDF를 JPG로 무료 온라인, 워터마크 없음.",
    h1: "PDF를 JPG로",
    description: "각 페이지를 개별 JPG로, 전체를 담은 ZIP까지.",
  },
  "excel-to-pdf": {
    metaTitle: "Excel을 PDF로 — 무료 온라인 변환기",
    metaDescription:
      "Excel 통합 문서를 깔끔한 PDF로 변환, 시트당 한 페이지. 무료 온라인, 워터마크 없음.",
    h1: "Excel을 PDF로",
    description: "통합 문서를 깔끔한 PDF로, 시트당 한 페이지.",
  },
  "ppt-to-pdf": {
    metaTitle: "PowerPoint를 PDF로 — 무료 온라인",
    metaDescription:
      "슬라이드를 PDF로 변환, 슬라이드당 한 페이지. PowerPoint를 PDF로 무료 온라인, 가입 불필요.",
    h1: "PowerPoint를 PDF로",
    description: "슬라이드를 PDF로, 슬라이드당 한 페이지.",
  },
  "pdf-to-excel": {
    metaTitle: "PDF를 Excel로 — 표로 변환, 무료 온라인",
    metaDescription:
      "PDF의 텍스트를 레이아웃에 맞춰 Excel 통합 문서로 추출. PDF를 Excel로 무료 온라인, 가입 불필요.",
    h1: "PDF를 Excel로",
    description: "레이아웃을 반영해 텍스트를 통합 문서로 추출.",
  },
  "pdf-to-ppt": {
    metaTitle: "PDF를 PowerPoint로 — 편집 가능한 슬라이드, 무료",
    metaDescription:
      "PDF를 편집 가능한 발표자료로 변환, 페이지당 한 슬라이드. 무료 온라인, 가입 불필요.",
    h1: "PDF를 PowerPoint로",
    description: "편집 가능한 발표자료로, 페이지당 한 슬라이드.",
  },
  "html-to-pdf": {
    metaTitle: "HTML을 PDF로 — 무료 온라인 변환기",
    metaDescription:
      "HTML을 붙여넣으면 Chromium이 렌더링한 깔끔한 PDF를 받으세요. HTML을 PDF로 무료 온라인, 가입 불필요.",
    h1: "HTML을 PDF로",
    description: "HTML을 붙여넣고 Chromium이 렌더링한 깔끔한 PDF를 받으세요.",
  },
  "pdf-to-html": {
    metaTitle: "PDF를 HTML로 — 브라우저 준비, 무료 온라인",
    metaDescription:
      "어떤 PDF에서도 브라우저에서 바로 열리는 HTML을 받으세요. PDF를 HTML로 무료 온라인, 워터마크 없음.",
    h1: "PDF를 HTML로",
    description: "어떤 PDF에서도 브라우저 준비된 HTML을 받으세요.",
  },
  "url-to-pdf": {
    metaTitle: "URL을 PDF로 — 웹페이지 저장, 무료 온라인",
    metaDescription:
      "공개 웹페이지를 통째로 PDF로 저장하세요. URL을 PDF로 무료 온라인, 가입 불필요.",
    h1: "URL을 PDF로",
    description: "공개 웹페이지를 통째로 PDF로 저장하세요.",
  },
  "scan-to-pdf": {
    metaTitle: "스캔을 PDF로 — 문서 사진에서, 무료",
    metaDescription:
      "종이 문서 사진을 검색 가능한 하나의 PDF로 변환. 무료 온라인, 워터마크 없음, 가입 불필요.",
    h1: "스캔을 PDF로",
    description: "종이 문서 사진 → 검색 가능한 하나의 PDF.",
  },
  "ocr-extract-text": {
    metaTitle: "텍스트 추출(OCR) — 스캔에서, 무료 온라인",
    metaDescription:
      "스캔한 PDF의 모든 단어를 일반 텍스트로 추출. OCR 무료 온라인, 가입 불필요.",
    h1: "텍스트 추출(OCR)",
    description: "스캔한 PDF의 모든 단어를 일반 텍스트로 추출.",
  },
  "image-to-text": {
    metaTitle: "이미지에서 텍스트 — 텍스트 인식, 무료 온라인",
    metaDescription:
      "어떤 사진이나 스크린샷에서도 텍스트를 읽으세요. 이미지에서 텍스트(OCR) 무료 온라인, 가입 불필요.",
    h1: "이미지에서 텍스트",
    description: "어떤 사진이나 스크린샷에서도 텍스트를 읽으세요.",
  },
  "ocr-detect-lang": {
    metaTitle: "문서 언어 감지 — 무료 온라인",
    metaDescription:
      "이 문서는 무슨 언어일까요? Tesseract가 알려줍니다. 문서 언어 감지 무료 온라인, 가입 불필요.",
    h1: "문서 언어 감지",
    description: "이 문서는 무슨 언어일까요? Tesseract가 알려줍니다.",
  },
  "ocr-structured": {
    metaTitle: "구조화 OCR — 레이아웃 포함, 무료 온라인",
    metaDescription:
      "레이아웃 정보가 포함된 OCR — 제목, 단, 표 유지. 무료 온라인, 가입 불필요.",
    h1: "구조화 OCR",
    description: "레이아웃이 포함된 OCR: 제목, 단, 표 유지.",
  },
  "extract-text": {
    metaTitle: "PDF에서 텍스트 추출 — 무료 온라인",
    metaDescription:
      "이미 텍스트 레이어가 있는 PDF에서 일반 텍스트를 추출. 무료 온라인, 워터마크 없음.",
    h1: "PDF에서 텍스트 추출",
    description: "텍스트 레이어가 있는 PDF에서 일반 텍스트를 추출.",
  },
  "pptx-builder": {
    metaTitle: "AI PowerPoint 생성기 — 주제에서 슬라이드로, 무료",
    metaDescription:
      "주제를 입력하면 AI가 실제 .pptx를 디자인하고 작성. 5개 언어, 4가지 톤. AI 발표자료 생성기 무료 온라인.",
    h1: "AI PowerPoint 생성기",
    description: "주제를 입력하면 AI가 실제 .pptx를 만듭니다. 5개 언어, 4가지 톤.",
  },
  "xlsx-builder": {
    metaTitle: "AI Excel 생성기 — 설명하면 AI가 구축, 무료",
    metaDescription:
      "필요한 것을 설명하면 AI가 수식과 차트로 시트를 구성. AI Excel 생성기 무료 온라인.",
    h1: "AI Excel 생성기",
    description: "필요한 것을 설명하면 AI가 수식과 차트로 시트를 구성합니다.",
  },
};
