import Link from "next/link";
import { Sparkles, XCircle, CheckCircle2 } from "lucide-react";
import type { BlogPost } from "./types";

function H2({ id, children }: { id: string; children: React.ReactNode }) { return <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">{children}</h2>; }
function Lead({ children }: { children: React.ReactNode }) { return <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>; }
function Section({ children }: { children: React.ReactNode }) { return <section className="mt-10 space-y-4">{children}</section>; }
function Callout({ children }: { children: React.ReactNode }) { return <div className="my-6 rounded-2xl border border-blue-500/30 bg-blue-50 p-5 dark:bg-blue-950/20"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 size-5 shrink-0" /><div className="flex-1 text-sm leading-relaxed">{children}</div></div></div>; }
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) { return (<div className="my-5 flex gap-4 rounded-2xl border bg-card p-5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{n}</span><div><p className="font-bold">{title}</p><div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div></div></div>); }
function Faq({ q, children }: { q: string; children: React.ReactNode }) { return (<div className="speakable-faq my-4 rounded-2xl border bg-card p-5"><p className="font-bold">{q}</p><div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div></div>); }
function Problem({ title, children }: { title: string; children: React.ReactNode }) { return (<div className="my-6 rounded-2xl border bg-card p-5"><p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> {title}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p></div>); }

const Body = (
  <>
    <Lead>
      A monthly business review needs a deck. A pitch needs a deck. A
      lecture needs slides. The hard part is the first 30 minutes —
      staring at a blank Title slide, copying a theme from somewhere,
      writing the same intro you&apos;ve written ten times. Type the
      topic into the AI builder and it does that 30 minutes in 15
      seconds — palette, layouts, headings, bullets, even speaker notes.
    </Lead>

    <Section>
      <H2 id="why">When you actually need an AI deck builder</H2>
      <p>
        Quick prep before a meeting you didn&apos;t expect, recurring
        weekly status decks that all look the same, a client pitch
        where the first draft just needs to exist, a teacher building
        ten lecture slides for tomorrow morning, a founder pulling a
        pitch deck together on a Sunday. The AI builder isn&apos;t a
        substitute for a designer on a high-stakes pitch — it&apos;s a
        substitute for the 80% of decks that just need to exist.
      </p>
    </Section>

    <Section>
      <H2 id="how">How to use it, step by step</H2>

      <Step n={1} title="Open the builder">Go to <Link href="/pptx-builder" className="text-primary hover:underline">convertpdfgo.com/pptx-builder</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Type a topic">One sentence works. &quot;Q4 sales review for the executive team.&quot; &quot;Pitch deck for a B2B SaaS Series A.&quot; &quot;Yangi mahsulot taqdimoti.&quot; The AI gets context from the topic — keep it specific.</Step>
      <Step n={3} title="Pick slide count, tone, language">5–15 slides. Corporate (navy), Modern (teal), Playful (coral), Academic (burgundy). 5 languages — Uzbek, Russian, English, Spanish, Arabic.</Step>
      <Step n={4} title="Generate + download">Usually 12–20 seconds. The .pptx opens in PowerPoint, Keynote, Google Slides, LibreOffice — no compatibility issues, no watermark.</Step>
    </Section>

    <Section>
      <H2 id="how-it-works">How it actually works under the hood</H2>
      <p>
        Two stages. <strong>Stage 1</strong>: the topic and constraints
        go to Gemini with a structured prompt that asks for a JSON
        spec — palette (5 hex colors), font pair, and a list of slides
        with one of seven layouts (title, section break, bullets,
        two-column, stat, quote, thanks). <strong>Stage 2</strong>: a
        Python script (python-pptx) takes the JSON and renders a real
        .pptx with hard-coded design rules — accent bars, rounded
        cards, big stat numbers, section-break full bleeds.
      </p>
      <p>
        The split matters: the AI handles creativity (what to say,
        what layout fits), the renderer handles consistency (it always
        looks designed). Pure-AI deck tools that let the model draw
        the slides directly produce inconsistent output. Pure-template
        tools produce decks that all look identical. The split gets
        you both.
      </p>
    </Section>

    <Section>
      <H2 id="layouts">The seven layouts and when each one fires</H2>
      <ul className="ml-6 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
        <li><strong>Title</strong> — always slide 1. Bold heading, accent bar on left, subtitle in muted color.</li>
        <li><strong>Section break</strong> — every 3-4 content slides. Solid primary-color background, big white heading, &quot;01 — …&quot; numbering.</li>
        <li><strong>Bullets</strong> — the workhorse. Heading + accent underline + 3-5 short bullets with colored dots.</li>
        <li><strong>Two-column</strong> — for contrasts (&quot;what worked vs what hurt&quot;). Rounded cards on each side.</li>
        <li><strong>Stat</strong> — one huge specific number ($4.2M, 87%). Used for impact slides.</li>
        <li><strong>Quote</strong> — big curly quote mark in accent color, italic body, attribution in muted.</li>
        <li><strong>Thanks</strong> — always last slide. Same shape as title but with full primary background.</li>
      </ul>
      <p>The AI picks which layout fits each slide. A pure-bullets deck looks amateur — varying layouts is what makes a deck look designed.</p>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="The topic was too vague and the deck is generic">Vague in, vague out. &quot;Sales&quot; gets you a generic sales deck. &quot;Q4 2025 EU mid-market sales review, where we beat target on logos but missed on enterprise&quot; gets you a deck that names your specific situation. More detail = better deck.</Problem>
      <Problem title="Wrong language">The language picker is strict — Uzbek selected means Uzbek output. If you typed the topic in English and selected Uzbek, the deck is fully translated to Uzbek. If you want a mixed-language deck (Uzbek titles, English bullets), pick the dominant language and edit afterward.</Problem>
      <Problem title="Palette doesn&apos;t match brand">Pick the tone closest to your brand — Corporate for navy/dark-blue brands, Modern for teal/black, Playful for warm-color brands, Academic for traditional. If your brand color isn&apos;t in the four, generate, open in PowerPoint, hit Design → Colors → Customize, swap to your brand palette in 30 seconds.</Problem>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Topics go to Gemini for outline generation. Output .pptx files are encrypted at rest and auto-deleted within one hour. We don&apos;t store your topic after the job runs — only the resulting file row (which is deleted on the cleaner&apos;s next pass).</p>
    </Section>

    <Section>
      <H2 id="vs">How we compare to Gamma / Beautiful.ai</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left">
        <th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">Gamma</th><th className="py-2 font-bold">Beautiful.ai</th>
      </tr></thead><tbody>
        <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">Required</td><td className="py-2">Required</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Real .pptx download</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4">Paid plans only</td><td className="py-2">Paid plans only</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Free tier</td><td className="py-2 pr-4"><strong>Unlimited</strong></td><td className="py-2 pr-4">10 decks total</td><td className="py-2">Watermarked</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Languages</td><td className="py-2 pr-4"><strong>5</strong> incl. Uzbek</td><td className="py-2 pr-4">English-centric</td><td className="py-2">English-centric</td></tr>
        <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Stored</td><td className="py-2">Stored</td></tr>
      </tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Will it open in Microsoft PowerPoint?">Yes. The .pptx is standard OOXML — opens in PowerPoint 2016+, PowerPoint for Mac, PowerPoint for Web, Keynote, Google Slides, LibreOffice Impress.</Faq>
      <Faq q="Can I edit the deck afterward?">Yes — it&apos;s a normal editable .pptx. Every text box, color, and layout is editable like a hand-made deck.</Faq>
      <Faq q="How long does it take?">Usually 12–20 seconds. The bottleneck is the AI outline generation; the python-pptx rendering is sub-second.</Faq>
      <Faq q="What languages besides English?">English, Uzbek (Latin), Russian, Spanish, Arabic. Each one strictly — picked Uzbek means fully Uzbek headings, bullets, and speaker notes.</Faq>
      <Faq q="Is there a usage limit?">No daily cap on decks. The Gemini free tier supports ~250 requests/day across the whole site.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/ppt-to-pdf" className="font-semibold text-primary hover:underline">export the deck as PDF</Link>, <Link href="/chat-powerpoint" className="font-semibold text-primary hover:underline">chat with an existing deck</Link>, or <Link href="/xlsx-builder" className="font-semibold text-primary hover:underline">build an Excel sheet with AI</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const pptxBuilderPost: BlogPost = {
  slug: "how-to-build-pptx-with-ai-online-free",
  title: "How to Build a PowerPoint Deck with AI Online — Free, Type a Topic",
  description: "Type a topic — AI designs and writes a real .pptx. 5 languages, 4 tones, 5-15 slides. Free, no sign-up, no watermark.",
  date: "2021-10-04",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: ["ai powerpoint", "ai pptx generator", "ai presentation builder", "gamma alternative", "ai slide deck", "ai slides free"],
  heroEmoji: "🪄",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "how-it-works", label: "How it works" },
    { id: "layouts", label: "The 7 layouts" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs Gamma / Beautiful.ai" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
