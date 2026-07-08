// Upload scan gate (Security phase S2). Server-only.
//
// Shared seam that every upload-ingest path (manuscript, cover, back-cover,
// preview — both the presigned-R2 `finalize*` path and the local proxied
// `save*/store*` path) runs freshly-received bytes through before an asset is
// recorded. CLEAN → fields to persist on the row; INFECTED/ERROR → a rejection
// code (fail closed). New uploads only; legacy rows keep their existing status.

import type { MalwareScanStatus, Prisma } from "@prisma/client";
import { scanBufferForMalware } from "./malware-scanner";

/** Scan columns to write on a BookFile / BookAsset row. */
export type ScanPersistFields = {
  scanStatus: MalwareScanStatus;
  scanProvider: string | null;
  scannedAt: Date | null;
  scanResult: Prisma.InputJsonValue | undefined;
};

export type ScanGate =
  | { ok: true; persist: ScanPersistFields }
  | { ok: false; code: "SCAN_INFECTED" | "SCAN_UNAVAILABLE" };

/**
 * Scan freshly-ingested upload bytes. On CLEAN returns the row fields to persist;
 * otherwise a safe rejection code (INFECTED vs unavailable/ERROR). The caller is
 * responsible for deleting/quarantining any already-stored object on rejection
 * and for surfacing a localized, non-technical message.
 */
export async function scanUploadOrReject(
  bytes: Uint8Array,
  meta: { fileName?: string; mimeType?: string; size?: number },
): Promise<ScanGate> {
  const scan = await scanBufferForMalware(bytes, meta);

  if (scan.verdict === "CLEAN") {
    return {
      ok: true,
      persist: {
        scanStatus: "CLEAN",
        scanProvider: scan.provider,
        scannedAt: new Date(scan.scannedAt),
        // Sanitized, minimal — never raw scanner output or storage paths.
        scanResult: {
          code: scan.code ?? "SCAN_OK",
          provider: scan.provider ?? null,
          scannedAt: scan.scannedAt,
        },
      },
    };
  }

  if (scan.verdict === "INFECTED") return { ok: false, code: "SCAN_INFECTED" };
  return { ok: false, code: "SCAN_UNAVAILABLE" };
}

/**
 * Persist fields for a server-GENERATED asset (e.g. the ISBN barcode SVG) that
 * never contains user-uploaded bytes — clean by origin, not by scan.
 */
export function originCleanPersist(): ScanPersistFields {
  return {
    scanStatus: "CLEAN",
    scanProvider: "origin",
    scannedAt: new Date(),
    scanResult: undefined,
  };
}
