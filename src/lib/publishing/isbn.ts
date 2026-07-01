/**
 * ISBN utilities. AuthorChain never *issues* ISBNs — authors provide their own
 * assigned ISBN (from Bowker/MyIdentifiers in the US, or their national agency).
 * We only normalize and validate what they enter.
 */

/** Strip spaces and hyphens; uppercase (for a trailing 'X' in ISBN-10). */
export function normalizeIsbn(raw: string): string {
  return raw.replace(/[\s-]/g, "").toUpperCase();
}

/** Validate an ISBN-13 (13 digits + EAN-13 check digit). */
export function isValidIsbn13(raw: string): boolean {
  const isbn = normalizeIsbn(raw);
  if (!/^\d{13}$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return check === Number(isbn[12]);
}

/** Validate an ISBN-10 (9 digits + mod-11 check, last char may be 'X'). */
export function isValidIsbn10(raw: string): boolean {
  const isbn = normalizeIsbn(raw);
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(isbn[i]) * (10 - i);
  sum += isbn[9] === "X" ? 10 : Number(isbn[9]);
  return sum % 11 === 0;
}

export type IsbnCheck =
  | { ok: true; isbn13: string }
  | { ok: false; error: string };

/** Validate an ISBN-13 input and return the normalized value or a clear error. */
export function checkIsbn13(raw: string): IsbnCheck {
  const isbn = normalizeIsbn(raw);
  if (isbn.length === 0) return { ok: false, error: "Enter an ISBN-13." };
  if (!/^\d{13}$/.test(isbn)) {
    return { ok: false, error: "ISBN-13 must be exactly 13 digits." };
  }
  if (!isValidIsbn13(isbn)) {
    return { ok: false, error: "Invalid ISBN-13 (check digit does not match)." };
  }
  return { ok: true, isbn13: isbn };
}
