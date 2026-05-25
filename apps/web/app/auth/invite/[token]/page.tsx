"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@converto/ui/components/card";
import { Button } from "@converto/ui/components/button";
import { useAuth, type InviteInfo } from "@/lib/auth/context";

type State = "loading" | "ready" | "submitting" | "error";

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { getInviteInfo, acceptInvite } = useAuth();

  const [state, setState] = useState<State>("loading");
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");

  // GET /auth/invite/{token} — resolve the invite
  useEffect(() => {
    getInviteInfo(token).then((info) => {
      if (!info) {
        setState("error");
      } else {
        setInvite(info);
        setState("ready");
      }
    });
  }, [token, getInviteInfo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError("");
    setServerError("");

    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setFieldError("Passwords do not match");
      return;
    }

    setState("submitting");
    try {
      // POST /auth/accept-invite → sets tokens + fetches user
      await acceptInvite(token, password);
      router.replace("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setState("ready");
    }
  }

  if (state === "loading") {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading invite…</p>
      </div>
    );
  }

  if (state === "error" || !invite) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center">
        <p className="text-destructive">This invite link is invalid or has expired.</p>
        <Link href="/" className="mt-4 text-sm text-primary underline">
          Go home
        </Link>
      </div>
    );
  }

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
          <h1 className="mt-6 text-2xl font-bold text-foreground">Accept your invite</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You've been invited as <span className="font-semibold text-foreground">{invite.role}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{invite.email}</p>
        </div>

        <Card className="mt-8 p-8">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                required
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {fieldError && (
              <p className="text-sm text-destructive">{fieldError}</p>
            )}
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button
              size="lg"
              className="w-full"
              type="submit"
              disabled={state === "submitting"}
            >
              {state === "submitting" ? "Activating…" : "Activate account →"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
