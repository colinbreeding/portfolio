# Colin Breeding — Personal Site

A minimal, dark personal site built with **Next.js (App Router)**, **Tailwind CSS**, and **shadcn/ui**. Single landing page: a prose About section, social links, and a contact block.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build for production:

```bash
npm run build
npm run start
```

## Editing your content

Almost everything lives in **`lib/site-config.ts`** — your name, social URLs, and email. Change them there and the header, socials, contact, and footer all update.

A few specifics:

- **Bio** — written as JSX in `components/about.tsx` so you can bold words and add inline links. Replace the `[bracketed]` placeholders.
- **Profile photo** — `components/about.tsx` has a placeholder circle. Drop an image in `public/` (e.g. `public/me.jpg`) and swap in the commented `next/image` snippet that's already there.
- **Section title sizes** — `About` and `Get in touch` use `text-lg` in their components.
- **Theme** — dark only, applied via `className="dark"` on `<html>` in `app/layout.tsx`. Colors are CSS variables in `app/globals.css`.

## Adding a Projects section later

The mockup originally had a Projects spotlight (e.g. your Zerro app). It isn't included now, but to add it back: create `components/projects.tsx`, render it in `app/page.tsx`, and (optionally) drive entries from an array in `lib/site-config.ts` so adding a project is a one-line change.

## shadcn/ui

This project is wired for shadcn (`components.json`, `lib/utils.ts`, `components/ui/button.tsx`, theme tokens in `globals.css`). To add more components:

```bash
npx shadcn@latest add card badge dropdown-menu
```

## Deploy

Easiest is **Vercel**: push this repo to GitHub, import it at vercel.com, and it deploys with zero config. Or run `npx vercel` from this folder.

## Stack

- Next.js 14 · React 18 · TypeScript
- Tailwind CSS 3 + tailwindcss-animate
- shadcn/ui (Button) · react-icons (brand icons)
- Dark theme only
