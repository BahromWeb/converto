import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Get in touch</h1>
        <p className="mt-4 text-muted-foreground">
          Have a question, found a bug, or want to share feedback? We'd love to hear from you.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
