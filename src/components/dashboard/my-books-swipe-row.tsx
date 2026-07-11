"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

export function MyBooksSwipeRow({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function slide(direction: "left" | "right") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const firstCard = scroller.querySelector<HTMLElement>("[data-book-item='true']");
    const cardWidth = firstCard?.offsetWidth ?? Math.max(scroller.clientWidth * 0.82, 280);
    const gap = 16;
    const distance = cardWidth + gap;

    scroller.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Scroll my books left"
          onClick={() => slide("left")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:border-primary/60"
        >
          &lt;
        </button>
        <button
          type="button"
          aria-label="Scroll my books right"
          onClick={() => slide("right")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:border-primary/60"
        >
          &gt;
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
