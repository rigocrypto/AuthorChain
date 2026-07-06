/**
 * Ambient background image, shown behind public pages (home, /explore,
 * /book/[slug]). Fixed, decorative, with a dark gradient so cards and text stay
 * readable. `src` defaults to the ReaderChain artwork; the home page passes its
 * own. Served from /public.
 */
export function ReaderBackground({ src = "/background1.png" }: { src?: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: `url(${src})` }}
      />
      {/* Even vertical scrim — lighter than before so the artwork clearly reads
          through, while keeping the header and lower content legible. */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background/85" />
    </div>
  );
}
