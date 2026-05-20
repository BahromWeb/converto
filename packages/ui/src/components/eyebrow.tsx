import * as React from "react";
import { cn } from "@converto/ui/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: string;
  label: string;
  /** Show a small pulsing dot at the start. */
  live?: boolean;
  tone?: "default" | "inverse" | "primary";
}

const toneClasses = {
  default: "text-muted-foreground",
  inverse: "text-background/60",
  primary: "text-primary",
} as const;

export function Eyebrow({
  index,
  label,
  live,
  tone = "default",
  className,
  ...props
}: EyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {live ? (
        <span className="relative grid place-items-center">
          <span className="absolute inline-flex size-2.5 rounded-full bg-primary/30 animate-pulse-dot" />
          <span className="relative size-1.5 rounded-full bg-primary" />
        </span>
      ) : null}
      {index ? (
        <>
          <span className="font-medium text-primary">{index}</span>
          <span className="h-px w-5 bg-current/30" aria-hidden />
        </>
      ) : null}
      <span>{label}</span>
    </div>
  );
}
