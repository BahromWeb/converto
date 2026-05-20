import Link from "next/link";
import { Button } from "@converto/ui/components/button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center text-center bg-background">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">404 · Lost page</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight">Not in the admin.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist in the admin console.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to dashboard</Link>
      </Button>
    </section>
  );
}
