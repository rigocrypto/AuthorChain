"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function BookSwipeNav({
  prevHref,
  nextHref,
  children,
}: {
  prevHref: string | null;
  nextHref: string | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const t = event.touches[0];
    startXRef.current = t.clientX;
    startYRef.current = t.clientY;
  }

  function onTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const t = event.changedTouches[0];
    const dx = t.clientX - startXRef.current;
    const dy = t.clientY - startYRef.current;

    const horizontalThreshold = 72;
    const verticalGuard = 1.2;
    if (Math.abs(dx) < horizontalThreshold) return;
    if (Math.abs(dx) < Math.abs(dy) * verticalGuard) return;

    if (dx < 0 && nextHref) {
      router.push(nextHref);
      return;
    }

    if (dx > 0 && prevHref) {
      router.push(prevHref);
    }
  }

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {children}
    </div>
  );
}
