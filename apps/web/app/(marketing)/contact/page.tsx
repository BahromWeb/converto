import type { Metadata } from "next";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Get in touch</h1>
        <p className="mt-4 text-muted-foreground">
          Have a question, found a bug, or want to share feedback? We'd love to hear from you.
        </p>

        <Card className="mt-10 p-8">
          <form className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-foreground">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Message</label>
              <textarea
                rows={5}
                placeholder="Tell us what's on your mind…"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button size="lg">Send message →</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
