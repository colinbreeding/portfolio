// ─────────────────────────────────────────────────────────────
// Edit your site content here. Most things live in this one file.
// ─────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "Colin Breeding",
  description: "Personal site of Colin Breeding.",

  // Each string is one paragraph in the About section.
  // Swap the [bracketed] placeholders for your real bio.
  about: [
    "I'm a [your role] based in [your city]. I build [the kind of thing you build] and care a lot about [your focus].",
    "I got into this through [a short origin story]. I've worked on [companies / open source], and these days I focus on [current focus].",
    "Outside of work I [a personal line]. You can reach me through any of the links below.",
  ],

  // Set these to your real profile URLs.
  socials: {
    x: "https://x.com/colinbreeding",
    github: "https://github.com/colinbreeding",
    linkedin: "https://www.linkedin.com/in/colinmbreeding/",
  },

  email: "colinmbreeding@gmail.com",

  // Link target for the "DM me on X" line in Get in touch.
  dmUrl: "https://x.com/colinbreeding",
};

export type SiteConfig = typeof siteConfig;
