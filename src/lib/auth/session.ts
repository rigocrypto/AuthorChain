import { prisma } from "@/lib/db";
import type { Author } from "@prisma/client";
import { getPrivyUser } from "./privy";

/**
 * Author auth. Backed by Privy (account abstraction): the authenticated Privy
 * user is linked to an existing `Author` by verified email on first login (which
 * also makes the seeded demo author "just work" when you log in with its email).
 *
 * Callers use `getCurrentAuthor()` (throws when unauthenticated, so actions are
 * secure by default) or `getOptionalAuthor()` (for the dashboard route guard).
 */
export const DEMO_AUTHOR_EMAIL = "rigovivas71@gmail.com";

/** The authenticated author, or null. Links Privy → Author by email on first login. */
export async function getOptionalAuthor(): Promise<Author | null> {
  const p = await getPrivyUser();
  if (!p) return null;

  const linked = await prisma.author.findUnique({
    where: { privyUserId: p.privyUserId },
  });
  if (linked) return linked;

  // First authenticated login: attach this Privy identity to an existing Author
  // by verified email. (Author onboarding for brand-new users is a later step.)
  if (p.email) {
    const byEmail = await prisma.author.findUnique({ where: { email: p.email } });
    if (byEmail && !byEmail.privyUserId) {
      return prisma.author.update({
        where: { id: byEmail.id },
        data: {
          privyUserId: p.privyUserId,
          walletAddress: byEmail.walletAddress ?? p.walletAddress,
        },
      });
    }
    if (byEmail) return byEmail;
  }

  // Authenticated, but not an author (e.g. a reader-only account).
  return null;
}

/** The authenticated author; throws when not signed in as an author. */
export async function getCurrentAuthor(): Promise<Author> {
  const author = await getOptionalAuthor();
  if (!author) {
    throw new Error("Unauthorized: author authentication required.");
  }
  return author;
}

/** Explicit guard for server actions (alias of getCurrentAuthor). */
export const requireAuthor = getCurrentAuthor;
