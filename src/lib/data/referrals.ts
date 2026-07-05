import { randomBytes } from "node:crypto";
import type { BookReferralLink } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPublicBookBySlug, type PublicBookDTO } from "@/lib/data/books";

/**
 * Book referral links — shareable, tracked links for a book. Analytics only:
 * clicks, checkout starts, and completed sales. No payouts or commissions.
 * All author-facing reads/writes are scoped by authorId.
 */

const ALPHABET =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no easily-confused chars

/** Short, URL-safe, non-sequential code (no internal ids exposed). */
function randomCode(len = 8): string {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

export type ReferralLinkDTO = {
  id: string;
  code: string;
  label: string | null;
  isActive: boolean;
  clickCount: number;
  checkoutCount: number;
  saleCount: number;
};

function toDTO(r: BookReferralLink): ReferralLinkDTO {
  return {
    id: r.id,
    code: r.code,
    label: r.label,
    isActive: r.isActive,
    clickCount: r.clickCount,
    checkoutCount: r.checkoutCount,
    saleCount: r.saleCount,
  };
}

/** The author's referral link for a book, or null. Owner-scoped. */
export async function getReferralForBook(
  bookId: string,
  authorId: string,
): Promise<ReferralLinkDTO | null> {
  const link = await prisma.bookReferralLink.findFirst({
    where: { bookId, authorId },
  });
  return link ? toDTO(link) : null;
}

/** Get-or-create the single referral link for a book. Owner-scoped; null if not owned. */
export async function getOrCreateReferralLink(
  bookId: string,
  authorId: string,
): Promise<ReferralLinkDTO | null> {
  const owns = await prisma.book.findFirst({
    where: { id: bookId, authorId },
    select: { id: true },
  });
  if (!owns) return null;

  const existing = await prisma.bookReferralLink.findFirst({
    where: { bookId, authorId },
  });
  if (existing) return toDTO(existing);

  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const created = await prisma.bookReferralLink.create({
        data: { bookId, authorId, code: randomCode() },
      });
      return toDTO(created);
    } catch (e) {
      // Unique-code collision → retry a few times before giving up.
      if (attempt === 5) throw e;
    }
  }
  return null;
}

/** Toggle a referral link active/inactive. Owner-scoped. */
export async function setReferralActive(
  linkId: string,
  authorId: string,
  isActive: boolean,
): Promise<void> {
  await prisma.bookReferralLink.updateMany({
    where: { id: linkId, authorId },
    data: { isActive },
  });
}

/**
 * Resolve an active referral for the public /r/[code] redirect. Returns the
 * target slug only when the link is active AND the book is published + not
 * archived — otherwise null (caller redirects to /explore).
 */
export async function resolveActiveReferral(
  code: string,
): Promise<{ linkId: string; slug: string } | null> {
  const link = await prisma.bookReferralLink.findUnique({
    where: { code },
    include: { book: { select: { slug: true, status: true, archivedAt: true } } },
  });
  if (!link || !link.isActive) return null;
  if (link.book.status !== "PUBLISHED" || link.book.archivedAt) return null;
  return { linkId: link.id, slug: link.book.slug };
}

/**
 * Resolve an active referral to its public book for the /share/[code] social
 * landing page. Returns null unless the link is active AND the book is public
 * (published + not archived) — never exposes drafts/archived/inactive books.
 */
export async function resolveShareLanding(
  code: string,
): Promise<{ code: string; book: PublicBookDTO } | null> {
  const ref = await resolveActiveReferral(code);
  if (!ref) return null;
  const book = await getPublicBookBySlug(ref.slug);
  if (!book) return null;
  return { code, book };
}

/** Validate a referral code for checkout attribution against a specific book. */
export async function resolveReferralForCheckout(
  code: string,
  bookId: string,
): Promise<{ linkId: string; code: string } | null> {
  const link = await prisma.bookReferralLink.findUnique({
    where: { code },
    select: { id: true, code: true, bookId: true, isActive: true },
  });
  if (!link || !link.isActive || link.bookId !== bookId) return null;
  return { linkId: link.id, code: link.code };
}

/** Best-effort counters — never throw into the caller (tracking must not break flows). */
export async function incrementReferralClick(linkId: string): Promise<void> {
  try {
    await prisma.bookReferralLink.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    });
  } catch {
    /* analytics only */
  }
}

export async function incrementReferralCheckout(linkId: string): Promise<void> {
  try {
    await prisma.bookReferralLink.update({
      where: { id: linkId },
      data: { checkoutCount: { increment: 1 } },
    });
  } catch {
    /* analytics only */
  }
}

export async function incrementReferralSale(linkId: string): Promise<void> {
  try {
    await prisma.bookReferralLink.update({
      where: { id: linkId },
      data: { saleCount: { increment: 1 } },
    });
  } catch {
    /* analytics only */
  }
}
