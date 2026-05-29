"use client";

import { useEffect } from "react";
import { Wrench, Globe, ShieldOff, Zap } from "lucide-react";
import { tools } from "@converto/data";
import { AnimateIn } from "@/components/ui/animate-in";
import { useT } from "@/lib/i18n/context";
import { locales } from "@/lib/i18n/locales";
import { getPublicStats } from "@/lib/api";
import { cn } from "@converto/ui/lib/utils";

const statsMeta = [
  { icon: Zap, iconBg: "bg-emerald-50", iconColor: "text-emerald-500", live: true, accentValue: true },
  {
    icon: Wrench,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    live: false,
    accentValue: false,
  },
  {
    icon: Globe,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    live: false,
    accentValue: false,
  },
  {
    icon: ShieldOff,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    live: false,
    accentValue: true,
  },
];

const TOOL_COUNT = tools.length;
const LOCALE_COUNT = Object.keys(locales).length;

export function StatsBar() {
  const t = useT();
  // We still hit the public stats endpoint so the data is warm in case
  // we want to surface it later — for now the user-facing metric is the
  // median sub-3-second conversion time, a trust signal that doesn't
  // bottom out as 2 or 3 like a literal daily count on a brand-new site.
  useEffect(() => {
    getPublicStats().catch(() => undefined);
  }, []);

  const stats = [
    {
      value: "<3",
      suffix: "s",
      label: t.stats.filesDaily,
      sub: t.stats.filesWeek,
    },
    {
      value: String(TOOL_COUNT),
      suffix: "",
      label: t.stats.toolsFree,
      sub: t.stats.toolsQuarter,
    },
    {
      value: String(LOCALE_COUNT),
      suffix: "",
      label: t.stats.languages,
      sub: t.stats.languagesSub,
    },
    { value: "0", suffix: "", label: t.stats.watermarks, sub: t.stats.watermarksSub },
  ];

  return (
    <section className="py-10">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const meta = statsMeta[i]!;
            const Icon = "icon" in meta ? meta.icon : null;

            return (
              <AnimateIn
                key={stat.label}
                animation="fade-up"
                delay={i * 80}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  {Icon ? (
                    <span
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                        "iconBg" in meta && meta.iconBg,
                      )}
                    >
                      <Icon className={cn("size-4", "iconColor" in meta && meta.iconColor)} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        Live
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-0.5">
                  <span
                    className={cn(
                      "text-4xl font-bold tracking-tight md:text-5xl",
                      "accentValue" in meta && meta.accentValue
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-2xl font-bold text-primary">{stat.suffix}</span>
                  )}
                </div>

                <div className="mt-auto">
                  <p className="font-semibold leading-tight text-foreground">{stat.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
                </div>

                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
