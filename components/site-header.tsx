import Link from "next/link";

import { FaXTwitter } from "react-icons/fa6";

import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex max-w-xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
        >
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-5">
          <a
            href={siteConfig.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaXTwitter className="h-3 w-3" />
            Follow me
          </a>
        </nav>
      </div>
    </header>
  );
}
