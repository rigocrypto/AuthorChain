/**
 * Public contact + social links for header/footer/JSON-LD. Env overrides the
 * built-in defaults so marketing can change them without a code deploy.
 * Never put secrets here — only public addresses.
 */

function envRaw(key: string): string | null {
  const v = process.env[key]?.trim();
  return v ? v : null;
}

function envEmail(key: string): string | null {
  const v = envRaw(key);
  if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return null;
  return v;
}

/**
 * Accept full URLs or bare domains (e.g. `www.linkedin.com/in/...`).
 * Strips tracking query params for cleaner public links.
 */
function normalizePublicUrl(raw: string): string | null {
  let input = raw.trim();
  if (!input) return null;
  if (!/^https?:\/\//i.test(input)) {
    // Bare domain / path → assume https
    input = `https://${input.replace(/^\/+/, "")}`;
  }
  try {
    const u = new URL(input);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    // Reject bare hostnames like "https://rigocrypto" (no TLD) — common handle
    // mistake that produces broken external links in audits.
    const host = u.hostname;
    if (host !== "localhost" && !host.includes(".")) return null;
    // Drop common share/tracking params
    u.searchParams.delete("si");
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    // Drop trailing slash on path-only roots; keep path for profiles
    let out = u.toString();
    if (u.pathname === "/" && !u.search && !u.hash) {
      out = out.replace(/\/+$/, "");
    }
    return out;
  } catch {
    return null;
  }
}

function envUrl(key: string): string | null {
  const v = envRaw(key);
  return v ? normalizePublicUrl(v) : null;
}

/** Discord is often a username/handle, not a URL — keep both forms. */
function resolveDiscord(): { href: string | null; handle: string | null } {
  const raw = envRaw("NEXT_PUBLIC_SOCIAL_DISCORD") ?? "rigocrypto";
  const asUrl = normalizePublicUrl(raw);
  if (asUrl) return { href: asUrl, handle: null };
  // Username / tag (no protocol)
  const handle = raw.replace(/^@/, "").trim();
  return handle ? { href: null, handle } : { href: null, handle: null };
}

const discord = resolveDiscord();

export const siteContact = {
  email: envEmail("NEXT_PUBLIC_CONTACT_EMAIL") ?? "rigovivas71@gmail.com",
  /** Optional public support / press form URL. */
  formUrl: envUrl("NEXT_PUBLIC_CONTACT_FORM_URL"),
  social: {
    github:
      envUrl("NEXT_PUBLIC_SOCIAL_GITHUB") ??
      "https://github.com/rigocrypto/AuthorChain",
    x: envUrl("NEXT_PUBLIC_SOCIAL_X") ?? "https://x.com/rigo_crypto",
    linkedin:
      envUrl("NEXT_PUBLIC_SOCIAL_LINKEDIN") ??
      "https://www.linkedin.com/in/rigo-crypto-491204366",
    /** Invite or profile URL when provided; otherwise null (see discordHandle). */
    discord: discord.href,
    youtube:
      envUrl("NEXT_PUBLIC_SOCIAL_YOUTUBE") ??
      "https://www.youtube.com/@rigocrypto",
  },
  /** Shown when Discord is a username rather than a link. */
  discordHandle: discord.handle,
} as const;

export type SocialKey = keyof typeof siteContact.social;
