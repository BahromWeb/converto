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
      Your bank sent a statement as a password-protected PDF. You opened
      it once, typed the password, read it. Now you want to merge it
      with three other statements for an accountant — but the merge tool
      can&apos;t open a locked file. You need to remove the password
      first. Here&apos;s how, in fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">When you actually need to remove a PDF password</H2>
      <p>
        Real cases: bank statements you&apos;ll re-open daily,
        archival documents you want to make searchable, files you need
        to bundle into a multi-file PDF, contracts you need to OCR for
        full-text search, government forms you want to print without
        the password prompt every time, payroll PDFs from HR that need
        to be combined into a single report.
      </p>
      <p>
        The protection served its purpose during transit. Once the file
        is on your machine and you&apos;re the only one who needs it,
        the password becomes friction. Strip it, get back a normal PDF,
        do whatever you were going to do with it.
      </p>
      <Callout icon={Lightbulb} title="The hard truth" tone="tip">
        We <strong>cannot</strong> crack passwords. AES-128 (the
        encryption protecting modern PDF passwords) is mathematically
        unbreakable without the key. This tool removes a password you
        already know — it doesn&apos;t guess one you don&apos;t.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to remove a PDF password, step by step</H2>

      <Step n={1} title="Open the Unlock PDF tool">
        Go to <Link href="/unlock" className="text-primary hover:underline">convertpdfgo.com/unlock</Link>.
        No account, no email, no installation. Loads in under a second.
      </Step>
      <Step n={2} title="Drop the locked PDF in">
        Drag the file onto the upload area or click to pick it. Files up
        to 30 MB go through without a queue. Encrypted in transit
        (TLS 1.3), encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="Type the password">
        Enter the password you&apos;d normally use to open the file.
        We try it against the PDF&apos;s stored encryption header.
        Wrong password = wrong-password error, fast.
      </Step>
      <Step n={4} title="Click Unlock">
        We decrypt the file using your password, then save it back as a
        plain PDF. Total time: 2–4 seconds.
      </Step>
      <Step n={5} title="Download the open PDF">
        The output is a normal .pdf with no password prompt. Open it,
        merge it, OCR it, print it — anything that the locked version
        wouldn&apos;t let you do.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What &quot;unlock&quot; actually means (and doesn&apos;t)</H2>
      <p>
        <strong>Works:</strong> removing the password from a PDF you
        legitimately have access to. The math of password-based
        encryption requires the password to decrypt — once decrypted,
        the file is plain bytes again.
      </p>
      <p>
        <strong>Doesn&apos;t work:</strong> cracking passwords you
        don&apos;t know. AES-128 has 2^128 possible keys.
        Brute-forcing through them would take longer than the age of
        the universe. Anyone offering &quot;PDF password crack&quot;
        services is either lying, charging for slow dictionary attacks
        that only work on weak passwords, or doing something illegal.
      </p>
      <p>
        <strong>Mostly doesn&apos;t work:</strong> bypassing permission
        passwords (&quot;owner&quot; passwords as distinct from
        &quot;user&quot; passwords). Some PDFs have a second-tier
        password that only restricts printing / copying / editing,
        not opening. Standards-compliant readers respect these
        restrictions, but they&apos;re trivially bypassable by any
        tool that doesn&apos;t play by the rules.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common unlock problems and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> &quot;Wrong password&quot; but I&apos;m sure it&apos;s right</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Check Caps Lock and special characters. Some keyboards
          autocomplete or capitalize the first letter; passwords are
          case-sensitive and exact. If you copy-paste, watch for
          trailing spaces that some apps add invisibly.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> I forgot the password</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We can&apos;t help. AES is one-way without the key. Check
          your password manager, sent emails, or ask the original
          sender for a re-send with the password. The math is harsher
          than UX intuition: there&apos;s no &quot;forgot password&quot;
          link.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> PDF says &quot;owner password required&quot;</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          That&apos;s a permission lock, not an open lock — the file
          opens fine, but restricts editing / printing / copying. Try
          opening in Chrome / Edge; both ignore owner-only restrictions
          and let you save a clean copy.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> File is corrupted</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sometimes a partial download or an old PDF version produces
          a malformed file. Try downloading again from the original
          source, or open in Adobe Reader first — Reader sometimes
          fixes malformed PDFs on save.
        </p>
      </div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy and the law</H2>
      <p>
        Privacy: the file and the password you type go over TLS 1.3.
        We don&apos;t log passwords. Output PDFs are deleted within one
        hour.
      </p>
      <p>
        Law: removing a password from a PDF <em>you own</em> or that was
        <em> sent to you with the password</em> is unambiguously
        legal. Removing a password from a PDF you obtained without
        authorisation is not. Computer-misuse and unauthorised-access
        laws apply globally. Use the tool for your own files and files
        you&apos;ve been given access to — not anyone else&apos;s.
      </p>
      <Callout icon={AlertTriangle} title="If the file isn't yours" tone="warn">
        Don&apos;t. The math doesn&apos;t care about legality, but the
        courts do. If you don&apos;t have the password, ask the
        sender for a clean version — that&apos;s legal and works.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF unlock tools</H2>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-bold">Feature</th>
              <th className="py-2 pr-4 font-bold">convertpdfgo</th>
              <th className="py-2 pr-4 font-bold">Smallpdf (free)</th>
              <th className="py-2 font-bold">iLovePDF (free)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Cracks unknown passwords?</td><td className="py-2 pr-4"><strong>No</strong></td><td className="py-2 pr-4">No</td><td className="py-2">No</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Password logged?</td><td className="py-2 pr-4"><strong>Never</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">Vague</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Can you crack PDF passwords?">
        No. AES-128 with a reasonable password is mathematically
        unbreakable. We only remove passwords you already know.</Faq>
      <Faq q="What if I get the password wrong?">
        We surface a clear &quot;wrong password&quot; error. Try again
        with the correct one. Watch for Caps Lock and trailing spaces.</Faq>
      <Faq q="What about owner-only restrictions (no print / no copy)?">
        Most readers honour these. Open in Chrome to bypass — Chrome
        ignores owner restrictions and lets you save a clean copy.</Faq>
      <Faq q="Does the unlocked PDF look different?">
        No. Identical content, same fonts, same images — just no
        password prompt when opening.</Faq>
      <Faq q="How long does it take?">
        About 1–3 seconds per file. Encryption overhead is small.</Faq>
      <Faq q="What's the file size limit?">
        30 MB per upload as a guest, 50 MB when signed in.</Faq>
      <Faq q="Is there a usage limit?">
        No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">
        Now that the PDF is unlocked, you can{" "}
        <Link href="/merge" className="font-semibold text-primary hover:underline">merge with other PDFs</Link>,{" "}
        <Link href="/compress" className="font-semibold text-primary hover:underline">compress it</Link>,{" "}
        <Link href="/ocr" className="font-semibold text-primary hover:underline">OCR for searchable text</Link>,{" "}
        <Link href="/sign" className="font-semibold text-primary hover:underline">sign it</Link>, or{" "}
        <Link href="/protect" className="font-semibold text-primary hover:underline">re-protect with a new password</Link>. All free.
      </Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const unlockPdfPost: BlogPost = {
  slug: "how-to-unlock-a-pdf-online-free",
  title: "How to Remove a PDF Password Online — Free, No Watermark",
  description: "Remove the password from any PDF you have the password for — fast, free, no sign-up, no watermark. Step-by-step guide, what 'unlock' actually means, common problems, comparison vs Smallpdf and iLovePDF.",
  date: "2021-09-25",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: ["unlock pdf", "remove pdf password", "decrypt pdf", "unlock pdf online free", "pdf password remover", "remove password from pdf", "decrypt pdf online"],
  heroEmoji: "🔓",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "behind", label: "What 'unlock' means" },
    { id: "problems", label: "Common problems" },
    { id: "privacy", label: "Privacy + law" },
    { id: "vs", label: "vs Smallpdf / iLovePDF" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
