/**
 * Ambient ReaderChain background image, shown behind the public reader-facing
 * book pages (/explore and /book/[slug]). Fixed, decorative, with a dark gradient
 * so cards and text stay readable. Served from public/background1.png.
 */
export function ReaderBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: "url(/background1.png)" }}
      />
      {/* Even vertical scrim — lighter than before so the artwork clearly reads
          through, while keeping the header and lower content legible. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background/85" />
    </div>
  );
}
