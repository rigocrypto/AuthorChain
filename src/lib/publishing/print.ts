import type {
  PrintTrimSize,
  PrintInteriorColor,
  PrintPaperType,
  PrintBinding,
  PrintCoverFinish,
} from "@prisma/client";

/**
 * Print edition helpers — trim-size presets, spine-width estimation, and
 * human-readable labels for the print enums. Display/metadata only; these are
 * industry-standard estimates, not a certified print spec.
 */

export type TrimDimensions = { widthIn: number; heightIn: number; label: string };

/** Standard trim presets (inches). CUSTOM is resolved from stored width/height. */
const TRIM_PRESETS: Record<Exclude<PrintTrimSize, "CUSTOM">, TrimDimensions> = {
  POCKET_4_25X6_87: { widthIn: 4.25, heightIn: 6.87, label: "4.25 × 6.87 in" },
  DIGEST_5_5X8_5: { widthIn: 5.5, heightIn: 8.5, label: "5.5 × 8.5 in" },
  US_TRADE_6X9: { widthIn: 6, heightIn: 9, label: "6 × 9 in" },
  ROYAL_6_14X9_21: { widthIn: 6.14, heightIn: 9.21, label: "6.14 × 9.21 in" },
  US_LETTER_8_5X11: { widthIn: 8.5, heightIn: 11, label: "8.5 × 11 in" },
  SQUARE_8_5X8_5: { widthIn: 8.5, heightIn: 8.5, label: "8.5 × 8.5 in" },
};

export const TRIM_SIZE_LABELS: Record<PrintTrimSize, string> = {
  POCKET_4_25X6_87: "Pocket · 4.25 × 6.87 in",
  DIGEST_5_5X8_5: "Digest · 5.5 × 8.5 in",
  US_TRADE_6X9: "US Trade · 6 × 9 in",
  ROYAL_6_14X9_21: "Royal · 6.14 × 9.21 in",
  US_LETTER_8_5X11: "US Letter · 8.5 × 11 in",
  SQUARE_8_5X8_5: "Square · 8.5 × 8.5 in",
  CUSTOM: "Custom size",
};

export const INTERIOR_COLOR_LABELS: Record<PrintInteriorColor, string> = {
  BLACK_AND_WHITE: "Black & white",
  STANDARD_COLOR: "Standard color",
  PREMIUM_COLOR: "Premium color",
};

export const PAPER_TYPE_LABELS: Record<PrintPaperType, string> = {
  WHITE: "White",
  CREAM: "Cream",
  COLOR: "Color",
};

export const BINDING_LABELS: Record<PrintBinding, string> = {
  PERFECT_BOUND: "Perfect bound (paperback)",
  HARDCOVER_CASE_LAMINATE: "Hardcover · case laminate",
  HARDCOVER_DUST_JACKET: "Hardcover · dust jacket",
  SADDLE_STITCH: "Saddle stitch",
  COIL_WIRE_O: "Coil / Wire-O",
};

export const COVER_FINISH_LABELS: Record<PrintCoverFinish, string> = {
  MATTE: "Matte",
  GLOSSY: "Glossy",
};

/** Resolve the trim dimensions for a book's settings (preset or custom). */
export function resolveTrimDimensions(settings: {
  trimSize: PrintTrimSize;
  trimWidthIn: number | null;
  trimHeightIn: number | null;
}): TrimDimensions | null {
  if (settings.trimSize === "CUSTOM") {
    if (
      settings.trimWidthIn &&
      settings.trimHeightIn &&
      settings.trimWidthIn > 0 &&
      settings.trimHeightIn > 0
    ) {
      const w = round2(settings.trimWidthIn);
      const h = round2(settings.trimHeightIn);
      return { widthIn: w, heightIn: h, label: `${w} × ${h} in` };
    }
    return null;
  }
  return TRIM_PRESETS[settings.trimSize];
}

// Industry-standard per-page thickness multipliers (inches) used to estimate
// the spine width from the interior page count.
const SPINE_MULTIPLIER_IN: Record<PrintPaperType, number> = {
  WHITE: 0.002252,
  CREAM: 0.0025,
  COLOR: 0.002347,
};

/**
 * Estimate spine width (inches) from page count + paper type. Returns null when
 * the page count is missing or non-positive. Rounded to 3 decimals.
 */
export function computeSpineWidthIn(
  pageCount: number | null | undefined,
  paperType: PrintPaperType,
): number | null {
  if (!pageCount || pageCount <= 0) return null;
  const raw = pageCount * SPINE_MULTIPLIER_IN[paperType];
  return Math.round(raw * 1000) / 1000;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Inches → millimetres, rounded to 1 decimal (for display alongside inches). */
export function inToMm(inches: number): number {
  return Math.round(inches * 25.4 * 10) / 10;
}
