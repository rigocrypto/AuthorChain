"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

export function HorizontalBookCarousel({
  children,
}: {
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function slide(direction: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.78, 260);
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />

      <div className="absolute right-0 top-[-3.25rem] z-20 hidden items-center gap-2 sm:flex">
        <button
          type="button"
          aria-label="Scroll books left"
          onClick={() => slide("left")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground transition hover:border-primary/60"
        >
          &lt;
        </button>
        <button
          type="button"
          aria-label="Scroll books right"
          onClick={() => slide("right")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground transition hover:border-primary/60"
        >
          &gt;
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [scroll-padding-inline:2rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8"
      >
        <div aria-hidden className="w-3 shrink-0 snap-none sm:w-6" />
        {children}
        <div aria-hidden className="w-3 shrink-0 snap-none sm:w-6" />
      </div>
    </div>
  );
}
