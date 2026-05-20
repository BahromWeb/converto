import Link from "next/link";
import { Button } from "@converto/ui/components/button";

export default function NotFound() {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">404 · Lost page</p>
      <h1 className="mt-4 font-serif text-6xl">This file isn&apos;t here.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for either moved, never existed, or got compressed into oblivion.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back home</Link>
      </Button>
    </section>
  );
}
