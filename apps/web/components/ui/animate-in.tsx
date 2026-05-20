"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@converto/ui/lib/utils";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation starts after element enters viewport */
  delay?: number;
  /** Animation variant */
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-right";
  /** Intersection threshold 0–1 */
  threshold?: number;
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  animation = "fade-up",
  threshold = 0.12,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const variants = {
    "fade-up": {
      hidden: { opacity: 0, transform: "translateY(24px)" },
      visible: { opacity: 1, transform: "translateY(0)" },
    },
    "fade-in": {
      hidden: { opacity: 0, transform: "none" },
      visible: { opacity: 1, transform: "none" },
    },
    "scale-in": {
      hidden: { opacity: 0, transform: "scale(0.95)" },
      visible: { opacity: 1, transform: "scale(1)" },
    },
    "slide-right": {
      hidden: { opacity: 0, transform: "translateX(-16px)" },
      visible: { opacity: 1, transform: "translateX(0)" },
    },
  };

  const v = variants[animation];

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? v.visible.opacity : v.hidden.opacity,
        transform: visible ? v.visible.transform : v.hidden.transform,
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
