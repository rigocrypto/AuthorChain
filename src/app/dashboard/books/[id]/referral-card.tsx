"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ReferralLinkDTO } from "@/lib/data/referrals";
import { createReferralLinkAction, toggleReferralLinkAction } from "./actions";

/**
 * Author-only "Share & Referral Link" controls. Analytics only — clicks,
 * checkout starts, completed sales. No payouts.
 */
export function ReferralCard({
  bookId,
  referral,
  appBaseUrl,
}: {
  bookId: string;
  referral: ReferralLinkDTO | null;
  appBaseUrl: string;
}) {
  const [copied, setCopied] = useState(false);

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

  const url = `${appBaseUrl}/r/${referral.code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked; the field is selectable as a fallback */
    }
  }

  return (
    <div className="mt-3 space-y-4">
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Referral link"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground"
        />
        <Button type="button" variant="secondary" onClick={copy} className="whitespace-nowrap">
          {copied ? "Copied ✓" : "Copy"}
        </Button>
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
