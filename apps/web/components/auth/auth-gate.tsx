"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@converto/ui/components/button";
import Link from "next/link";

/**
 * AuthGate wraps a page's content and either renders it (signed-in) or
 * redirects to /account with ?redirect=<current path> so the OAuth flow
 * lands the user back where they started.
 *
 * Used for the AI-powered tools (chat with PDF/Word/Excel/PowerPoint,
 * OCR family, language detection) — those rely on a per-user history
 * and quota, so guests are routed through sign-in first.
 *
 * While the auth context is hydrating from localStorage we show a
 * spinner instead of flashing the gated UI; signed-out users see a
 * brief "redirecting…" notice with a manual link in case the redirect
 * is blocked.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || user) return;
    const redirect = encodeURIComponent(pathname || "/");
    router.replace(`/account?redirect=${redirect}`);
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    // Show a friendly placeholder while the redirect is in flight — if
    // a browser extension or middleware blocks the auto-redirect, the
    // explicit Sign in button still gets the user where they need to go.
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Sign in to use this tool</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            AI features run on your account so we can track history and
            quota. Free to register — Google or GitHub in one click.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={`/account?redirect=${encodeURIComponent(pathname || "/")}`}>
            Sign in to continue
          </Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
