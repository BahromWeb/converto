import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";

export const metadata: Metadata = { title: "Sign In" };

export default function AccountPage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="block h-3 w-3 rounded-sm bg-primary-foreground" />
              <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-foreground" />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">converto</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="mt-8 p-8">
          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Password</label>
              <input
                type="password"
                placeholder="Your password"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button size="lg" className="w-full">
              Sign in →
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Sign up free
            </a>
          </p>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
