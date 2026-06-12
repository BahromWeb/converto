import Link from "next/link";
import { Lightbulb, AlertTriangle, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import type { BlogPost } from "./types";

function H2({ id, children }: { id: string; children: React.ReactNode }) { return <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">{children}</h2>; }
function Lead({ children }: { children: React.ReactNode }) { return <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>; }
function Section({ children }: { children: React.ReactNode }) { return <section className="mt-10 space-y-4">{children}</section>; }
function Callout({ icon: Icon, title, children, tone = "info" }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode; tone?: "info" | "warn" | "tip"; }) {
  const toneClass = tone === "warn" ? "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20" : tone === "tip" ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20" : "border-blue-500/30 bg-blue-50 dark:bg-blue-950/20";
  return (<div className={`my-6 rounded-2xl border p-5 ${toneClass}`}><div className="flex items-start gap-3"><Icon className="mt-0.5 size-5 shrink-0" /><div className="flex-1"><p className="font-bold">{title}</p><div className="mt-1 text-sm leading-relaxed">{children}</div></div></div></div>);
}
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) { return (<div className="my-5 flex gap-4 rounded-2xl border bg-card p-5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{n}</span><div><p className="font-bold">{title}</p><div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div></div></div>); }
function Faq({ q, children }: { q: string; children: React.ReactNode }) { return (<div className="speakable-faq my-4 rounded-2xl border bg-card p-5"><p className="font-bold">{q}</p><div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div></div>); }

const Body = (
  <>
    <Lead>
      You read a great article and want to archive it before the site
      paywalls it. You found a Stack Overflow thread with the answer to your
      problem and want to read it offline on the plane. You need to bundle a
      few blog posts as a single PDF for an email handoff. Paste, click,
      download. Here&apos;s how, in fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">When you actually need URL → PDF</H2>
      <p>
        Real cases: archiving articles before the source paywalls or
        de-publishes them, saving recipes from a phone-friendly cooking
        site, capturing a competitor&apos;s pricing page as evidence,
        building offline reading lists for a flight, bundling research
        sources for a paper, and creating PDF snapshots of dashboards for
        weekly reports.
      </p>
      <p>
        Why URL → PDF when every browser has &quot;Print → Save as PDF&quot;?
        Three reasons: a clean output without browser-print artefacts
        (ads, sidebars, &quot;print this page&quot; popups stripped), batch
        conversion for multiple URLs (no clicking through each), and the
        ability to convert URLs from a phone or tablet where Print to PDF
        is awkward or unsupported.
      </p>
      <Callout icon={Lightbulb} title="When to use HTML → PDF instead" tone="tip">
        If you have the HTML markup locally (a generated report, a templated
        invoice, AI output), use{" "}
        <Link href="/html-to-pdf" className="text-primary hover:underline">HTML to PDF</Link>{" "}
        — paste the markup directly, no public URL needed.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to convert a URL to PDF, step by step</H2>
      <Step n={1} title="Open the URL to PDF tool">Go to <Link href="/url-to-pdf" className="text-primary hover:underline">convertpdfgo.com/url-to-pdf</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Paste the URL">Paste any public webpage URL — articles, documentation, dashboards, anything that loads in a browser without a login.</Step>
      <Step n={3} title="Headless Chrome fetches and renders">The renderer waits a few seconds for the page to fully load (including lazy-loaded images and JavaScript-rendered content), then snapshots.</Step>
      <Step n={4} title="Download the PDF">The output is a single PDF, A4 portrait by default, with the page rendered exactly as Chrome would show it.</Step>
    </Section>

    <Section>
      <H2 id="behind">What renders well — and what stays awkward</H2>
      <p><strong>Works well:</strong> articles, blog posts, documentation pages, Stack Overflow threads, GitHub README files, simple landing pages. Any page designed to be readable in a browser also reads well as a PDF.</p>
      <p><strong>Works mostly:</strong> infinite-scroll feeds (Twitter timelines, Reddit threads), pages with heavy lazy-loading, SPAs that take a few seconds to settle. We wait for the page to settle, but really aggressive lazy-load might leave some images blank.</p>
      <p><strong>Hard cases:</strong> pages behind login walls (renderer has no cookies), pages that detect headless browsers and serve a different version, video-heavy pages (the video itself can&apos;t render as PDF — only its poster image).</p>
      <Callout icon={Lightbulb} title="For pages behind login" tone="tip">
        Open the page in your own browser → File → Print → Save as PDF.
        The result will have your authenticated view, which the headless
        renderer can&apos;t access. URL to PDF works for public pages
        only.
      </Callout>
    </Section>

    <Section>
      <H2 id="problems">Common conversion problems and how to avoid them</H2>
      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> The page says &quot;You need to log in&quot;</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">The renderer has no cookies, so authenticated content is invisible to it. Use your browser&apos;s Print → Save as PDF instead, or unlock the public version of the page if there is one.</p></div>
      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> A cookie consent banner covers half the content</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">European sites sometimes show a GDPR banner that the headless renderer can&apos;t dismiss. Workaround: open the page in your browser, accept cookies, then copy the URL — the renderer respects the same cookie state if you re-submit within the same session.</p></div>
      <div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Images come out as broken icons</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Lazy-loaded images that hadn&apos;t loaded when the snapshot ran. We give a few seconds for the page to settle, but very aggressive lazy-loading might still leave some blank. Scroll the page in your browser before noting the URL, since many sites cache aggressively.</p></div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Three things to know. <strong>One</strong>: the URL you paste goes over TLS 1.3. <strong>Two</strong>: the URL and output PDF are encrypted at rest, then deleted within one hour. <strong>Three</strong>: we don&apos;t log which URLs you converted — the input URL is processed and discarded along with the file.</p>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free URL-to-PDF tools</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left"><th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">Smallpdf</th><th className="py-2 font-bold">iLovePDF</th></tr></thead><tbody>
      <tr className="border-b"><td className="py-2 pr-4">Renderer</td><td className="py-2 pr-4"><strong>Real Chromium</strong></td><td className="py-2 pr-4">Chromium</td><td className="py-2">Chromium</td></tr>
      <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
      <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
      <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr></tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Do JavaScript-heavy pages work?">Yes. The renderer waits for the page to settle before snapshotting, so React/Vue/SPA content lands in the PDF.</Faq>
      <Faq q="What about pages behind a paywall?">Only if the paywall lets you read the article first (some sites give 3 free articles before the wall). For hard paywalls, the renderer sees the paywall, not the content.</Faq>
      <Faq q="Can I convert a YouTube video page?">The page renders, but the embedded video can&apos;t play in a PDF — you&apos;ll get the video&apos;s thumbnail.</Faq>
      <Faq q="How long does it take?">2–5 seconds for typical pages. Pages with lots of lazy-loaded images or slow APIs can take up to 15 seconds.</Faq>
      <Faq q="What page size does the PDF use?">A4 portrait by default. The rendered page itself doesn&apos;t change size — wider pages just get scaled down to fit.</Faq>
      <Faq q="Can I convert multiple URLs at once?">Right now the tool is one-at-a-time. After converting each, use{" "}<Link href="/merge" className="text-primary hover:underline">our merge tool</Link>{" "}to bundle them into one PDF.</Faq>
      <Faq q="Is there a usage limit?">No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">Convert multiple URLs, then {" "}<Link href="/merge" className="font-semibold text-primary hover:underline">merge them as one PDF</Link>, {" "}<Link href="/compress" className="font-semibold text-primary hover:underline">compress</Link>, {" "}<Link href="/protect" className="font-semibold text-primary hover:underline">protect</Link>, or {" "}<Link href="/watermark" className="font-semibold text-primary hover:underline">watermark</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const urlToPdfPost: BlogPost = {
  slug: "how-to-convert-url-to-pdf-online-free",
  title: "How to Convert a URL to PDF Online — Save Any Webpage Free, No Watermark",
  description: "Save any public webpage as a PDF — Chromium-rendered, no software, no sign-up, no watermark. Step-by-step guide, what renders well, common problems (login walls, cookie banners), comparison vs Smallpdf and iLovePDF.",
  date: "2021-11-22", modified: "2026-06-01",
  author: "convertpdfgo team", tag: "Guide", readingMinutes: 8,
  keywords: ["url to pdf", "save webpage as pdf", "convert url to pdf", "website to pdf", "webpage to pdf online free", "url to pdf no watermark", "save website as pdf"],
  heroEmoji: "🔗",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "behind", label: "What renders well" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs Smallpdf / iLovePDF" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
