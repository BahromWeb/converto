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
    <Lead>A 200-page contract holds three answers you actually need. A research paper has one statistic to quote. Manually skimming the document is half an hour; asking it directly is fifteen seconds. The trick is the answers cite their sources — so you can verify before you trust.</Lead>

    <Section>
      <H2 id="why">When you actually need Chat with PDF</H2>
      <p>Legal teams asking contracts for specific clauses, students querying textbooks for definitions, analysts pulling statistics from government reports, recruiters scanning resumes for specific skills.</p>
    </Section>

    <Section>
      <H2 id="how">How to chat with pdf, step by step</H2>
      <Step n={1} title="Open the tool">Go to <Link href="/chat" className="text-primary hover:underline">convertpdfgo.com/chat</Link>. No account, no email, no installation.</Step>
      <Step n={2} title="Drop the file in">Drag the file onto the upload area or click to pick. Files up to 30 MB go through without a queue. Encrypted in transit (TLS 1.3), encrypted at rest, deleted within one hour.</Step>
      <Step n={3} title="Configure">Type your question. The AI scans the document and returns an answer with citations.</Step>
      <Step n={4} title="Download">Open in any reader, paste anywhere, feed to scripts.</Step>
    </Section>

    <Section>
      <H2 id="problems">Common problems and how to avoid them</H2>
      <Problem title="Answer says 'not in the document' but you think it is">Try rewording. The system matches semantically, not by exact phrase. 'When does the contract end' may not match 'termination date' on its first pass.</Problem>
      <Problem title="Wrong page cited">Click through to verify. The cited page contains the strongest match, but adjacent pages may have the full context. If the citation is wrong, the answer is suspect.</Problem>
      <Problem title="Scanned PDF returns blank">It's all images — there's no text to query. OCR the file first with our OCR tool, then chat.</Problem>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>Three things to know. <strong>One</strong>: files go over TLS 1.3. <strong>Two</strong>: files are encrypted at rest while we process them, then deleted automatically within one hour. <strong>Three</strong>: we don&apos;t look at your files or train on them.</p>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free tools</H2>
      <div className="my-6 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left">
        <th className="py-2 pr-4 font-bold">Feature</th><th className="py-2 pr-4 font-bold">convertpdfgo</th><th className="py-2 pr-4 font-bold">Smallpdf</th><th className="py-2 font-bold">iLovePDF</th>
      </tr></thead><tbody>
        <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
        <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
        <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
      </tbody></table></div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Does it hallucinate?">Less than a general-purpose chat. We restrict the answers to the document content and every claim cites the page it came from. If you can't find the cited passage, the answer is wrong — easy to verify.</Faq>
      <Faq q="How does it handle large PDFs?">We chunk and index the document at upload time, then retrieve only the relevant chunks at query time. A 200-page contract works the same as a 5-page memo.</Faq>
      <Faq q="Are my files private?">Files are encrypted in transit (TLS 1.3) and at rest, then auto-deleted within one hour. Conversations are tied to your session and not used for training.</Faq>
      <Faq q="Will it work on protected PDFs?">Not directly — unlock the PDF first with our Unlock PDF tool if you know the password.</Faq>
      <Faq q="Is there a usage limit?">No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
      <Faq q="How long does it take?">About 5-30 seconds depending on file size and OCR complexity. Multi-page scans take longer.</Faq>
      <Faq q="What&apos;s the file size limit?">30 MB as a guest, 50 MB when signed in.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout>Now you can <Link href="/extract-text" className="font-semibold text-primary hover:underline">Extract Text</Link>, <Link href="/pdf-to-word" className="font-semibold text-primary hover:underline">PDF to Word</Link>, or <Link href="/ocr" className="font-semibold text-primary hover:underline">OCR PDF</Link>. All free.</Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const chatPdfPost: BlogPost = {
  slug: "how-to-chat-with-pdf-online-free",
  title: "How to Chat with a PDF Online — Free, With Citations, No Sign-up",
  description: "Ask questions of any PDF in plain English. Get answers with citations to the source page. Free, no sign-up, no watermark.",
  date: "2021-02-22",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 8,
  keywords: ["chat with pdf", "ask questions pdf", "pdf chatbot", "talk to pdf", "chat with pdf online free", "pdf ai"],
  heroEmoji: "💬",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs Smallpdf / iLovePDF" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
