"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { api } from "@/lib/api";

type Phase = "idle" | "sending" | "done" | "failed";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  const tooShortMessage = message.length > 0 && message.length < 5;
  const canSubmit =
    name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    message.trim().length >= 5;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setPhase("sending");
    setError(null);
    try {
      await api.post("/api/contact", {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setPhase("done");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setPhase("failed");
    }
  }

  if (phase === "done") {
    return (
      <Card className="mt-10 flex flex-col items-center gap-4 p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-7 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">Message sent</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanks — we'll get back to you within 1–2 business days.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
          Send another
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mt-10 p-8">
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={255}
              required
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind…"
            minLength={5}
            maxLength={8000}
            required
            className={`mt-2 w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none ${
              tooShortMessage
                ? "border-destructive focus:border-destructive"
                : "border-border focus:border-primary focus:ring-1 focus:ring-primary"
            }`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {message.length}/8000 · at least 5 characters
          </p>
        </div>

        {phase === "failed" && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <AlertCircle className="mt-0.5 size-4 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Couldn't send</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        <Button size="lg" type="submit" disabled={!canSubmit || phase === "sending"}>
          {phase === "sending" ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" />
              Send message →
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
