import { prisma } from "@/lib/db";
import type { Reader } from "@prisma/client";
import { getPrivyUser } from "./privy";

/**
 * Reader auth. Backed by Privy (account abstraction). A reader logs in with the
 * **same email they purchased with**; on first login the Privy identity is linked
 * to the `Reader` the Stripe webhook already created by `buyerEmail`. Entitlement
 * checks (and the 403 on the protected download) are unchanged.
 *
 * Replaces the previous HMAC signed-cookie placeholder.
 */

/** The authenticated reader, or null. Links Privy → Reader by email on first login. */
export async function getCurrentReader(): Promise<Reader | null> {
  const p = await getPrivyUser();
  if (!p) return null;

  const linked = await prisma.reader.findUnique({
    where: { privyUserId: p.privyUserId },
  });
  if (linked) return linked;

  if (p.email) {
    const byEmail = await prisma.reader.findUnique({ where: { email: p.email } });
    if (byEmail && !byEmail.privyUserId) {
      return prisma.reader.update({
        where: { id: byEmail.id },
        data: {
          privyUserId: p.privyUserId,
          walletAddress: byEmail.walletAddress ?? p.walletAddress,
        },
      });
    }
    if (byEmail) return byEmail;
  }

  // Authenticated but hasn't purchased anything yet — no reader record.
  return null;
}
