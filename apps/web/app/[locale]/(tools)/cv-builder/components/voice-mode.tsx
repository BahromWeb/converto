"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, X, Loader2, CheckCircle2, Keyboard, Sparkles, RotateCcw, AlertCircle, Zap, Cloud } from "lucide-react";
import { parseCVVoice, transcribeAudio } from "@/lib/cv/api";
import type { CVParsedSection } from "@/lib/cv/types";

type SR = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> & { length: number } }) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: { new (): SR };
  webkitSpeechRecognition?: { new (): SR };
}

type Mode = "fast" | "universal" | "type";

const SECTION_OPTIONS: Array<{ id: string; label: string; example: string }> = [
  { id: "personal",   label: "Personal",   example: "I'm Zarif Jurayev, backend engineer based in Tashkent…" },
  { id: "summary",    label: "Summary",    example: "Go developer with 4 years building distributed systems…" },
  { id: "experience", label: "Experience", example: "At RRTM I led the backend for career.edu.uz…" },
  { id: "education",  label: "Education",  example: "B.Sc. in Software Engineering, INHA University, 2024…" },
  { id: "skills",     label: "Skills",     example: "Go, PostgreSQL, Kafka, Redis, Docker, Kubernetes…" },
  { id: "languages",  label: "Languages",  example: "Uzbek native, English B2, Russian C1…" },
  { id: "projects",   label: "Projects",   example: "Career.edu.uz — built the jobs platform handling 50k…" },
  { id: "awards",     label: "Awards",     example: "1st place in the 2024 national hackathon for…" },
];

const SPEECH_LOCALES: Array<{ code: string; tag: string; label: string; flag: string }> = [
  { code: "en", tag: "en-US", label: "English",    flag: "🇺🇸" },
  { code: "ru", tag: "ru-RU", label: "Русский",    flag: "🇷🇺" },
  { code: "uz", tag: "uz-UZ", label: "O'zbek",     flag: "🇺🇿" },
  { code: "de", tag: "de-DE", label: "Deutsch",    flag: "🇩🇪" },
  { code: "fr", tag: "fr-FR", label: "Français",   flag: "🇫🇷" },
  { code: "es", tag: "es-ES", label: "Español",    flag: "🇪🇸" },
  { code: "it", tag: "it-IT", label: "Italiano",   flag: "🇮🇹" },
  { code: "pt", tag: "pt-BR", label: "Português",  flag: "🇵🇹" },
  { code: "nl", tag: "nl-NL", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", tag: "pl-PL", label: "Polski",     flag: "🇵🇱" },
  { code: "tr", tag: "tr-TR", label: "Türkçe",     flag: "🇹🇷" },
  { code: "ar", tag: "ar-SA", label: "العربية",     flag: "🇸🇦" },
  { code: "zh", tag: "zh-CN", label: "中文",        flag: "🇨🇳" },
  { code: "ja", tag: "ja-JP", label: "日本語",       flag: "🇯🇵" },
  { code: "ko", tag: "ko-KR", label: "한국어",       flag: "🇰🇷" },
  { code: "hi", tag: "hi-IN", label: "हिन्दी",        flag: "🇮🇳" },
  { code: "id", tag: "id-ID", label: "Bahasa",     flag: "🇮🇩" },
  { code: "vi", tag: "vi-VN", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", tag: "th-TH", label: "ไทย",         flag: "🇹🇭" },
  { code: "uk", tag: "uk-UA", label: "Українська", flag: "🇺🇦" },
];

function localeToTag(locale: string): string {
  return SPEECH_LOCALES.find((l) => l.code === locale)?.tag ?? "en-US";
}

function friendlyError(code?: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone is blocked. Click the lock icon in the address bar and allow microphone access.";
    case "no-speech":
      return "We didn't hear anything. Speak closer to the mic.";
    case "audio-capture":
      return "No microphone detected. Plug one in or check your system audio settings.";
    case "network":
      return "Speech recognition needs the internet — check your connection.";
    case "language-not-supported":
      return "Your browser doesn't support that language for speech. Switch to English or Russian.";
    default:
      return code ? `Recognition error: ${code}` : "Recognition failed.";
  }
}

export function VoiceMode({
  cvID,
  locale,
  onDone,
}: {
  cvID: string;
  locale: string;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<Mode>("fast");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hint, setHint] = useState("experience");
  const [speechTag, setSpeechTag] = useState(() => localeToTag(locale));
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<CVParsedSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [heard, setHeard] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  // Web Speech API refs
  const recRef = useRef<SR | null>(null);
  const userWantsListening = useRef(false);

  // MediaRecorder refs (universal mode)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const supportedFast =
    typeof window !== "undefined" &&
    Boolean(
      (window as SpeechRecognitionWindow).SpeechRecognition ||
        (window as SpeechRecognitionWindow).webkitSpeechRecognition,
    );
  const supportedUniversal =
    typeof navigator !== "undefined" &&
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== "undefined";

  // Auto-pick universal if fast isn't supported (Yandex tends to expose
  // webkitSpeechRecognition but not actually transmit audio — covered
  // by the stuck banner below if user keeps fast mode).
  useEffect(() => {
    if (!supportedFast && supportedUniversal) setMode("universal");
  }, [supportedFast, supportedUniversal]);

  // Tick elapsed seconds while listening.
  useEffect(() => {
    if (!listening) return;
    setElapsedSec(0);
    setHeard(false);
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [listening]);

  // ─── Fast (Web Speech API) ──────────────────────────────────────

  function buildRecognizer(): SR | null {
    const W = window as SpeechRecognitionWindow;
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = speechTag;
    rec.onresult = (e) => {
      let agg = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r) agg += r[0].transcript + " ";
      }
      const incoming = agg.trim();
      if (!incoming) return;
      setHeard(true);
      setTranscript((prev) => (prev ? `${prev} ${incoming}`.trim() : incoming));
    };
    rec.onerror = (e) => {
      const code = e.error;
      if (code === "no-speech" || code === "aborted") return;
      setError(friendlyError(code));
    };
    rec.onend = () => {
      if (userWantsListening.current) {
        try { rec.start(); } catch { /* ignore */ }
      } else {
        setListening(false);
      }
    };
    return rec;
  }

  function startFast() {
    setError(null);
    if (!supportedFast) {
      setError("Voice mode needs Chrome / Edge / Safari. Switch to Universal mode below.");
      return;
    }
    const rec = buildRecognizer();
    if (!rec) return;
    userWantsListening.current = true;
    try { rec.start(); } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start the mic.");
      return;
    }
    recRef.current = rec;
    setListening(true);
  }

  function stopFast() {
    userWantsListening.current = false;
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  // ─── Universal (MediaRecorder + server transcription) ───────────

  async function startUniversal() {
    setError(null);
    if (!supportedUniversal) {
      setError("Your browser doesn't support audio recording. Try 'Type instead' below.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Pick a MIME the recorder can actually produce. Chromium → webm,
      // Safari → mp4. Letting MediaRecorder pick a default also works.
      const mime =
        typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      audioChunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: rec.mimeType });
        audioChunksRef.current = [];
        // Close the mic so the browser tab indicator goes away.
        audioStreamRef.current?.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
        if (blob.size === 0) {
          setError("No audio captured. Speak a bit louder and try again.");
          return;
        }
        await uploadForTranscription(blob);
      };
      rec.onerror = (e: Event) => {
        setError(`Recorder error: ${(e as ErrorEvent).message || "unknown"}`);
      };
      mediaRecorderRef.current = rec;
      rec.start();
      setListening(true);
      setHeard(true); // suppress the "stuck" banner — server transcription happens after stop
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Couldn't start the mic.";
      if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("denied")) {
        setError("Microphone permission was denied. Allow it in your browser settings and retry.");
      } else {
        setError(msg);
      }
    }
  }

  function stopUniversal() {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop(); // triggers onstop → uploadForTranscription
    }
    mediaRecorderRef.current = null;
    setListening(false);
  }

  async function uploadForTranscription(blob: Blob) {
    setTranscribing(true);
    setError(null);
    try {
      const tag = speechTag.split("-")[0] ?? "en";
      const text = await transcribeAudio(cvID, blob, tag);
      if (text) {
        setTranscript((prev) => (prev ? `${prev} ${text}`.trim() : text));
      } else {
        setError("AI didn't pick up any words. Speak a bit closer and try again.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transcription failed.");
    } finally {
      setTranscribing(false);
    }
  }

  // ─── Switch / cleanup ───────────────────────────────────────────

  function toggleRecording() {
    if (listening) {
      if (mode === "fast") stopFast();
      else if (mode === "universal") stopUniversal();
      return;
    }
    if (mode === "fast") startFast();
    else if (mode === "universal") startUniversal();
  }

  async function flush() {
    if (!transcript.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const r = await parseCVVoice(cvID, {
        transcript,
        section_hint: hint,
        locale,
      });
      setParsed((prev) => [...prev, ...r.parsed_sections]);
      setTranscript("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI parse failed");
    } finally {
      setBusy(false);
    }
  }

  // Restart fast recognizer when speechTag changes mid-session.
  useEffect(() => {
    if (mode !== "fast" || !listening) return;
    recRef.current?.stop();
    setTimeout(() => {
      if (userWantsListening.current) {
        const rec = buildRecognizer();
        if (!rec) return;
        try { rec.start(); recRef.current = rec; } catch { /* ignore */ }
      }
    }, 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechTag, mode]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      userWantsListening.current = false;
      recRef.current?.abort();
      mediaRecorderRef.current?.stop();
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const currentLang = SPEECH_LOCALES.find((l) => l.tag === speechTag) ?? SPEECH_LOCALES[0]!;
  const activeSection = SECTION_OPTIONS.find((s) => s.id === hint) ?? SECTION_OPTIONS[2]!;
  const stuckFast = mode === "fast" && listening && !heard && elapsedSec >= 10;

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Talk it through</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Speak in your own words. AI structures every sentence into a CV section.
            </p>
          </div>
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-accent"
          >
            <X className="size-3.5" /> Close
          </button>
        </div>

        {/* Mode picker */}
        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <ModeCard
            icon={Zap}
            title="Fast (browser)"
            hint="Live, free. Chrome / Edge / Safari only."
            active={mode === "fast"}
            disabled={!supportedFast}
            onClick={() => { if (listening) { stopFast(); stopUniversal(); } setMode("fast"); }}
          />
          <ModeCard
            icon={Cloud}
            title="Universal (AI)"
            hint="Records audio, AI transcribes. Works in any browser."
            active={mode === "universal"}
            disabled={!supportedUniversal}
            onClick={() => { if (listening) { stopFast(); stopUniversal(); } setMode("universal"); }}
            recommended={!supportedFast || (mode === "fast" && stuckFast)}
          />
          <ModeCard
            icon={Keyboard}
            title="Type"
            hint="Just type the same content."
            active={mode === "type"}
            onClick={() => { if (listening) { stopFast(); stopUniversal(); } setMode("type"); }}
          />
        </div>

        {/* Step 1 — section */}
        <div className="mt-6">
          <Step n="1" label="Pick a section to describe" />
          <div className="mt-2 flex flex-wrap gap-2">
            {SECTION_OPTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setHint(s.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  hint === s.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs italic text-muted-foreground">e.g. {activeSection.example}</p>
        </div>

        {/* Step 2 — language (hide for type mode) */}
        {mode !== "type" && (
          <div className="mt-6">
            <Step n="2" label="Which language will you speak?" right={<span className="text-xs text-muted-foreground">{currentLang.flag} {currentLang.label}</span>} />
            <div className="mt-2 overflow-x-auto">
              <div className="flex gap-1.5 pb-2">
                {SPEECH_LOCALES.map((l) => (
                  <button
                    key={l.tag}
                    type="button"
                    onClick={() => setSpeechTag(l.tag)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      l.tag === speechTag ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-sm leading-none">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — record / type */}
        <div className="mt-6">
          <Step n={mode === "type" ? "2" : "3"} label={mode === "type" ? "Type what you'd say" : "Hit the button and speak"} />

          <div className="mt-3 rounded-2xl border bg-card p-6">
            {mode !== "type" ? (
              <div className="flex flex-col items-center text-center">
                <button
                  type="button"
                  disabled={(mode === "fast" && !supportedFast) || (mode === "universal" && !supportedUniversal) || transcribing}
                  onClick={toggleRecording}
                  className={`relative grid size-24 place-items-center rounded-full transition-all ${
                    listening
                      ? "bg-rose-500 text-white shadow-xl shadow-rose-500/40"
                      : "bg-primary text-primary-foreground hover:scale-105 shadow-lg shadow-primary/30"
                  } disabled:opacity-50`}
                  aria-label={listening ? "Stop recording" : "Start recording"}
                >
                  {listening ? <Square className="size-9 fill-current" /> : <Play className="size-9 fill-current pl-1" />}
                  {listening && (
                    <>
                      <span className="absolute inset-0 -m-1 rounded-full border-4 border-rose-400/40 animate-ping" />
                      <span className="absolute inset-0 -m-3 rounded-full border border-rose-400/30 animate-ping" />
                    </>
                  )}
                </button>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  {transcribing ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="font-semibold">AI is transcribing your audio…</span>
                    </>
                  ) : listening ? (
                    <>
                      <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="font-semibold">
                        {mode === "fast" ? `Listening in ${currentLang.label}` : `Recording…`}
                      </span>
                      <span className="text-muted-foreground">· {elapsedSec}s</span>
                    </>
                  ) : (
                    <span className="font-semibold text-muted-foreground">
                      {mode === "fast" ? "Tap to start recording (live)" : "Tap to record, then we send to AI"}
                    </span>
                  )}
                </div>

                {mode === "universal" && !listening && !transcribing && (
                  <p className="mt-2 max-w-md text-xs text-muted-foreground">
                    Universal mode records up to 60 seconds of audio, then sends it to Gemini for transcription.
                    Works in <em>any</em> browser — including Yandex, Firefox, and Brave.
                  </p>
                )}

                {stuckFast && (
                  <div className="mt-3 w-full rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-left text-xs">
                    <p className="font-semibold text-amber-700 dark:text-amber-400">No speech captured after {elapsedSec}s.</p>
                    <p className="mt-1 text-amber-700 dark:text-amber-400">
                      Your browser isn&apos;t transmitting audio to Google&apos;s speech service. Switch to <strong>Universal (AI)</strong> mode at the top — it&apos;ll work.
                    </p>
                    <button
                      type="button"
                      onClick={() => { stopFast(); setMode("universal"); }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90"
                    >
                      <Cloud className="size-3.5" /> Switch to Universal
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Voice off. Write whatever you&apos;d say into the box below.
              </p>
            )}

            {/* Transcript area */}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              readOnly={mode !== "type" && listening}
              placeholder={
                mode === "type"
                  ? "Write a few sentences about this section…"
                  : "Your spoken words will appear here…"
              }
              rows={5}
              className="mt-4 w-full resize-y rounded-xl border bg-secondary/30 p-3 text-sm leading-relaxed outline-none focus:border-primary/50"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={busy || !transcript.trim()}
                onClick={flush}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? (
                  <><Loader2 className="size-4 animate-spin" /> Sending to AI…</>
                ) : (
                  <><Sparkles className="size-4" /> Save & let AI structure it</>
                )}
              </button>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript("")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
                >
                  <RotateCcw className="size-3.5" /> Clear
                </button>
              )}
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {parsed.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Captured so far ({parsed.length})
            </h2>
            <ul className="mt-2 space-y-2">
              {parsed.map((p, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border bg-card p-3 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-semibold capitalize">{p.section_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {Object.keys(p.content).slice(0, 5).join(", ")}
                    </p>
                  </div>
                  {p.confidence != null && (
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(p.confidence * 100)}%
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function ModeCard({
  icon: Icon,
  title,
  hint,
  active,
  disabled,
  recommended,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
  active: boolean;
  disabled?: boolean;
  recommended?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 ${
        active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
      } ${disabled ? "opacity-50 hover:translate-y-0 cursor-not-allowed" : ""}`}
    >
      <Icon className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-sm font-bold">{title}</p>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
      {recommended && !active && (
        <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          Recommended
        </span>
      )}
    </button>
  );
}

function Step({ n, label, right }: { n: string; label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{n}</span>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      {right}
    </div>
  );
}
