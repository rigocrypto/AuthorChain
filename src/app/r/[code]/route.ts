import { NextResponse } from "next/server";
import {
  resolveActiveReferral,
  incrementReferralClick,
} from "@/lib/data/referrals";

/**
 * Public referral redirect. Resolves a referral code to its book, records the
 * click, drops a 30-day referral cookie, and forwards to the public book page.
 * Invalid / inactive codes, or books that aren't published + visible, safely
 * redirect to /explore — never exposing internal details.
 */
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
): Promise<Response> {
  const { code } = await params;

  const ref = await resolveActiveReferral(code);
  if (!ref) {
    return NextResponse.redirect(new URL("/explore", req.url));
  }

  await incrementReferralClick(ref.linkId);

  const res = NextResponse.redirect(
    new URL(`/book/${ref.slug}?ref=${encodeURIComponent(code)}`, req.url),
  );
  res.cookies.set("authorchain_ref", code, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
  return res;
}
