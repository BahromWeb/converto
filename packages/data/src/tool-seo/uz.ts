import type { ToolSeoMap } from "./types";

// Uzbek SEO content for tool pages. SEO-optimized phrasing (real search
// keywords) rather than literal translation. Tools without an entry fall
// back to English. Covers every live (non-comingSoon) tool.
export const uz: ToolSeoMap = {
  merge: {
    metaTitle: "PDF birlashtirish — Onlayn bepul, suv belgisisiz",
    metaDescription:
      "PDF fayllarni onlayn bepul birlashtiring — xohlagan tartibda. Suv belgisi yo'q, ro'yxatdan o'tish shart emas. Mobil va kompyuterda ishlaydi.",
    h1: "PDF birlashtirish",
    description: "PDF fayllarni xohlagan tartibda bitta faylga birlashtiring. Sudrab tashlang — tayyor.",
  },
  split: {
    metaTitle: "PDF ajratish — Sahifalarga bo'lish, bepul onlayn",
    metaDescription:
      "PDF faylni sahifalarga ajrating yoki bo'laklarga bo'ling. Onlayn bepul, suv belgisisiz, ro'yxatdan o'tish shart emas.",
    h1: "PDF ajratish",
    description: "Sahifalarni ajrating yoki hujjatni bo'laklarga bo'ling.",
  },
  compress: {
    metaTitle: "PDF hajmini kichraytirish — Bepul PDF siqish",
    metaDescription:
      "PDF hajmini onlayn bepul kichraytiring — sifati saqlanadi. Suv belgisisiz, ro'yxatdan o'tmasdan. Tez va xavfsiz PDF siqish.",
    h1: "PDF hajmini kichraytirish",
    description: "Fayl kichikroq, sifati o'sha. Yoki yana ham kichikroq.",
  },
  chat: {
    metaTitle: "PDF bilan suhbat — AI orqali savol bering, bepul",
    metaDescription:
      "PDF hujjatga savol bering, manbali javob oling. AI yordamida PDF bilan suhbat — onlayn bepul, ro'yxatdan o'tmasdan.",
    h1: "PDF bilan suhbat",
    description: "Savol bering — manbaga havola bilan javob oling.",
  },
  "chat-word": {
    metaTitle: "Word bilan suhbat — Hujjatga AI savol berish",
    metaDescription:
      "Word hujjatni yuklang va istalgan savolni bering — javoblar sahifaga ishora qiladi. Onlayn bepul, AI yordamida.",
    h1: "Word bilan suhbat",
    description: "Word hujjatni tashlang — istalgan savolga javob oling.",
  },
  "chat-excel": {
    metaTitle: "Excel bilan suhbat — Jadvalga AI savol berish",
    metaDescription:
      "Excel jadvalini oddiy tilda so'rang — raqamlar, formulalar, jami. AI yordamida onlayn bepul tahlil qiling.",
    h1: "Excel bilan suhbat",
    description: "Jadvalni oddiy tilda so'rang: raqamlar, formulalar, jami.",
  },
  "chat-powerpoint": {
    metaTitle: "PowerPoint bilan suhbat — Taqdimotni AI bilan",
    metaDescription:
      "Taqdimotni qisqartiring, slaydlardan iqtiboslar oling — manbali. PowerPoint bilan AI suhbati, onlayn bepul.",
    h1: "PowerPoint bilan suhbat",
    description: "Taqdimotlarni qisqartiring, slaydlardan iqtibos oling.",
  },
  "pdf-to-word": {
    metaTitle: "PDF dan Word — Tahrirlanadigan .docx, bepul",
    metaDescription:
      "PDF ni tahrirlanadigan Word (.docx) ga aylantiring — formatlash saqlanadi. Onlayn bepul, suv belgisisiz, ro'yxatsiz.",
    h1: "PDF dan Word ga",
    description: "Formatlash saqlangan, tahrirlanadigan .docx.",
  },
  "word-to-pdf": {
    metaTitle: "Word dan PDF — Bepul onlayn konvertor",
    metaDescription:
      "Word hujjatni PDF ga aylantiring — har bir shrift saqlanadi. Onlayn bepul, suv belgisisiz, ro'yxatdan o'tmasdan.",
    h1: "Word dan PDF ga",
    description: "Toza natija, har bir shrift saqlanadi.",
  },
  "jpg-to-pdf": {
    metaTitle: "JPG dan PDF — Rasmlarni PDF ga, bepul",
    metaDescription:
      "JPG rasm va skanlarni bitta PDF ga jamlang. Onlayn bepul, suv belgisisiz, ro'yxatdan o'tish shart emas.",
    h1: "JPG dan PDF ga",
    description: "Rasm va skanlar — bitta toza PDF da jamlandi.",
  },
  sign: {
    metaTitle: "PDF imzolash — Onlayn elektron imzo, bepul",
    metaDescription:
      "PDF ga imzo qo'ying va qaytarib oling. Onlayn elektron imzo — bepul, suv belgisisiz, ro'yxatdan o'tmasdan.",
    h1: "PDF imzolash",
    description: "Imzo qo'ying, qaytaring — tayyor.",
  },
  protect: {
    metaTitle: "PDF ga parol qo'yish — Himoyalash, bepul",
    metaDescription:
      "PDF faylni bir bosishda parol bilan himoyalang. Onlayn bepul, ro'yxatdan o'tmasdan, fayllaringiz xavfsiz.",
    h1: "PDF ni himoyalash",
    description: "Faylni bir bosishda parol bilan qulflang.",
  },
  unlock: {
    metaTitle: "PDF parolini olib tashlash — Bepul onlayn",
    metaDescription:
      "PDF dan parolni olib tashlang (huquqingiz bo'lsa). Onlayn bepul, ro'yxatdan o'tmasdan, tez va xavfsiz.",
    h1: "PDF parolini olib tashlash",
    description: "Parolni olib tashlang (agar huquqingiz bo'lsa).",
  },
  ocr: {
    metaTitle: "PDF OCR — Skanni qidiriladigan qilish, bepul",
    metaDescription:
      "Skaner qilingan PDF ni qidiriladigan va nusxalanadigan qiling. OCR onlayn bepul, suv belgisisiz, ro'yxatsiz.",
    h1: "PDF OCR",
    description: "Skaner PDF ni qidiriladigan va nusxalanadigan qiling.",
  },
  watermark: {
    metaTitle: "PDF ga suv belgisi qo'shish — Bepul onlayn",
    metaDescription:
      "Istalgan sahifaga o'z suv belgingizni qo'shing. Onlayn bepul, ro'yxatdan o'tmasdan, tez va sodda.",
    h1: "PDF ga suv belgisi",
    description: "Istalgan sahifaga o'z suv belgingizni qo'shing.",
  },
  removepage: {
    metaTitle: "PDF sahifalarini o'chirish — Bepul onlayn",
    metaDescription:
      "PDF dan kerakmas sahifalarni o'chiring — diapazonni tanlang va bajaring. Onlayn bepul, suv belgisisiz.",
    h1: "PDF sahifalarini o'chirish",
    description: "Kerakmas sahifalarni o'chiring — diapazonni tanlang.",
  },
  extract: {
    metaTitle: "PDF sahifalarini ajratib olish — Bepul onlayn",
    metaDescription:
      "Faqat kerakli sahifalarni alohida PDF qilib oling. Onlayn bepul, suv belgisisiz, ro'yxatdan o'tmasdan.",
    h1: "PDF sahifalarini ajratib olish",
    description: "Faqat kerakli sahifalarni alohida PDF ga oling.",
  },
  rotate: {
    metaTitle: "PDF aylantirish — Sahifalarni burish, bepul",
    metaDescription:
      "Bir yoki barcha sahifani 90°, 180°, 270° ga buring. PDF aylantirish onlayn bepul, ro'yxatdan o'tmasdan.",
    h1: "PDF aylantirish",
    description: "Bir yoki barcha sahifani 90°, 180°, 270° ga buring.",
  },
  crop: {
    metaTitle: "PDF kesish — Hoshiyalarni qirqish, bepul",
    metaDescription:
      "Hoshiyalarni qirqing yoki har sahifada bir sohaga e'tibor qarating. PDF kesish onlayn bepul, suv belgisisiz.",
    h1: "PDF kesish",
    description: "Hoshiyalarni qirqing yoki kerakli sohani tanlang.",
  },
  "add-page-numbers": {
    metaTitle: "PDF ga sahifa raqami qo'shish — Bepul onlayn",
    metaDescription:
      "PDF ga ketma-ket sahifa raqamlarini qo'shing — uslub va joyini to'liq boshqaring. Onlayn bepul, ro'yxatsiz.",
    h1: "Sahifa raqamlarini qo'shish",
    description: "Uslub va joylashuvni to'liq boshqargan holda raqamlang.",
  },
  "header-footer": {
    metaTitle: "PDF ga kolontitul qo'shish — Bepul onlayn",
    metaDescription:
      "Har sahifaga yuqori yoki pastki kolontitul qo'shing — bir necha soniyada. Onlayn bepul, suv belgisisiz.",
    h1: "Kolontitul qo'shish",
    description: "Har sahifaga yuqori yoki pastki kolontitul qo'shing.",
  },
  "qr-code": {
    metaTitle: "PDF ga QR kod qo'shish — Bepul onlayn",
    metaDescription:
      "Sahifaning istalgan joyiga QR kod joylang — havola, vCard, har narsa. Onlayn bepul, ro'yxatdan o'tmasdan.",
    h1: "PDF ga QR kod qo'shish",
    description: "Istalgan joyga QR kod: havola, vCard va boshqalar.",
  },
  nup: {
    metaTitle: "N-up joylashuv — Bir varaqqa ko'p sahifa, bepul",
    metaDescription:
      "2, 4, 6 yoki 9 sahifani bitta varaqqa joylang. N-up joylashuv onlayn bepul, suv belgisisiz, ro'yxatsiz.",
    h1: "N-up joylashuv",
    description: "2, 4, 6 yoki 9 sahifani bitta varaqqa joylang.",
  },
  inspect: {
    metaTitle: "PDF tekshirish — Metadata ko'rish, bepul",
    metaDescription:
      "Sahifa soni, muallif, sarlavha, kalit so'zlar — bir zumda. PDF metadata ko'ruvchi onlayn bepul, ro'yxatsiz.",
    h1: "PDF tekshirish",
    description: "Sahifa soni, muallif, sarlavha, kalit so'zlar — bir zumda.",
  },
  "detect-blank": {
    metaTitle: "Bo'sh sahifalarni aniqlash — Bepul onlayn",
    metaDescription:
      "PDF dagi har bir bo'sh sahifani toping va chop etishdan oldin olib tashlang. Onlayn bepul, ro'yxatsiz.",
    h1: "Bo'sh sahifalarni aniqlash",
    description: "Har bir bo'sh sahifani topib, oldindan tozalang.",
  },
  metadata: {
    metaTitle: "PDF metadata tahrirlash — Bepul onlayn",
    metaDescription:
      "Sarlavha, muallif, mavzu, kalit so'zlar va yaratuvchini qayta yozing. PDF metadata muharriri onlayn bepul.",
    h1: "PDF metadata tahrirlash",
    description: "Sarlavha, muallif, mavzu, kalit so'z va yaratuvchini o'zgartiring.",
  },
  "pdf-to-jpg": {
    metaTitle: "PDF dan JPG — Sahifalarni rasmga, bepul",
    metaDescription:
      "Har sahifani alohida JPG qiling — barchasi ZIP da ham. PDF dan JPG ga onlayn bepul, suv belgisisiz.",
    h1: "PDF dan JPG ga",
    description: "Har sahifa — alohida JPG, plus barchasi ZIP da.",
  },
  "excel-to-pdf": {
    metaTitle: "Excel dan PDF — Bepul onlayn konvertor",
    metaDescription:
      "Excel kitoblarini toza PDF ga aylantiring — har varaq alohida sahifa. Onlayn bepul, suv belgisisiz, ro'yxatsiz.",
    h1: "Excel dan PDF ga",
    description: "Kitoblar toza PDF da — har varaq alohida sahifa.",
  },
  "ppt-to-pdf": {
    metaTitle: "PowerPoint dan PDF — Bepul onlayn",
    metaDescription:
      "Slaydlarni PDF ga aylantiring — har slayd alohida sahifa. PowerPoint dan PDF ga onlayn bepul, ro'yxatsiz.",
    h1: "PowerPoint dan PDF ga",
    description: "Slaydlar PDF ga — har slayd alohida sahifa.",
  },
  "pdf-to-excel": {
    metaTitle: "PDF dan Excel — Jadvalga aylantirish, bepul",
    metaDescription:
      "PDF dagi matnni joylashuvni hisobga olib Excel kitobiga oling. PDF dan Excel ga onlayn bepul, ro'yxatsiz.",
    h1: "PDF dan Excel ga",
    description: "Joylashuvni hisobga olgan holda jadvalga ko'chiring.",
  },
  "pdf-to-ppt": {
    metaTitle: "PDF dan PowerPoint — Tahrirlanadigan slayd, bepul",
    metaDescription:
      "PDF ni tahrirlash mumkin bo'lgan taqdimotga aylantiring — har sahifa bir slayd. Onlayn bepul, ro'yxatsiz.",
    h1: "PDF dan PowerPoint ga",
    description: "Tahrirlanadigan taqdimot — har sahifa bir slayd.",
  },
  "html-to-pdf": {
    metaTitle: "HTML dan PDF — Bepul onlayn konvertor",
    metaDescription:
      "HTML kodini joylang — Chromium chizgan toza PDF oling. HTML dan PDF ga onlayn bepul, ro'yxatdan o'tmasdan.",
    h1: "HTML dan PDF ga",
    description: "HTML joylang — Chromium chizgan toza PDF oling.",
  },
  "pdf-to-html": {
    metaTitle: "PDF dan HTML — Brauzerga tayyor, bepul",
    metaDescription:
      "Istalgan PDF dan brauzerga tayyor HTML oling. PDF dan HTML ga onlayn bepul, suv belgisisiz, ro'yxatsiz.",
    h1: "PDF dan HTML ga",
    description: "Istalgan PDF dan brauzerga tayyor HTML.",
  },
  "url-to-pdf": {
    metaTitle: "URL dan PDF — Veb-sahifani saqlash, bepul",
    metaDescription:
      "Istalgan ochiq veb-sahifani PDF sifatida saqlang. URL dan PDF ga onlayn bepul, ro'yxatdan o'tish shart emas.",
    h1: "URL dan PDF ga",
    description: "Istalgan ochiq veb-sahifani PDF qilib saqlang.",
  },
  "scan-to-pdf": {
    metaTitle: "Skanerdan PDF — Hujjat suratidan, bepul",
    metaDescription:
      "Qog'oz hujjat suratlarini bitta qidiriladigan PDF ga aylantiring. Onlayn bepul, suv belgisisiz, ro'yxatsiz.",
    h1: "Skanerdan PDF ga",
    description: "Qog'oz hujjat suratlari → bitta qidiriladigan PDF.",
  },
  "ocr-extract-text": {
    metaTitle: "OCR matn ajratish — Skandan matn olish, bepul",
    metaDescription:
      "Skaner qilingan PDF dagi har bir so'zni oddiy matnga chiqaring. OCR matn ajratish onlayn bepul, ro'yxatsiz.",
    h1: "OCR bilan matn ajratish",
    description: "Skaner PDF dagi har bir so'zni oddiy matnga chiqaring.",
  },
  "image-to-text": {
    metaTitle: "Rasmdan matn — Suratdan matn o'qish, bepul",
    metaDescription:
      "Istalgan surat yoki skrinshotdagi matnni o'qing. Rasmdan matn (OCR) onlayn bepul, ro'yxatdan o'tmasdan.",
    h1: "Rasmdan matn",
    description: "Istalgan surat yoki skrinshotdagi matnni o'qing.",
  },
  "ocr-detect-lang": {
    metaTitle: "Hujjat tilini aniqlash — Bepul OCR onlayn",
    metaDescription:
      "Bu hujjat qaysi tilda? Tesseract aytib beradi. Hujjat tilini aniqlash onlayn bepul, ro'yxatdan o'tmasdan.",
    h1: "Hujjat tilini aniqlash",
    description: "Bu hujjat qaysi tilda? Tesseract aytib beradi.",
  },
  "ocr-structured": {
    metaTitle: "Strukturali OCR — Joylashuv bilan, bepul",
    metaDescription:
      "Joylashuv ma'lumoti bilan OCR — sarlavhalar, ustunlar, jadvallar saqlanadi. Onlayn bepul, ro'yxatdan o'tmasdan.",
    h1: "Strukturali OCR",
    description: "Sarlavha, ustun, jadval saqlangan joylashuvli OCR.",
  },
  "extract-text": {
    metaTitle: "PDF dan matn ajratish — Bepul onlayn",
    metaDescription:
      "Matn qatlami bor PDF dan oddiy matnni ajratib oling. Onlayn bepul, suv belgisisiz, ro'yxatdan o'tmasdan.",
    h1: "PDF dan matn ajratish",
    description: "Matn qatlami bor PDF dan oddiy matnni oling.",
  },
  "pptx-builder": {
    metaTitle: "AI PowerPoint yaratuvchi — Mavzudan slayd, bepul",
    metaDescription:
      "Mavzuni yozing — AI haqiqiy .pptx loyihalaydi va yozadi. 5 til, 4 ohang. AI taqdimot yaratuvchi onlayn bepul.",
    h1: "AI PowerPoint yaratuvchi",
    description: "Mavzuni yozing — AI haqiqiy .pptx yaratadi. 5 til, 4 ohang.",
  },
  "xlsx-builder": {
    metaTitle: "AI Excel yaratuvchi — Yozing, AI tuzadi, bepul",
    metaDescription:
      "Nima kerakligini yozing — AI formulalar va diagrammalar bilan jadval tuzadi. AI Excel yaratuvchi onlayn bepul.",
    h1: "AI Excel yaratuvchi",
    description: "Yozing — AI formulalar va diagrammalar bilan jadval tuzadi.",
  },
};
