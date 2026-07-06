"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShareMenu } from "@/components/share-menu";
import type { ReferralLinkDTO } from "@/lib/data/referrals";
import { createReferralLinkAction, toggleReferralLinkAction } from "./actions";

/**
 * Author-only "Share & Referral Link" controls. Analytics only — clicks,
 * checkout starts, completed sales. No payouts.
 */
export function ReferralCard({
  bookId,
  bookTitle,
  referral,
  appBaseUrl,
}: {
  bookId: string;
  bookTitle: string;
  referral: ReferralLinkDTO | null;
  appBaseUrl: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!referral) {
    return (
      <form action={createReferralLinkAction} className="mt-3">
        <input type="hidden" name="bookId" value={bookId} />
        <p className="text-sm text-muted">
          Create a shareable link that tracks clicks and sales generated from it.
        </p>
        <Button type="submit" variant="secondary" className="mt-3">
          Create referral link
        </Button>
      </form>
    );
  }

  const shareUrl = `${appBaseUrl}/share/${referral.code}`;
  const trackUrl = `${appBaseUrl}/r/${referral.code}`;

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard may be blocked; the field is selectable as a fallback */
    }
  }

  return (
    <div className="mt-3 space-y-4">
      <div>
        <label className="mb-1 block text-xs text-muted">
          Promotional share link{" "}
          <span className="text-muted/70">— best previews on social platforms</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Promotional share link"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => copy(shareUrl, "share")}
            className="whitespace-nowrap"
          >
            {copied === "share" ? "Copied ✓" : "Copy"}
          </Button>
          <ShareMenu
            url={shareUrl}
            title={bookTitle}
            text={`${bookTitle} — on AuthorChain`}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">
          Direct tracking link <span className="text-muted/70">— fast redirect (advanced)</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={trackUrl}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Direct tracking link"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => copy(trackUrl, "track")}
            className="whitespace-nowrap"
          >
            {copied === "track" ? "Copied ✓" : "Copy"}
          </Button>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 text-center">
        {(
          [
            ["Clicks", referral.clickCount],
            ["Checkouts", referral.checkoutCount],
            ["Sales", referral.saleCount],
          ] as const
        ).map(([label, n]) => (
          <div key={label} className="rounded-lg border border-border bg-surface-2 py-3">
            <dd className="text-xl font-semibold tabular-nums">{n}</dd>
            <dt className="mt-0.5 text-xs text-muted">{label}</dt>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between gap-2">
        {referral.isActive ? (
          <StatusBadge tone="success">Active</StatusBadge>
        ) : (
          <StatusBadge tone="muted">Inactive</StatusBadge>
        )}
        <form action={toggleReferralLinkAction}>
          <input type="hidden" name="bookId" value={bookId} />
          <input type="hidden" name="linkId" value={referral.id} />
          <input type="hidden" name="activate" value={referral.isActive ? "false" : "true"} />
          <Button type="submit" variant="ghost">
            {referral.isActive ? "Deactivate" : "Reactivate"}
          </Button>
        </form>
      </div>

      <p className="text-xs text-muted">
        Track clicks and sales generated from this link. Referral tracking is for
        analytics only — payouts are not enabled yet.
      </p>
    </div>
  );
}
