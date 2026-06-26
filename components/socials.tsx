import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";

import { siteConfig } from "@/lib/site-config";

const items = [
  { href: siteConfig.socials.x, label: "X", Icon: FaXTwitter, className: "h-[18px] w-[18px]" },
  { href: siteConfig.socials.github, label: "GitHub", Icon: FaGithub, className: "h-5 w-5" },
  { href: siteConfig.socials.linkedin, label: "LinkedIn", Icon: FaLinkedin, className: "h-5 w-5" },
];

export function Socials() {
  return (
    <section>
      <p className="mb-3 text-base text-muted-foreground">Find me here</p>
      <div className="flex gap-5 text-muted-foreground">
        {items.map(({ href, label, Icon, className }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="transition-all hover:-translate-y-0.5 hover:text-foreground"
          >
            <Icon className={className} />
          </a>
        ))}
      </div>
    </section>
  );
}
