import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { Reader } from "@prisma/client";

/**
 * Reader session (MVP) — INTENTIONALLY a lightweight placeholder, like the author
 * placeholder in `session.ts`. There is no reader login form yet: a reader proves
 * identity by completing a real Stripe checkout, after which the claim route
 * (`/api/reader/claim`) issues a signed cookie tied to their Reader id.
 *
 * The token is an HMAC-signed `readerId.expiry` string (not encryption — the id
 * isn't secret; the signature just prevents forgery). Swap this whole module for
 * NextAuth/Clerk/Supabase later without touching callers.
 */
const COOKIE = "reader_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Cookie name + options, for setting on a NextResponse in a route handler. */
export const READER_COOKIE = COOKIE;
export function readerCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

// Dev fallback is clearly insecure and for local development only. Set AUTH_SECRET.
function secret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-reader-secret-set-AUTH_SECRET";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function signReaderToken(readerId: string): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${readerId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyReaderToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [readerId, exp, sig] = parts;
  const payload = `${readerId}.${exp}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(exp) < Date.now()) return null;
  return readerId;
}

/** Set the reader session cookie (call from a route handler / server action). */
export async function setReaderSession(readerId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, signReaderToken(readerId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearReaderSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** The signed-in reader from the cookie, or null. */
export async function getCurrentReader(): Promise<Reader | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const readerId = verifyReaderToken(token);
  if (!readerId) return null;
  return prisma.reader.findUnique({ where: { id: readerId } });
}
