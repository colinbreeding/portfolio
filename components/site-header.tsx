import Image from "next/image";
import Link from "next/link";

import { FaXTwitter } from "react-icons/fa6";

import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex max-w-xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label={siteConfig.name}
          className="transition-opacity hover:opacity-80"
        >
          <Image
            src="/signature.png"
            alt=""
            width={2172}
            height={724}
            sizes="(min-width: 640px) 185px, 170px"
            priority
            className="relative -top-1 -left-4 h-auto w-[170px] brightness-0 invert sm:w-[185px]"
          />
        </Link>

        <nav className="flex items-center gap-5">
          <a
            href={siteConfig.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-xs text-foreground transition-colors"
          >
            <FaXTwitter className="h-3 w-3" />
            <span className="text-white transition-colors group-hover:text-foreground">
              Follow me
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
