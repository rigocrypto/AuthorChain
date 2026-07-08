// Malware-scan status helpers (Security phase S1 — foundation).
//
// Pure, dependency-free predicates over a file/asset's `scanStatus`. These are
// safe to import from server OR client code (type-only Prisma import, erased at
// build time). They define the *policy* for later phases — nothing here is wired
// into serving/upload routes yet, so no existing behavior changes.

import type { MalwareScanStatus } from "@prisma/client";

/** Minimal shape needed to reason about a file/asset's scan state. */
export type ScanTarget = { scanStatus: MalwareScanStatus };

/**
 * Whether a file with the given scan status should be blocked from being served
 * or processed. Fail-closed: only `CLEAN` passes by default.
 *
 * During the phased rollout a caller may pass `allowLegacyUnknown: true` to
 * temporarily permit pre-scan (`UNKNOWN`) assets while a backfill runs — this is
 * the documented "soft phase". `PENDING | INFECTED | ERROR` always block.
 *
 * NOTE (S1): not called by any route yet. It exists for S3+ enforcement.
 */
export function shouldBlockForScanStatus(
  status: MalwareScanStatus,
  opts: { allowLegacyUnknown?: boolean } = {},
): boolean {
  if (status === "CLEAN") return false;
  if (status === "UNKNOWN") return !opts.allowLegacyUnknown;
  // PENDING, INFECTED, ERROR → always block.
  return true;
}

/** True only when the file passed a real scan. */
export function isFileScanClean(target: ScanTarget): boolean {
  return target.scanStatus === "CLEAN";
}

/** True while a scan is queued/running. */
export function isFileScanPending(target: ScanTarget): boolean {
  return target.scanStatus === "PENDING";
}

/** Whether this file should currently be blocked (see `shouldBlockForScanStatus`). */
export function isFileScanBlocked(
  target: ScanTarget,
  opts: { allowLegacyUnknown?: boolean } = {},
): boolean {
  return shouldBlockForScanStatus(target.scanStatus, opts);
}

/**
 * The KDP Readiness Agent must only run on files that passed a real scan —
 * strict, no legacy allowance. Rule: `if (scanStatus !== "CLEAN") refuse`.
 */
export function canRunKdpReadiness(target: ScanTarget): boolean {
  return target.scanStatus === "CLEAN";
}
