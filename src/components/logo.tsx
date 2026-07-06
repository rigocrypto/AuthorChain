import Link from "next/link";
import Image from "next/image";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold">
      <Image
        src="/brand/authorchain-icon-512.png"
        alt=""
        width={32}
        height={32}
        priority
        className="h-8 w-8 rounded-lg"
      />
      <span className="ac-gradient-text text-lg">AuthorChain</span>
    </Link>
  );
}
