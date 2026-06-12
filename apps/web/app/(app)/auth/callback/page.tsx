"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { setTokens } from "@/lib/api";

// Swagger: GET /auth/google/callback returns { access_token, refresh_token } either
// in the query string or in the URL hash, depending on backend OAuth config.
// We handle both, store the tokens via setTokens(), and force a *full* page
// navigation back to /. The full reload is intentional — AuthProvider
// hydrates user state from localStorage only on initial mount, so a
// router.replace() (SPA navigation) leaves the user state as `null` even
// though the token is sitting in localStorage. window.location.href forces
// a fresh React tree where AuthProvider sees the token and fetches /me.

function CallbackHandler() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(
      typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "",
    );

    const getParam = (key: string) => params.get(key) ?? hashParams.get(key);

    const err = getParam("error");
    if (err) {
      setError("Authentication failed. Please try again.");
      return;
    }

    const accessToken = getParam("access_token");
    const refreshToken = getParam("refresh_token");
    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      // Optional: respect a `redirect` param so the OAuth flow can deep-link
      // a user back to a tool page after sign-in.
      const next = getParam("redirect") || "/account";
      // Hard nav so AuthProvider re-hydrates from the freshly-stored token.
      window.location.href = next;
      return;
    }

    // No tokens in the URL — bail back to the sign-in page so the user
    // can retry instead of getting silently dropped on the home page.
    window.location.href = "/account";
  }, [params]);

  if (error) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center">
        <p className="text-destructive">{error}</p>
        <a href="/account" className="mt-4 text-sm text-primary underline">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-[70vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
