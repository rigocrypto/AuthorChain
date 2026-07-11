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
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const autoDirectionRef = useRef<1 | -1>(1);

  function getCards() {
    const el = scrollerRef.current;
    if (!el) return [] as HTMLElement[];
    return Array.from(el.children).filter(
      (child) => !(child as HTMLElement).hasAttribute("data-edge-spacer"),
    ) as HTMLElement[];
  }

  function getNearestCardIndex() {
    const el = scrollerRef.current;
    if (!el) return 0;

    const cards = getCards();
    if (cards.length === 0) return 0;

    const center = el.scrollLeft + el.clientWidth / 2;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }

    return bestIndex;
  }

  function centerCard(index: number, behavior: ScrollBehavior = "smooth") {
    const el = scrollerRef.current;
    if (!el) return;

    const cards = getCards();
    if (cards.length === 0) return;

    const safeIndex = ((index % cards.length) + cards.length) % cards.length;
    const card = cards[safeIndex];
    const rawLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = Math.min(Math.max(rawLeft, 0), maxLeft);

    el.scrollTo({ left, behavior });
  }

  function pauseAuto() {
    pausedRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }

  function scheduleAutoResume(delay = 1400) {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  }

  function getAutoScrollIntervalMs() {
    if (typeof window === "undefined") return 3600;
    if (window.matchMedia("(max-width: 639px)").matches) return 2800;
    if (window.matchMedia("(max-width: 1023px)").matches) return 3600;
    return 3200;
  }

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

      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        centerCard(getNearestCardIndex(), "smooth");
        scheduleAutoResume();
      }, 110);
    };

    const handlePointerEnter = () => {
      pauseAuto();
    };

    const handlePointerLeave = () => {
      scheduleAutoResume(300);
    };

    const handleUserInteraction = () => {
      pauseAuto();
      scheduleAutoResume();
    };

    centerCard(getNearestCardIndex(), "auto");
    updateFrontCard();

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    el.addEventListener("mouseenter", handlePointerEnter);
    el.addEventListener("mouseleave", handlePointerLeave);
    el.addEventListener("pointerdown", handleUserInteraction, { passive: true });
    el.addEventListener("touchstart", handleUserInteraction, { passive: true });
    el.addEventListener("wheel", handleUserInteraction, { passive: true });

    const startAutoScroll = () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = setInterval(() => {
        if (pausedRef.current || document.visibilityState !== "visible") return;

        const el = scrollerRef.current;
        if (!el) return;

        const cards = getCards();
        if (cards.length < 2) return;

        const current = getNearestCardIndex();
        const lastIndex = cards.length - 1;
        const edgeTolerance = 4;
        const atStart = el.scrollLeft <= edgeTolerance;
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - edgeTolerance;

        if (atEnd) {
          autoDirectionRef.current = -1;
        } else if (atStart) {
          autoDirectionRef.current = 1;
        }

        if (current >= lastIndex) {
          autoDirectionRef.current = -1;
        } else if (current <= 0) {
          autoDirectionRef.current = 1;
        }

        const next = Math.min(
          Math.max(current + autoDirectionRef.current, 0),
          lastIndex,
        );
        centerCard(next, "smooth");
      }, getAutoScrollIntervalMs());
    };

    const handleAutoSpeedRefresh = () => {
      startAutoScroll();
    };

    startAutoScroll();
    window.addEventListener("resize", handleAutoSpeedRefresh);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      el.removeEventListener("mouseenter", handlePointerEnter);
      el.removeEventListener("mouseleave", handlePointerLeave);
      el.removeEventListener("pointerdown", handleUserInteraction);
      el.removeEventListener("touchstart", handleUserInteraction);
      el.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("resize", handleAutoSpeedRefresh);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  function slide(direction: "left" | "right") {
    const current = getNearestCardIndex();
    centerCard(current + (direction === "left" ? -1 : 1), "smooth");
    pauseAuto();
    scheduleAutoResume();
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
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible px-6 pb-6 pt-6 [scroll-padding-inline:2rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:opacity-75 [&>*]:saturate-[0.72] [&>*]:brightness-[0.92] [&>*]:transition [&>*]:duration-300 [&>[data-front='true']]:z-10 [&>[data-front='true']]:opacity-100 [&>[data-front='true']]:saturate-100 [&>[data-front='true']]:brightness-100 [&>[data-front='true']]:translate-y-0 [&>[data-front='true']]:scale-[1.06] [&>[data-front='true']]:animate-[mobileSpotlight_600ms_ease-out] [&>[data-front='true']_a.book-card-regular]:shadow-[0_0_0_2px_rgba(125,211,252,0.5),0_0_38px_-10px_rgba(56,189,248,0.62)] [&>[data-front='true']_a.book-card-regular_.cover-media]:shadow-[inset_0_0_18px_rgba(56,189,248,0.2),0_0_22px_-14px_rgba(56,189,248,0.52)] [&>[data-front='true']_a.book-card-featured]:shadow-[0_0_0_2px_rgba(253,224,71,0.98),0_0_0_6px_rgba(251,191,36,0.42),0_0_78px_-8px_rgba(250,204,21,1)] [&>[data-front='true']_a.book-card-featured_.cover-media]:shadow-[inset_0_0_30px_rgba(245,158,11,0.34),0_0_40px_-12px_rgba(250,204,21,0.95)] [&>[data-front='true']_a_.cover-sound-toggle]:z-30 sm:[&>*]:opacity-100 sm:[&>*]:saturate-100 sm:[&>*]:brightness-100 sm:[&>[data-front='true']]:translate-y-0 sm:[&>[data-front='true']]:scale-100 sm:[&>[data-front='true']]:animate-none sm:[&>[data-front='true']_a]:shadow-none sm:[&>[data-front='true']_a_.cover-media]:shadow-none sm:px-8 [@keyframes_mobileSpotlight{0%{transform:translateY(0)_scale(1)}55%{transform:translateY(0)_scale(1.08)}100%{transform:translateY(0)_scale(1.06)}}]"
      >
        <div aria-hidden data-edge-spacer className="w-3 shrink-0 snap-none sm:w-6" />
        {children}
        <div aria-hidden data-edge-spacer className="w-3 shrink-0 snap-none sm:w-6" />
      </div>
    </div>
  );
}
