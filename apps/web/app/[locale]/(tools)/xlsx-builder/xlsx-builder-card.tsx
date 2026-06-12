"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  RefreshCcw,
  TableProperties,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { fileDownloadUrl } from "@/lib/api";

type Phase = "idle" | "running" | "done" | "failed";

const tones = [
  { key: "corporate", name: "Corporate", hint: "Navy header, formal", color: "from-blue-500 to-indigo-600" },
  { key: "modern",    name: "Modern",    hint: "Teal, clean lines",  color: "from-teal-400 to-cyan-600" },
  { key: "playful",   name: "Playful",   hint: "Coral, warm vibe",   color: "from-orange-400 to-pink-500" },
  { key: "academic",  name: "Academic",  hint: "Burgundy, classic",  color: "from-rose-700 to-amber-700" },
] as const;
type Tone = (typeof tones)[number]["key"];

const languages = [
  { key: "en", name: "English",    flag: "🇺🇸" },
  { key: "uz", name: "Oʻzbekcha",  flag: "🇺🇿" },
  { key: "ru", name: "Русский",    flag: "🇷🇺" },
  { key: "es", name: "Español",    flag: "🇪🇸" },
  { key: "ar", name: "العربية",    flag: "🇸🇦" },
] as const;

const examples = [
  "Monthly household budget for a family of four",
  "B2B SaaS sales pipeline tracker with stage probabilities",
  "Q1 2026 OKR scorecard for the engineering team",
  "Oylik xarajatlar va daromadlar jadvali",
] as const;

interface CreateResp {
  StatusCode: number; Description: string;
  Data: { id: string; status: string };
}
interface JobResp {
  StatusCode: number; Description: string;
  Data: { id: string; status: string; error?: string; output_file_id?: string };
}

export function XlsxBuilderCard() {
  const [topic, setTopic] = useState("");
  const [sheetCount, setSheetCount] = useState(2);
  const [tone, setTone] = useState<Tone>("corporate");
  const [language, setLanguage] = useState<string>("en");
  const [audience, setAudience] = useState("");
  const [includeChart, setIncludeChart] = useState(true);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [outputFileId, setOutputFileId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>("");

  async function generate() {
    const t = topic.trim();
    if (t.length < 4) {
      setError("Mavzu kamida 4 belgi bo'lishi kerak (or describe what you need in more detail)");
      return;
    }
    setError(null);
    setOutputFileId(null);
    setPhase("running");
    setStatusText("Sending your spec to the AI…");

    try {
      const created: CreateResp = await fetch("/api/build/xlsx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: t,
          sheet_count: sheetCount,
          tone,
          language,
          audience: audience.trim() || undefined,
          include_chart: includeChart,
        }),
      }).then((r) => r.json());

      if (created.StatusCode >= 400) {
        throw new Error(created.Description || "Failed to start the job");
      }
      const jobId = created.Data.id;
      const started = Date.now();
      setStatusText("AI is laying out the sheet…");

      while (Date.now() - started < 90_000) {
        await new Promise((r) => setTimeout(r, 2_500));
        const polled: JobResp = await fetch(`/api/build/xlsx/${jobId}`).then((r) => r.json());
        const st = polled.Data?.status;
        if (st === "done" && polled.Data.output_file_id) {
          setOutputFileId(polled.Data.output_file_id);
          setStatusText("");
          setPhase("done");
          return;
        }
        if (st === "failed") {
          throw new Error(polled.Data.error || "Generation failed — try a slightly different topic");
        }
        if (st === "running") setStatusText("Building cells, formulas, and charts…");
        if (st === "pending") setStatusText("Waiting for a worker…");
      }
      throw new Error("Timed out after 90s — try fewer sheets or a simpler topic");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPhase("failed");
      setStatusText("");
    }
  }

  function reset() {
    setPhase("idle");
    setError(null);
    setOutputFileId(null);
    setStatusText("");
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className={`bg-gradient-to-br ${tones.find((t) => t.key === tone)!.color} px-6 py-8 text-white sm:px-10`}>
        <div className="flex items-center gap-2">
          <TableProperties className="size-5" />
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">AI spreadsheet builder</p>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Describe the sheet. We build it — with formulas and a chart.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          AI picks the headers, fills realistic numbers, writes the formulas, and adds a chart.
          Real .xlsx in 15 seconds. 5 languages, 4 tones.
        </p>
      </div>

      {phase === "done" && outputFileId ? (
        <div className="space-y-4 p-6 sm:p-10">
          <div className="flex items-start gap-3 rounded-xl border bg-emerald-50 p-4 dark:bg-emerald-950/20">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <div className="flex-1">
              <p className="font-bold">Workbook ready.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Opens in Excel, Google Sheets, Numbers, LibreOffice Calc.
                Formulas recalc on first open.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={fileDownloadUrl(outputFileId)} download>
                <Download className="size-4" />
                Download .xlsx
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={reset} className="w-full sm:w-auto">
              <RefreshCcw className="size-4" />
              Make another
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-6 sm:p-10">
          <label className="block">
            <span className="text-sm font-bold">What do you need?</span>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Monthly household budget for a family of four…"
              rows={3}
              maxLength={500}
              disabled={phase === "running"}
              className="mt-2 w-full rounded-xl border bg-background p-3 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
            <div className="mt-1 flex flex-wrap gap-1.5">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setTopic(ex)}
                  disabled={phase === "running"}
                  className="rounded-full border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
                >
                  {ex.slice(0, 40)}{ex.length > 40 ? "…" : ""}
                </button>
              ))}
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold">Sheet count</span>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={sheetCount}
                  onChange={(e) => setSheetCount(parseInt(e.target.value, 10))}
                  disabled={phase === "running"}
                  className="flex-1 accent-primary disabled:opacity-50"
                />
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {sheetCount}
                </span>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold">Output language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={phase === "running"}
                className="mt-2 w-full rounded-xl border bg-background p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                {languages.map((l) => (
                  <option key={l.key} value={l.key}>{l.flag} {l.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <span className="text-sm font-bold">Tone &amp; palette</span>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {tones.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTone(t.key)}
                  disabled={phase === "running"}
                  className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                    tone === t.key ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/40"
                  } disabled:opacity-60`}
                >
                  <div className={`mb-2 h-8 rounded-md bg-gradient-to-br ${t.color}`} />
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeChart}
              onChange={(e) => setIncludeChart(e.target.checked)}
              disabled={phase === "running"}
              className="size-4 accent-primary"
            />
            <BarChart3 className="size-4 text-muted-foreground" />
            <span className="font-bold">Include a chart on the first sheet</span>
          </label>

          <label className="block">
            <span className="text-sm font-bold">Audience <span className="font-normal text-muted-foreground">(optional)</span></span>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="finance team, students, founders…"
              maxLength={200}
              disabled={phase === "running"}
              className="mt-2 w-full rounded-xl border bg-background p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </label>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border bg-destructive/5 p-3 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="flex-1 text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={generate}
            disabled={phase === "running" || topic.trim().length < 4}
            size="lg"
            className="w-full"
          >
            {phase === "running" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {statusText || "Generating…"}
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate workbook
              </>
            )}
          </Button>
          {phase === "running" && (
            <p className="text-center text-xs text-muted-foreground">
              Usually ~15 seconds. Don&apos;t close the tab.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
