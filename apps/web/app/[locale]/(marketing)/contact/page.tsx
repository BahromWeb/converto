import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Github, Bug, Phone, Send, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact convertpdfgo — bugs, partnerships, feedback",
  description:
    "Reach the convertpdfgo team. Bug reports, feature requests, partnership ideas, press enquiries — every message gets a real reply within a working day.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Mail,
    title: "General",
    detail: "hello@convertpdfgo.com",
    sub: "Anything that doesn't fit the boxes below.",
    href: "mailto:hello@convertpdfgo.com",
  },
  {
    icon: Bug,
    title: "Bug report",
    detail: "bugs@convertpdfgo.com",
    sub: "Tool error, missing feature, broken layout. Include the URL.",
    href: "mailto:bugs@convertpdfgo.com",
  },
  {
    icon: MessageCircle,
    title: "Press / partnerships",
    detail: "press@convertpdfgo.com",
    sub: "Quotes, interviews, brand assets, integration ideas.",
    href: "mailto:press@convertpdfgo.com",
  },
  {
    icon: Send,
    title: "Telegram channel",
    detail: "@convertpdfgo",
    sub: "Product updates, behind-the-scenes posts, fast bug pings.",
    href: "https://t.me/convertpdfgo",
  },
];

const faqShortcuts = [
  { q: "Is convertpdfgo really free?", href: "/faq#item-0" },
  { q: "What's the file size limit?", href: "/faq#item-3" },
  { q: "How long are my files stored?", href: "/faq#item-1" },
  { q: "Do I need to sign in?", href: "/faq#item-4" },
];

export default function ContactPage() {
  return (
    <div className="container py-16 lg:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Get in touch
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          We read every message.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Bug, feature request, partnership idea, or just hello — a real person
          replies within one working day. No bot, no support queue, no ticket
          number to memorise.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <Clock className="size-3.5 text-primary" />
          Avg reply time: under 12 hours
        </div>
      </div>

      {/* Channels */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2">
        {channels.map((c) => {
          const Icon = c.icon;
          const isExternal = c.href.startsWith("http");
          return (
            <a
              key={c.title}
              href={c.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-2 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <h2 className="text-base font-bold">{c.title}</h2>
              </div>
              <p className="font-mono text-sm font-semibold text-primary group-hover:underline">
                {c.detail}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">{c.sub}</p>
            </a>
          );
        })}
      </div>

      {/* Quick contact form */}
      <div className="mx-auto mt-16 max-w-2xl">
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Or send it through the form</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Goes to the same inbox as the email links above. We&apos;ll reply to
            the address you fill in.
          </p>
          <ContactForm />
        </div>
      </div>

      {/* Other ways to reach */}
      <div className="mx-auto mt-12 max-w-4xl">
        <div className="grid gap-4 rounded-2xl border bg-secondary/30 p-6 sm:grid-cols-3">
          <div>
            <Github className="size-5 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-bold">Open an issue</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              The frontend is on GitHub — bugs welcome there too.
            </p>
            <a
              href="https://github.com/convertpdfgo"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
            >
              github.com/convertpdfgo →
            </a>
          </div>
          <div>
            <Phone className="size-5 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-bold">Phone (Uzbekistan)</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Mon–Fri, 9:00–18:00 UZT.
            </p>
            <a
              href="tel:+998949105242"
              className="mt-2 inline-block font-mono text-xs font-semibold text-primary hover:underline"
            >
              +998 94 910 52 42
            </a>
          </div>
          <div>
            <MessageCircle className="size-5 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-bold">Already a question?</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Most answers are already on the FAQ page.
            </p>
            <Link
              href="/faq"
              className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
            >
              Read the FAQ →
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ shortcuts */}
      <div className="mx-auto mt-12 max-w-2xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          You might be looking for
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {faqShortcuts.map((f) => (
            <li key={f.q}>
              <Link
                href={f.href}
                className="block rounded-xl border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                {f.q}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
