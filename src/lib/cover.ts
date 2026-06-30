/**
 * Deterministic placeholder cover gradient. Until books have real cover images
 * (coverUrl), we derive a stable Tailwind gradient from the book's id/slug so
 * the same book always looks the same.
 */
const PALETTE = [
  "from-indigo-500 to-cyan-400",
  "from-violet-500 to-fuchsia-400",
  "from-amber-500 to-rose-400",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-blue-400",
  "from-pink-500 to-purple-400",
];

export function coverGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
