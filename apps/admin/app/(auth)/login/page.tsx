import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Users, BarChart3 } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Input } from "@converto/ui/components/input";
import { Label } from "@converto/ui/components/label";

export const metadata: Metadata = { title: "Sign in" };

const features = [
  { icon: BarChart3, label: "Real-time analytics" },
  { icon: Users, label: "User management" },
  { icon: Zap, label: "Live job pipeline" },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel — brand */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-foreground p-12 lg:flex">
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary">
            <span className="block h-3.5 w-3.5 rounded-sm bg-white" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">converto</span>
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
            admin
          </span>
        </Link>

        {/* Content */}
        <div className="relative z-10 max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Operations console
          </span>
          <h2 className="mt-5 text-5xl font-bold leading-tight tracking-tight text-white">
            One workspace.
            <br />
            <span className="text-primary">Every operation.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/60">
            Users, jobs, tools, analytics — every system in one place. Built for the team
            that runs the platform.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap gap-3">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/80"
              >
                <Icon className="size-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="relative flex items-center gap-2 text-xs text-white/30">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Since 2022 · All systems normal
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
              <span className="block h-3 w-3 rounded-sm bg-white" />
            </span>
            <span className="font-bold tracking-tight">converto admin</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your admin credentials to continue.
          </p>

          <form className="mt-8 space-y-5" action="/" method="post">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@converto.com"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <Link
                  href="/forgot"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-11"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-2.5 rounded-xl bg-secondary p-4 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            Protected by single sign-on · SOC 2 Type II certified
          </div>
        </div>
      </div>
    </div>
  );
}
