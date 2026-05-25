"use client";

import Link from "next/link";
import { Button } from "@converto/ui/components/button";
import { useT } from "@/lib/i18n/context";

export default function NotFound() {
  const t = useT();

  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{t.notFound.label}</p>
      <h1 className="mt-4 font-serif text-6xl">{t.notFound.heading}</h1>
      <p className="mt-4 max-w-md text-muted-foreground">{t.notFound.body}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t.notFound.backHome}</Link>
      </Button>
    </section>
  );
}
