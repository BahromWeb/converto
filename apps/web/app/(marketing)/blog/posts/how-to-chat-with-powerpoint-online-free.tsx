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
    <Lead>A 70-slide quarterly review deck holds five takeaways your CEO actually wants. A vendor's 40-slide pitch has the one pricing slide you need to forward to finance. Skimming decks is the meeting-prep tax — and chat-with-PowerPoint cuts it to seconds, with citations to specific slides.</Lead>

    <Section>
      <H2 id="why">When you actually need Chat with PowerPoint</H2>
      <p>Executive prep before quarterly reviews, sales teams summarising prospect decks, students mining lecture slides for exam answers, marketing pulling customer quotes from case-study decks, board observers extracting talking points from long materials.</p>
    </Section>

    <Section>
      <H2 id="how">How to chat with powerpoint, step by step</H2>
      <Step n={1} title="Open the tool">Go to <Link href="/chat-powerpoint" className="text-primary hover:underline">convertpdfgo.com/chat-powerpoint</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the file in">Drag a slide deck (PPTX, PPT, ODP) onto the upload area. Up to 30 MB. Each slide becomes an indexed page — citations land on the exact slide number.</Step>
      <Step n={3} title="Wait a few seconds while we index">Slides are rendered to PDF pages with speaker notes preserved. Embedded chart data isn't readable as numbers but the chart image is still visible to the model.</Step>
      <Step n={4} title="Ask">Type the question. Get a cited answer back in 1-3 seconds.</Step>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="Summary is too generic">Generic prompts get generic answers. "Summarise" returns 3-4 sentences of high-level themes. For deeper output ask: "List the top 5 takeaways with the slide each comes from" — that returns specific points and citations.</Problem>
      <Problem title="Quote from speaker notes missing">Speaker notes are indexed but only if they exist. Many decks ship with empty notes. If a quote isn't in notes, it's probably on a slide — try asking for it without specifying "speaker notes".</Problem>
      <Problem title="Chart data not extractable">Charts are converted to images during the PDF pipeline. The AI sees the chart visually but can't recite individual data points. For chart data, use the source Excel file with Chat with Excel.</Problem>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Three things to know. <strong>One</strong>: files go over TLS 1.3. <strong>Two</strong>: files are encrypted at rest while we process them, then deleted automatically within one hour. <strong>Three</strong>: we don&apos;t look at your files or train on them. Conversations stay tied to your session.</p>
    </Section>

    <Section>
      <H2 id="vs">How we compare to ChatGPT / Claude attachments</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left">
        <th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">ChatGPT</th><th className="py-2 font-bold">Claude</th>
      </tr></thead><tbody>
        <tr className="border-b"><td className="py-2 pr-4">Sign-up required</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> No</td><td className="py-2 pr-4">Yes</td><td className="py-2">Yes</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Page citations inline</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Always</td><td className="py-2 pr-4">Sometimes</td><td className="py-2">Sometimes</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Multilingual responses</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> Yes</td><td className="py-2 pr-4">Yes</td><td className="py-2">Yes</td></tr>
        <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Up to 30 days</td><td className="py-2">Vague</td></tr>
      </tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Does it read speaker notes?">Yes — speaker notes are extracted during conversion and indexed alongside slide content. The AI can quote from them and citations show the slide number the notes belong to.</Faq>
      <Faq q="Embedded videos and audio?">No — media inside slides is dropped during conversion. The AI sees text, charts (as images), and notes.</Faq>
      <Faq q="Are my files private?">Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour.</Faq>
      <Faq q="Will it work on protected files?">Not directly — unlock the file first with our Unlock tool if it's a password-protected PDF.</Faq>
      <Faq q="Is there a usage limit?">No daily cap on questions. The Gemini free tier supports ~250 questions/day across the whole site — if we hit it, you'll see a brief message asking you to wait or sign in with your own key.</Faq>
      <Faq q="How long does it take?">Indexing: 5-30 seconds depending on file size. Each question: 1-3 seconds for the streamed answer to start.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/chat" className="font-semibold text-primary hover:underline">Chat with PDF</Link>, <Link href="/pdf-to-ppt" className="font-semibold text-primary hover:underline">PDF to PowerPoint</Link>, or <Link href="/ppt-to-pdf" className="font-semibold text-primary hover:underline">PowerPoint to PDF</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const chatPowerPointPost: BlogPost = {
  slug: "how-to-chat-with-powerpoint-online-free",
  title: "How to Chat with a PowerPoint Deck Online — Free, Slide-Accurate Citations",
  description: "Summarise decks, pull quotes from slides, search speaker notes. Citations point at exact slide numbers. Free, no sign-up.",
  date: "2021-08-24",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 8,
  keywords: ["chat with powerpoint", "ask presentation", "pptx chat", "powerpoint ai", "deck summary ai", "slides chatbot"],
  heroEmoji: "🎞️",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs ChatGPT / Claude" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
