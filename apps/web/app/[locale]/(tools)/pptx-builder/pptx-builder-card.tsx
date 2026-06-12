"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle2,
  Wand2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { fileDownloadUrl } from "@/lib/api";

type Phase = "idle" | "running" | "done" | "failed";

const tones = [
  { key: "corporate", name: "Corporate",  hint: "Deep blue, formal",  color: "from-blue-500 to-indigo-600" },
  { key: "modern",    name: "Modern",     hint: "Teal, clean lines",  color: "from-teal-400 to-cyan-600" },
  { key: "playful",   name: "Playful",    hint: "Coral, warm vibe",   color: "from-orange-400 to-pink-500" },
  { key: "academic",  name: "Academic",   hint: "Burgundy, classic",  color: "from-rose-700 to-amber-700" },
] as const;
type Tone = (typeof tones)[number]["key"];

const languages = [
  { key: "en", name: "English",          flag: "🇺🇸" },
  { key: "uz", name: "Oʻzbekcha",        flag: "🇺🇿" },
  { key: "ru", name: "Русский",          flag: "🇷🇺" },
  { key: "es", name: "Español",          flag: "🇪🇸" },
  { key: "ar", name: "العربية",          flag: "🇸🇦" },
] as const;

const examples = [
  "Q4 2025 sales review for the executive team",
  "Introduction to machine learning for beginners",
  "Yangi mahsulot ishga tushirish strategiyasi",
  "Pitch deck for a B2B SaaS startup, Series A",
] as const;

interface BuildResponse {
  StatusCode: number;
  Description: string;
  Data: { id: string; status: string };
}
interface JobResponse {
  StatusCode: number;
  Description: string;
  Data: {
    id: string;
    status: string;
    error?: string;
    output_file_id?: string;
    topic?: string;
  };
}

export function PptxBuilderCard() {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(8);
  const [tone, setTone] = useState<Tone>("corporate");
  const [language, setLanguage] = useState<string>("en");
  const [audience, setAudience] = useState("");

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [outputFileId, setOutputFileId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>("");

  async function generate() {
    const topicTrimmed = topic.trim();
    if (topicTrimmed.length < 4) {
      setError("Mavzu kamida 4 belgi bo'lishi kerak (or write a longer topic)");
      return;
    }
    setError(null);
    setOutputFileId(null);
    setPhase("running");
    setStatusText("Sending your topic to the AI…");

    try {
      const created: BuildResponse = await fetch("/api/build/pptx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicTrimmed,
          slide_count: slideCount,
          tone,
          language,
          audience: audience.trim() || undefined,
        }),
      }).then((r) => r.json());

      if (created.StatusCode >= 400) {
        throw new Error(created.Description || "Failed to start the job");
      }
      const jobId = created.Data.id;
      const started = Date.now();
      setStatusText("AI is composing the outline…");

      while (Date.now() - started < 90_000) {
        await new Promise((r) => setTimeout(r, 2_500));
        const polled: JobResponse = await fetch(`/api/build/pptx/${jobId}`).then((r) => r.json());
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
        if (st === "running") setStatusText("Rendering slides with python-pptx…");
        if (st === "pending") setStatusText("Waiting for a worker…");
      }
      throw new Error("Timed out after 90s — try a shorter slide count or a simpler topic");
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
      {/* Hero — gradient strip matching the chosen tone */}
      <div className={`bg-gradient-to-br ${tones.find((t) => t.key === tone)!.color} px-6 py-8 text-white sm:px-10`}>
        <div className="flex items-center gap-2">
          <Wand2 className="size-5" />
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">AI presentation builder</p>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Just type a topic. We design and write the deck.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          AI picks the palette, layouts, and bullets — you get a real .pptx in 15 seconds.
          5 languages, 4 tones, 5–15 slides.
        </p>
      </div>

      {phase === "done" && outputFileId ? (
        <div className="space-y-4 p-6 sm:p-10">
          <div className="flex items-start gap-3 rounded-xl border bg-emerald-50 p-4 dark:bg-emerald-950/20">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <div className="flex-1">
              <p className="font-bold">Deck ready.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Opens in PowerPoint, Keynote, LibreOffice, or Google Slides.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={fileDownloadUrl(outputFileId)} download>
                <Download className="size-4" />
                Download .pptx
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
          {/* Topic */}
          <label className="block">
            <span className="text-sm font-bold">Topic</span>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Q4 2025 sales review for the executive team…"
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
            {/* Slide count */}
            <label className="block">
              <span className="text-sm font-bold">Slide count</span>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={15}
                  step={1}
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value, 10))}
                  disabled={phase === "running"}
                  className="flex-1 accent-primary disabled:opacity-50"
                />
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {slideCount}
                </span>
              </div>
            </label>

            {/* Language */}
            <label className="block">
              <span className="text-sm font-bold">Output language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={phase === "running"}
                className="mt-2 w-full rounded-xl border bg-background p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                {languages.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Tone palette */}
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
                    tone === t.key
                      ? "border-primary ring-2 ring-primary/30"
                      : "hover:border-primary/40"
                  } disabled:opacity-60`}
                >
                  <div className={`mb-2 h-8 rounded-md bg-gradient-to-br ${t.color}`} />
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Audience (optional) */}
          <label className="block">
            <span className="text-sm font-bold">Audience <span className="font-normal text-muted-foreground">(optional)</span></span>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="executives, students, investors…"
              maxLength={200}
              disabled={phase === "running"}
              className="mt-2 w-full rounded-xl border bg-background p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border bg-destructive/5 p-3 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="flex-1 text-destructive">{error}</p>
            </div>
          )}

          {/* CTA */}
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
                Generate deck
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
