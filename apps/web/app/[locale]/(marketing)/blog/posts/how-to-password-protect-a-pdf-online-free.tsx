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
      You drafted a contract, a salary letter, a payroll spreadsheet. Now
      you need to email it to one specific person without worrying about
      it being forwarded to twelve others. Add a password to the PDF
      before you send it — the recipient unlocks it, the wider world
      can&apos;t. Here&apos;s how, in fifteen seconds.
    </Lead>

    <Section>
      <H2 id="why">When you actually need a PDF password</H2>
      <p>
        Real cases: emailing payroll spreadsheets to accounting, sending
        a salary offer letter to a candidate, attaching a tax return to
        a loan application, shipping board materials to directors,
        forwarding medical records to a specialist, or any document
        that&apos;d be a problem if the wrong person opened it.
      </p>
      <p>
        A password on a PDF doesn&apos;t prevent forwarding — anyone with
        the password can still re-share the file. What it does prevent
        is <em>accidental</em> exposure: an email going to the wrong
        recipient, a forgotten USB stick, a backup ending up on a
        cloud bucket. The recipient has to know the password to read
        the file, and you control who has the password.
      </p>
      <Callout icon={Lightbulb} title="The rule we tell every customer" tone="tip">
        Send the file and the password through <strong>two different
        channels</strong>. Email the PDF, text the password.
        Slack the PDF, WhatsApp the password. Same channel = no
        protection if the channel is breached.
      </Callout>
    </Section>

    <Section>
      <H2 id="how">How to password-protect a PDF, step by step</H2>

      <Step n={1} title="Open the Protect PDF tool">
        Go to <Link href="/protect" className="text-primary hover:underline">convertpdfgo.com/protect</Link>.
        No account, no email, no installation. Loads in under a second.
      </Step>
      <Step n={2} title="Drop the PDF in">
        Drag the file onto the upload area or click to pick it. Files up
        to 30 MB go through without a queue. Encrypted in transit
        (TLS 1.3), encrypted at rest, deleted within one hour.
      </Step>
      <Step n={3} title="Type a password">
        Pick something you&apos;ll remember and the recipient can be told.
        Aim for 12+ characters mixing case + numbers (e.g.{" "}
        <code>Mango-7-Truck</code>). Avoid words from the document
        itself — &quot;Q4Sales2026!&quot; is what someone trying to
        guess would try first.
      </Step>
      <Step n={4} title="Click Protect">
        We encrypt the PDF with AES-128 — the same algorithm Adobe
        Acrobat uses by default. Output is a normal-looking .pdf
        that prompts for the password whenever it&apos;s opened.
      </Step>
      <Step n={5} title="Send password separately">
        Email the locked PDF. Text the password. The recipient enters
        the password in their PDF reader and the file opens.
      </Step>
    </Section>

    <Section>
      <H2 id="behind">What AES-128 actually protects against</H2>
      <p>
        Strong: random brute-force attempts. AES-128 has 2^128 possible
        keys — even with billion-attempts-per-second computing,
        guessing one would take longer than the age of the universe.
        Practically unbreakable from a math standpoint.
      </p>
      <p>
        Strong: accidental exposure. If the file lands in someone&apos;s
        inbox by mistake, they see &quot;PDF requires password&quot;
        and can&apos;t poke around.
      </p>
      <p>
        Weak: weak passwords. Encryption only protects what the key
        protects. If the password is <code>password1</code> or the
        company name + year, any half-decent attacker breaks it in
        seconds with a dictionary attack. The encryption math
        isn&apos;t broken — the password is.
      </p>
      <p>
        Weak: forwarding by an authorised recipient. Once the legit
        recipient opens the file, they can save it, screenshot it,
        forward it. AES protects against eavesdroppers, not against
        people who know the key.
      </p>
    </Section>

    <Section>
      <H2 id="problems">Common protection mistakes and how to avoid them</H2>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Sending the password in the same email</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If the email is intercepted, both the file and the key go
          together. Defeats the purpose entirely. Use a separate channel
          — SMS, Signal, in-person.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Using the company name + year as password</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          &quot;Acme2026&quot;, &quot;Acme!&quot;, &quot;Acme@2026&quot;
          are the first 10 things an attacker tries. Use a passphrase
          with random words instead: &quot;Mango-7-Truck&quot; is
          stronger than &quot;Acme2026!&quot; and easier to remember.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Forgetting the password yourself</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          AES is unbreakable, which means <em>you</em> also can&apos;t
          recover it. Save the password in a password manager (1Password,
          Bitwarden, Apple Keychain) the moment you set it. If you lose
          it, the file is permanently locked.
        </p>
      </div>

      <div className="my-6 rounded-2xl border bg-card p-5">
        <p className="flex items-center gap-2 font-bold"><XCircle className="size-4 text-destructive" /> Re-protecting an already-protected PDF</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can&apos;t add a second password to a file that&apos;s
          already locked. Remove the first password via{" "}
          <Link href="/unlock" className="text-primary hover:underline">our unlock tool</Link>{" "}
          (using the original password), then re-protect with the new
          one.
        </p>
      </div>
    </Section>

    <Section>
      <H2 id="privacy">A short word on privacy</H2>
      <p>
        Three things to know. <strong>One</strong>: the file and the
        password go over TLS 1.3. <strong>Two</strong>: files are
        encrypted at rest while we process them, then deleted within
        one hour. We never log the passwords you type. <strong>Three</strong>:
        once the locked PDF is downloaded, the password lives only with
        you and the recipient — we don&apos;t store it anywhere.
      </p>
      <Callout icon={AlertTriangle} title="One last reminder" tone="warn">
        We can&apos;t recover lost passwords. Save them in a password
        manager the moment you set them. Lost = locked forever.
      </Callout>
    </Section>

    <Section>
      <H2 id="vs">How we compare to other free PDF protection tools</H2>
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
            <tr className="border-b"><td className="py-2 pr-4">Encryption</td><td className="py-2 pr-4"><strong>AES-128</strong></td><td className="py-2 pr-4">AES-128</td><td className="py-2">AES-128</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Sign-up</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4">After 2/day</td><td className="py-2">Optional</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Watermark</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2 pr-4"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td><td className="py-2"><CheckCircle2 className="inline size-4 text-emerald-600" /> None</td></tr>
            <tr className="border-b"><td className="py-2 pr-4">Password logged?</td><td className="py-2 pr-4"><strong>Never</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">Vague</td></tr>
            <tr><td className="py-2 pr-4">Auto-delete</td><td className="py-2 pr-4"><strong>1 hour</strong></td><td className="py-2 pr-4">Vague</td><td className="py-2">2 hours</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section>
      <H2 id="faq">Frequently asked questions</H2>
      <Faq q="Will Adobe Acrobat / Preview / Chrome respect the password?">
        Yes — any standards-compliant PDF reader prompts for the password before showing the content. Adobe Reader, Preview, Chrome, Edge, Firefox, mobile readers all honour AES-128 PDF passwords.</Faq>
      <Faq q="Can I lock just printing but allow reading?">
        Not in this tool — we set a single &quot;open password&quot;.
        For permission-only locks (print / copy / edit), Adobe Acrobat
        Pro is the standard.
      </Faq>
      <Faq q="What's the maximum password length?">
        128 characters. We recommend 12+ characters with mixed case + digits.</Faq>
      <Faq q="Does it work for scanned PDFs?">
        Yes — encryption protects the file bytes, not the content type.
        Scanned PDFs lock the same as text PDFs.</Faq>
      <Faq q="How long does it take?">
        About 1 second per MB. A 5 MB PDF takes ~5 seconds.</Faq>
      <Faq q="Is there a usage limit?">
        No. Free, no daily cap, no sign-up wall, no watermark.</Faq>
      <Faq q="Can I unlock the PDF later?">
        Yes — use <Link href="/unlock" className="text-primary hover:underline">our Unlock PDF tool</Link>{" "}
        with the same password. The tool removes the encryption, the
        text returns to plain readability.</Faq>
    </Section>

    <Section>
      <H2 id="next">What to do next</H2>
      <Callout icon={Sparkles} title="One-click follow-ups" tone="info">
        After protecting, you can{" "}
        <Link href="/sign" className="font-semibold text-primary hover:underline">sign the PDF first</Link>,{" "}
        <Link href="/watermark" className="font-semibold text-primary hover:underline">stamp it CONFIDENTIAL</Link>,{" "}
        <Link href="/compress" className="font-semibold text-primary hover:underline">compress before emailing</Link>, or{" "}
        <Link href="/unlock" className="font-semibold text-primary hover:underline">unlock it later when you don&apos;t need the password</Link>. All free.
      </Callout>
      <p>Or browse <Link href="/tools" className="text-primary hover:underline">our full list of 49 free PDF tools</Link>.</p>
    </Section>
  </>
);

export const protectPdfPost: BlogPost = {
  slug: "how-to-password-protect-a-pdf-online-free",
  title: "How to Password-Protect a PDF Online — Free, AES-128, No Watermark",
  description: "Add a password to any PDF — AES-128 encryption, the same algorithm Adobe Acrobat uses. Free, no sign-up, no watermark. Step-by-step guide, what passwords actually protect against, common mistakes, comparison vs Smallpdf and iLovePDF.",
  date: "2021-09-08",
  modified: "2026-06-01",
  author: "convertpdfgo team",
  tag: "Guide",
  readingMinutes: 9,
  keywords: ["protect pdf", "password protect pdf", "add password to pdf", "encrypt pdf", "lock pdf", "protect pdf online free", "pdf password"],
  heroEmoji: "🔒",
  toc: [
    { id: "why", label: "When you need it" },
    { id: "how", label: "Step-by-step" },
    { id: "behind", label: "What AES-128 protects" },
    { id: "problems", label: "Common mistakes" },
    { id: "privacy", label: "Privacy notes" },
    { id: "vs", label: "vs Smallpdf / iLovePDF" },
    { id: "faq", label: "FAQ" },
    { id: "next", label: "What to do next" },
  ],
  body: Body,
};
