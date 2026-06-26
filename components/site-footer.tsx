import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-9 pb-12 pt-7">
      <div className="flex items-center justify-between">
        <small className="text-xs text-muted-foreground/80">
          &copy; {year} {siteConfig.name}
        </small>

        <div className="flex items-center gap-4 text-muted-foreground/80">
          <a
            href={siteConfig.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="transition-colors hover:text-foreground"
          >
            <FaXTwitter className="h-[14px] w-[14px]" />
          </a>
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-foreground"
          >
            <FaGithub className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-foreground"
          >
            <FaLinkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
