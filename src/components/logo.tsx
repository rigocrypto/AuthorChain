import Link from "next/link";
import Image from "next/image";

/**
 * AuthorChain brand mark (icon + wordmark). `imgClassName`/`textClassName` let
 * callers scale it per context — e.g. a larger mark in the marketing header vs.
 * the compact dashboard sidebar. Defaults match the compact size.
 */
export function Logo({
  href = "/",
  imgClassName = "h-8 w-8",
  textClassName = "text-lg",
}: {
  href?: string;
  imgClassName?: string;
  textClassName?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold">
      <Image
        src="/brand/authorchain-icon-512.png"
        alt=""
        width={48}
        height={48}
        priority
        className={`${imgClassName} rounded-lg`}
      />
      <span className={`ac-gradient-text ${textClassName}`}>AuthorChain</span>
    </Link>
  );
}
