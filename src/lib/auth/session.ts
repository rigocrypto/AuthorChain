import { prisma } from "@/lib/db";
import type { Author } from "@prisma/client";

/**
 * Auth foundation (Phase 2) — INTENTIONALLY a placeholder.
 *
 * There is no real login yet: the "session" is the seeded demo author. Every
 * server action / page that needs the current author goes through here, so when
 * we add real auth (NextAuth/Auth.js, Clerk, or Supabase Auth in Phase 3) we
 * only change this one function — callers stay the same.
 */
export const DEMO_AUTHOR_EMAIL = "rigovivas71@gmail.com";

export async function getCurrentAuthor(): Promise<Author> {
  const author = await prisma.author.findUnique({
    where: { email: DEMO_AUTHOR_EMAIL },
  });

  if (!author) {
    throw new Error(
      "No demo author found. Run `npm run db:seed` to create the demo session.",
    );
  }

  return author;
}
