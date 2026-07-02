import { cookies } from "next/headers";
import { PrivyClient } from "@privy-io/server-auth";

/**
 * Server-side bridge to Privy (account-abstraction auth). This is the ONLY place
 * that talks to Privy's server SDK. It reads Privy's auth cookies, verifies the
 * access token, and resolves the user's verified email + embedded wallet — which
 * the author/reader session layers then map to our own Prisma records.
 *
 * Everything degrades gracefully: with no Privy env configured, this returns null
 * and callers treat the request as unauthenticated (never a crash).
 */
export type PrivyUser = {
  privyUserId: string;
  email: string | null;
  walletAddress: string | null;
};

/** True when Privy is configured (app id + secret present). */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID && process.env.PRIVY_APP_SECRET,
  );
}

let _client: PrivyClient | null = null;
function client(): PrivyClient | null {
  if (!isAuthConfigured()) return null;
  if (!_client) {
    _client = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
      process.env.PRIVY_APP_SECRET as string,
    );
  }
  return _client;
}

/**
 * The authenticated Privy user for this request, or null. Verifies the access
 * token (the security check), then resolves email/wallet from the identity token
 * (no rate limit), falling back to the API by id if the identity token is absent.
 */
export async function getPrivyUser(): Promise<PrivyUser | null> {
  const privy = client();
  if (!privy) return null;

  const store = await cookies();
  const accessToken = store.get("privy-token")?.value;
  const idToken = store.get("privy-id-token")?.value;
  if (!accessToken) return null;

  try {
    const claims = await privy.verifyAuthToken(
      accessToken,
      process.env.PRIVY_VERIFICATION_KEY,
    );

    const user = idToken
      ? await privy.getUser({ idToken })
      : await privy.getUserById(claims.userId);

    return {
      privyUserId: claims.userId,
      email: user.email?.address ?? null,
      walletAddress: user.wallet?.address ?? null,
    };
  } catch {
    // Invalid/expired token, or Privy unreachable — treat as unauthenticated.
    return null;
  }
}
