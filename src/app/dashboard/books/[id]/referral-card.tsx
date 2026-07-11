"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShareMenu } from "@/components/share-menu";
import type { ReferralLinkDTO } from "@/lib/data/referrals";
import { createReferralLinkAction, toggleReferralLinkAction } from "./actions";
import { useI18n } from "@/i18n/provider";

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
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [copied, setCopied] = useState<string | null>(null);
  const formId = `referral-${bookId}`;

  if (!referral) {
    return (
      <form action={createReferralLinkAction} className="mt-3">
        <input type="hidden" name="bookId" value={bookId} />
        <p className="text-sm text-muted">{d.createReferralDesc}</p>
        <Button type="submit" variant="secondary" className="mt-3">
          {d.createReferralLink}
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
        <label htmlFor={`${formId}-promo`} className="mb-1 block text-xs text-muted">
          {d.promoLink}{" "}
          <span className="text-muted/70">{d.promoLinkNote}</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`${formId}-promo`}
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={d.promoLink}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => copy(shareUrl, "share")}
            className="whitespace-nowrap"
          >
            {copied === "share" ? dict.common.copied : dict.common.copyLink}
          </Button>
          <ShareMenu
            url={shareUrl}
            title={bookTitle}
            text={`${bookTitle} — on AuthorChain`}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-tracking`} className="mb-1 block text-xs text-muted">
          {d.trackingLink} <span className="text-muted/70">{d.trackingLinkNote}</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`${formId}-tracking`}
            readOnly
            value={trackUrl}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={d.trackingLink}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => copy(trackUrl, "track")}
            className="whitespace-nowrap"
          >
            {copied === "track" ? dict.common.copied : dict.common.copyLink}
          </Button>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 text-center">
        {(
          [
            [d.clicks, referral.clickCount],
            [d.checkouts, referral.checkoutCount],
            [d.salesCount, referral.saleCount],
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
          <StatusBadge tone="success">{d.statusActive}</StatusBadge>
        ) : (
          <StatusBadge tone="muted">{d.statusInactive}</StatusBadge>
        )}
        <form action={toggleReferralLinkAction}>
          <input type="hidden" name="bookId" value={bookId} />
          <input type="hidden" name="linkId" value={referral.id} />
          <input type="hidden" name="activate" value={referral.isActive ? "false" : "true"} />
          <Button type="submit" variant="ghost">
            {referral.isActive ? d.deactivate : d.reactivate}
          </Button>
        </form>
      </div>

      <p className="text-xs text-muted">{d.referralAnalyticsNote}</p>
    </div>
  );
}
