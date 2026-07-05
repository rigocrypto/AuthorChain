/**
 * Ambient ReaderChain background image, shown behind the public reader-facing
 * book pages (/explore and /book/[slug]). Fixed, decorative, with a dark gradient
 * so cards and text stay readable. Served from public/background1.png.
 */
export function ReaderBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url(/background1.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/80 to-background/95" />
    </div>
  );
}
