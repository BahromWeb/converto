// One-off codemod: make every tool page locale-aware.
//  1. `export const metadata` → `const baseMetadata`
//  2. append a generateMetadata() that wraps it via localizeToolMetadata(slug, locale)
//  3. default export becomes async, reads `params`, passes `locale` to ToolPageShell
// Idempotent: skips a file that already has generateMetadata.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../app/[locale]/(tools)",
);

/** Index of the `}` that closes the object opened at `openBrace` (a `{`),
 *  ignoring braces inside '...', "..." and `...` strings. */
function matchBrace(src, openBrace) {
  let depth = 0;
  let str = null; // current string delimiter or null
  for (let i = openBrace; i < src.length; i++) {
    const ch = src[i];
    const prev = src[i - 1];
    if (str) {
      if (ch === str && prev !== "\\") str = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { str = ch; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

let changed = 0;
for (const entry of readdirSync(toolsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = join(toolsDir, entry.name, "page.tsx");
  let src;
  try { src = readFileSync(file, "utf8"); } catch { continue; }
  if (src.includes("generateMetadata")) continue;

  const slugMatch = src.match(/getToolBySlug\(\s*["'`]([^"'`]+)["'`]\s*\)/);
  if (!slugMatch) { console.warn("no slug:", entry.name); continue; }
  const slug = slugMatch[1];

  // 1) rename the metadata const + locate its block
  const marker = "export const metadata: Metadata = {";
  const mStart = src.indexOf(marker);
  if (mStart === -1) { console.warn("no metadata:", entry.name); continue; }
  const openBrace = src.indexOf("{", mStart);
  const closeBrace = matchBrace(src, openBrace);
  if (closeBrace === -1) { console.warn("unbalanced:", entry.name); continue; }
  // expect a trailing semicolon
  let semi = closeBrace + 1;
  while (semi < src.length && /\s/.test(src[semi])) semi++;
  if (src[semi] !== ";") { console.warn("no semicolon:", entry.name); continue; }

  const genFn =
    `\n\nexport async function generateMetadata(\n` +
    `  { params }: { params: Promise<{ locale: string }> },\n` +
    `): Promise<Metadata> {\n` +
    `  const { locale } = await params;\n` +
    `  return localizeToolMetadata(baseMetadata, ${JSON.stringify(slug)}, locale);\n` +
    `}`;

  src =
    src.slice(0, mStart).replace(/$/, "") +
    "const baseMetadata: Metadata = {" +
    src.slice(openBrace + 1, semi + 1) +
    genFn +
    src.slice(semi + 1);

  // 2) import the helper (after the next/navigation import, which all pages have)
  if (!src.includes("@/lib/seo/tool-metadata")) {
    src = src.replace(
      /(import\s+\{[^}]*\}\s+from\s+["']next\/navigation["'];)/,
      `$1\nimport { localizeToolMetadata } from "@/lib/seo/tool-metadata";`,
    );
  }

  // 3) default export → async, read params, thread locale into ToolPageShell
  src = src.replace(
    /export default function (\w+)\(\)\s*\{/,
    (_m, name) =>
      `export default async function ${name}(\n` +
      `  { params }: { params: Promise<{ locale: string }> },\n` +
      `) {\n  const { locale } = await params;`,
  );
  src = src.replace(/tool=\{tool\}/, "tool={tool} locale={locale}");

  writeFileSync(file, src);
  changed++;
}
console.log(`localized ${changed} tool pages`);
