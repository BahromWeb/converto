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
    <Lead>A 60-page Word contract has three clauses you actually care about — termination, governing law, payment terms. A 100-page thesis has the one definition you need to cite in your paper. Manually skimming is half an hour; asking the document directly is fifteen seconds — with page citations that you can verify in the open document.</Lead>

    <Section>
      <H2 id="why">When you actually need Chat with Word</H2>
      <p>Legal teams scanning long contracts for specific clauses, students querying lecture notes saved as DOCX, recruiters extracting skills from candidate Word resumes, researchers pulling statistics from departmental reports.</p>
    </Section>

    <Section>
      <H2 id="how">How to chat with word, step by step</H2>
      <Step n={1} title="Open the tool">Go to <Link href="/chat-word" className="text-primary hover:underline">convertpdfgo.com/chat-word</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the file in">Drag a Word file (DOCX, DOC, RTF, or ODT) onto the upload area. Up to 30 MB. The file goes over TLS 1.3, gets encrypted at rest, and is deleted within one hour.</Step>
      <Step n={3} title="Wait a few seconds while we index">We use Gotenberg to render the document to PDF, then chunk it page-by-page and embed each chunk with Gemini. Tracked changes are flattened to the visible version.</Step>
      <Step n={4} title="Ask">Type the question. Get a cited answer back in 1-3 seconds.</Step>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="Tracked changes mess up the answer">Word's tracked changes get flattened during PDF conversion — the AI sees the visible (post-change) version. If you want answers based on the original draft, decline changes first. If you want the proposed-edit text, accept first.</Problem>
      <Problem title="Footnotes cite the wrong page">Word and PDF treat footnotes differently. The footnote text gets indexed but the citation points at the body-text page (where the superscript appears), not the footer page where the footnote sits.</Problem>
      <Problem title="Tables read as a wall of text">Multi-column tables lose alignment during PDF conversion. For data-heavy tables, use Chat with Excel instead — Excel tables keep their column structure.</Problem>
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
      <Faq q="Does it work on tracked-changes documents?">Yes — tracked changes are flattened during PDF conversion, so the AI sees the current visible text. If you want the AI to also see proposed edits, accept the changes in Word first.</Faq>
      <Faq q="What about footnotes and tables?">Footnotes are indexed and citeable. Simple tables are read row-by-row; complex multi-column tables sometimes lose alignment — quoting from those, expect the cited row to be approximate.</Faq>
      <Faq q="Are my files private?">Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour. Conversations are tied to your session and not used for training.</Faq>
      <Faq q="Will it work on protected files?">Not directly — unlock the file first with our Unlock tool if it's a password-protected PDF.</Faq>
      <Faq q="Is there a usage limit?">No daily cap on questions. The Gemini free tier supports ~250 questions/day across the whole site — if we hit it, you'll see a brief message asking you to wait or sign in with your own key.</Faq>
      <Faq q="How long does it take?">Indexing: 5-30 seconds depending on file size. Each question: 1-3 seconds for the streamed answer to start.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/chat" className="font-semibold text-primary hover:underline">Chat with PDF</Link>, <Link href="/pdf-to-word" className="font-semibold text-primary hover:underline">PDF to Word</Link>, or <Link href="/extract-text" className="font-semibold text-primary hover:underline">Extract Text</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const chatWordPost: BlogPost = {
  slug: "how-to-chat-with-word-document-online-free",
  title: "How to Chat with a Word Document Online — Free, Cited Answers",
  description: "Drop a DOCX, DOC, or RTF and ask questions in plain English (or Uzbek, Russian). Answers cite the exact page. Free, no sign-up.",
  date: "2021-09-22",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 8,
  keywords: ["chat with word", "chat with docx", "ask word document", "word doc ai", "word chatbot", "docx chat online free"],
  heroEmoji: "📄",
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
