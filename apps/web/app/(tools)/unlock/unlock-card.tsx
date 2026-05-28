"use client";

import { useRef, useState } from "react";
import {
  Unlock,
  ShieldOff,
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { useJobRunner } from "@/components/tools/use-job-runner";

export function UnlockCard() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
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
    runner.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  async function onUnlock() {
    if (!file || !password) return;
    await runner.run(
      [file],
      (ids) => ({ input_file_id: ids[0], password }),
      "unlock",
    );
  }

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
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-amber-50">
            <Unlock className="size-10 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Upload your protected PDF</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the password and we'll strip the lock so you can work freely.
            </p>
          </div>

          <button
            type="button"
            onClick={pickFile}
            className="w-full rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition-colors hover:border-primary/40"
          >
            {file ? (
              <>
                <p className="truncate text-sm font-semibold text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(1)} MB · click to replace
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground">Drop your PDF here or</p>
                <span className="mt-3 inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                  Choose file
                </span>
              </>
            )}
          </button>

          <div className="w-full">
            <label htmlFor="unlock-pwd" className="block text-left text-sm font-semibold text-foreground">
              PDF Password
            </label>
            <div className="relative mt-2">
              <input
                id="unlock-pwd"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the document password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
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
          </div>

          <div className="flex w-full items-center gap-2 rounded-xl bg-amber-50 p-4 text-left">
            <ShieldOff className="size-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              Only unlock PDFs you own or have explicit permission to modify.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!file || !password || busy}
            onClick={onUnlock}
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {runner.phase === "uploading" ? "Uploading…" : "Unlocking…"}
              </>
            ) : (
              <>Unlock PDF →</>
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
              onClick={() => runner.download(`unlocked-${file?.name ?? "result.pdf"}`)}
            >
              <Download className="mr-1.5 size-4" />
              Download unlocked PDF
            </Button>
          </div>
        </div>
      )}

      {runner.phase === "failed" && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Unlock failed</p>
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
