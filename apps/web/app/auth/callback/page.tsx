"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setTokens } from "@/lib/api";

// Swagger: GET /auth/google/callback returns { access_token, refresh_token } directly.
// Backend may also return tokens as query params depending on OAuth flow config.
// This page handles both cases.

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse both query string (?key=val) and hash fragment (#key=val)
    const hashParams = new URLSearchParams(
      typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : ""
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
      router.replace("/");
      return;
    }

    router.replace("/");
  }, [params, router]);

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
