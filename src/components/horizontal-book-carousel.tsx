"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function HorizontalBookCarousel({
  children,
}: {
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  function updateFrontCard() {
    const el = scrollerRef.current;
    if (!el) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    const cards = Array.from(el.children).filter(
      (child) => !(child as HTMLElement).hasAttribute("data-edge-spacer"),
    ) as HTMLElement[];

    if (cards.length === 0) return;

    let best: HTMLElement | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const card of cards) {
      card.removeAttribute("data-front");
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = card;
      }
    }

    best?.setAttribute("data-front", "true");
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateFrontCard);
    };

    updateFrontCard();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible px-6 pb-3 pt-3 [scroll-padding-inline:2rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:opacity-75 [&>*]:saturate-[0.72] [&>*]:brightness-[0.92] [&>*]:transition [&>*]:duration-300 [&>[data-front='true']]:z-10 [&>[data-front='true']]:opacity-100 [&>[data-front='true']]:saturate-100 [&>[data-front='true']]:brightness-100 [&>[data-front='true']]:-translate-y-1 [&>[data-front='true']]:scale-[1.1] [&>[data-front='true']]:animate-[mobileSpotlight_650ms_ease-out] [&>[data-front='true']_a]:shadow-[0_0_0_2px_rgba(125,211,252,0.85),0_0_64px_-6px_rgba(56,189,248,1)] [&>[data-front='true']_a_.cover-media]:shadow-[inset_0_0_28px_rgba(56,189,248,0.35),0_0_34px_-14px_rgba(56,189,248,0.95)] [&>[data-front='true']_a_.cover-sound-toggle]:z-30 sm:[&>*]:opacity-100 sm:[&>*]:saturate-100 sm:[&>*]:brightness-100 sm:[&>[data-front='true']]:translate-y-0 sm:[&>[data-front='true']]:scale-100 sm:[&>[data-front='true']]:animate-none sm:[&>[data-front='true']_a]:shadow-none sm:[&>[data-front='true']_a_.cover-media]:shadow-none sm:px-8 [@keyframes_mobileSpotlight{0%{transform:translateY(0)_scale(1)}55%{transform:translateY(-0.5rem)_scale(1.12)}100%{transform:translateY(-0.25rem)_scale(1.1)}}]"
      >
        <div aria-hidden data-edge-spacer className="w-3 shrink-0 snap-none sm:w-6" />
        {children}
        <div aria-hidden data-edge-spacer className="w-3 shrink-0 snap-none sm:w-6" />
      </div>
    </div>
  );
}
