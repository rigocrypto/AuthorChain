import { toSVG } from "bwip-js/node";
import { isValidIsbn13, normalizeIsbn } from "./isbn";

/**
 * ISBN barcode generation. An ISBN-13 *is* an EAN-13, so we render the standard
 * Bookland EAN-13 symbol (SVG — no native canvas dependency). This is a
 * preview/export asset, not a print-certified artifact.
 */
export function generateIsbnBarcodeSvg(rawIsbn13: string): string {
  const isbn13 = normalizeIsbn(rawIsbn13);
  if (!isValidIsbn13(isbn13)) {
    throw new Error("Cannot generate a barcode for an invalid ISBN-13.");
  }
  return toSVG({
    bcid: "ean13",
    text: isbn13,
    includetext: true,
    guardwhitespace: true,
    textxalign: "center",
    height: 12,
  });
}
