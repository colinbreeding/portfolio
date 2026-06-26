import { siteConfig } from "@/lib/site-config";

export function Contact() {
  return (
    <section id="contact">
      <h2 className="mb-4 text-lg font-bold tracking-tight">Get in touch</h2>

      <p className="mb-2 text-base text-muted-foreground">
        Want to work together?{" "}
        <a
          href={siteConfig.dmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-muted-foreground/40 pb-px text-foreground transition-colors hover:border-foreground"
        >
          DM me on X &rarr;
        </a>
      </p>

      <p className="text-base text-muted-foreground">
        Email me at{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="border-b border-muted-foreground/40 pb-px text-foreground transition-colors hover:border-foreground"
        >
          {siteConfig.email}
        </a>
      </p>
    </section>
  );
}
