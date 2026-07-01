import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  READER_COOKIE,
  readerCookieOptions,
  signReaderToken,
} from "@/lib/auth/reader-session";

/**
 * Reader access claim. After a successful Stripe checkout the success page links
 * here with the session_id. We look up the Sale, resolve the buyer's Reader by
 * email, and set the signed reader-session cookie — then redirect to the library.
 *
 * The session_id is only used server-side; nothing about it is exposed to the
 * client. Access is gated by having completed a real checkout.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const libraryUrl = new URL("/reader/library", url.origin);

  if (!sessionId) return NextResponse.redirect(libraryUrl);

  const sale = await prisma.sale.findUnique({
    where: { stripeSessionId: sessionId },
    select: { buyerEmail: true },
  });
  if (!sale?.buyerEmail) return NextResponse.redirect(libraryUrl);

  // The webhook normally creates the Reader; upsert here too so the claim works
  // even if it briefly races the webhook.
  const reader = await prisma.reader.upsert({
    where: { email: sale.buyerEmail },
    update: {},
    create: { email: sale.buyerEmail },
  });

  const res = NextResponse.redirect(libraryUrl);
  res.cookies.set(
    READER_COOKIE,
    signReaderToken(reader.id),
    readerCookieOptions(),
  );
  return res;
}
