"use client";

import { useRef, useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";

export function ProtectCard() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const runner = useJobRunner();

  function pickFile() {
    inputRef.current?.click();
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      runner.reset();
    }
  }
  function discard() {
    setFile(null);
    setPassword("");
    setConfirm("");
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  async function onLock() {
    if (!file || !canSubmit) return;
    await runner.run(
      [file],
      (ids) => ({ input_file_id: ids[0], password }),
      "protect",
    );
  }

  const tooShort = password.length > 0 && password.length < 6;
  const mismatch = password.length > 0 && confirm.length > 0 && password !== confirm;
  const canSubmit = !!file && password.length >= 6 && password === confirm;
  const busy = runner.phase === "uploading" || runner.phase === "running";

  return (
    <Card className="p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={onFileChange}
      />

      <div className="mx-auto max-w-md">
        <div className="flex flex-col gap-6">
          <button
            type="button"
            onClick={pickFile}
            className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-8 text-center transition-colors hover:border-primary/40"
          >
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-amber-50">
              <Lock className="size-7 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                {file ? file.name : "Drop your PDF here"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(1)} MB · click to replace`
                  : "or click to browse"}
              </p>
            </div>
            {!file && (
              <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Select PDF
              </span>
            )}
          </button>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="protect-pwd" className="block text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="protect-pwd"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  autoComplete="new-password"
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 pr-10 text-sm outline-none transition-colors ${
                    tooShort
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary focus:ring-1 focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {tooShort && (
                <p className="mt-1 text-xs text-destructive">At least 6 characters</p>
              )}
            </div>

            <div>
              <label htmlFor="protect-pwd-confirm" className="block text-sm font-semibold text-foreground">
                Confirm password
              </label>
              <div className="relative mt-2">
                <input
                  id="protect-pwd-confirm"
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat the password"
                  autoComplete="new-password"
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 pr-10 text-sm outline-none transition-colors ${
                    mismatch
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary focus:ring-1 focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {mismatch && (
                <p className="mt-1 text-xs text-destructive">Passwords don't match</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4">
            <ShieldCheck className="size-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              Encrypted with AES-256. We never store your password.
            </p>
          </div>

          <Button size="lg" className="w-full" disabled={!canSubmit || busy} onClick={onLock}>
            {busy ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {runner.phase === "uploading" ? "Uploading…" : "Locking…"}
              </>
            ) : (
              <>Lock PDF →</>
            )}
          </Button>
        </div>
      </div>

      {runner.phase === "done" && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Done · auto-deletes in 5 min
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={discard}>
              <Trash2 className="mr-1.5 size-4" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={() =>
                runner.download(`protected-${file?.name ?? "result.pdf"}`)
              }
            >
              <Download className="mr-1.5 size-4" />
              Download protected PDF
            </Button>
          </div>
        </div>
      )}

      {runner.phase === "failed" && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Protect failed</p>
            <p className="text-muted-foreground">{runner.error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={runner.reset}>
            Try again
          </Button>
        </div>
      )}
    </Card>
  );
}
