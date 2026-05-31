"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Globe, Check, X, Search } from "lucide-react";
import { locales } from "@/lib/i18n/locales";
import { useI18n } from "@/lib/i18n/context";

function LanguageModal({
  open,
  onClose,
  onSelect,
  currentLocale,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  currentLocale: string;
}) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) { setSearch(""); return; }
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = locales.filter(
    (l) =>
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-black/10">
        {/* Orange header */}
        <div className="flex items-center justify-between bg-primary px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
              <Globe className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-white">
                {t.languageSwitcher.title}
              </p>
              <p className="text-xs font-semibold text-white/70">
                {t.languageSwitcher.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.languageSwitcher.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Language grid */}
        <div className="max-h-[360px] overflow-y-auto overscroll-contain p-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="mb-3 size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No languages found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {filtered.map((l) => {
                const isActive = l.code === currentLocale;
                return (
                  <button
                    key={l.code}
                    onClick={() => onSelect(l.code)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                      isActive
                        ? "bg-primary/10 ring-1 ring-inset ring-primary/25"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <span className="text-xl leading-none">{l.flag}</span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-semibold leading-tight ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {l.nativeName}
                      </p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {l.code}
                      </p>
                    </div>
                    {isActive && (
                      <Check className="size-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3">
          <p className="text-center text-xs text-muted-foreground">
            {locales.length} languages · all translated by native speakers
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, t } = useI18n();

  const currentLocale = locales.find((l) => l.code === locale);

  useEffect(() => { setMounted(true); }, []);

  function handleSelect(code: string) {
    setLocale(code);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
        aria-label={`${t.languageSwitcher.title} (${locale.toUpperCase()})`}
        title={t.languageSwitcher.title}
      >
        <Globe className="size-3.5" />
        <span>{currentLocale?.flag}</span>
        <span className="uppercase tracking-wide">{locale}</span>
      </button>

      {mounted && (
        <LanguageModal
          open={open}
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
          currentLocale={locale}
        />
      )}
    </>
  );
}
