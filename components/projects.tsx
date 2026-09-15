import { siteConfig } from "@/lib/site-config";

export function Projects() {
  return (
    <section id="projects">
      <h2 className="mb-4 text-lg font-bold tracking-tight">Projects</h2>

      <div className="space-y-6">
        {siteConfig.projects.map((project) => (
          <div key={project.name}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-base">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-muted-foreground/40 pb-px text-foreground transition-colors hover:border-foreground"
                >
                  {project.name} &rarr;
                </a>
              </p>
              <time className="shrink-0 text-sm text-muted-foreground">
                {project.launched}
              </time>
            </div>
            <p className="text-base text-muted-foreground">
              {project.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
