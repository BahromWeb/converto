"use client";

import Link from "next/link";
import { SignInCard } from "@/components/auth/sign-in-card";
import { useT } from "@/lib/i18n/context";

export default function AccountPage() {
  const t = useT();

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
          <h1 className="mt-6 text-2xl font-bold text-foreground">{t.auth.welcomeBack}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.auth.signInSubtitle}</p>
        </div>

        <SignInCard className="mt-8" />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t.auth.agreePrefix}{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            {t.auth.terms}
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            {t.auth.privacyPolicy}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
