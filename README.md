# MONOLITH® — Architecture & Spatial Design Studio (concept website)

🔗 **Live demo: https://acadimy.vercel.app**

A fictional, award-style architecture studio website built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Motion · React Three Fiber · Lenis**.

> MONOLITH® is a fictional studio. All projects, people, figures, awards and addresses are invented for this concept.
> The contact form is a **demo** — no email service is connected and nothing is sent.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

## Routes

`/` · `/work` · `/work/[slug]` (6 projects) · `/studio` · `/approach` · `/journal` · `/journal/[slug]` (6 articles) · `/contact` · `sitemap.xml` · `robots.txt`

## Structure

```
src/app            routes, metadata, sitemap, robots
src/components     layout/ ui/ home/ work/ studio/ approach/ journal/ contact/
src/data           bilingual content: projects, journal, studio, UI dictionary (EN/AR)
src/lib            i18n, theme, motion (easing/durations/hooks), persisted store, SEO helper
tools/render       Three.js → headless-Chrome pipeline that produced every image in /public/images
```

## Imagery

All imagery is **original studio visualisation** rendered from procedural 3D models (no stock photos, no licensing,
no remote image dependencies). To re-render: `npm run render -- <scene> [shot|all]`
(scenes: `silent horizon courtyard formLight desert observatory hero workshop mat-concrete mat-stone mat-timber mat-glass mat-metal`).
Requires Google Chrome (path set in `tools/render/run.mjs`) and the `puppeteer-core` dev dependency.

## Design system

Semantic tokens live in `src/app/globals.css` (`--bg`, `--fg`, `--brand`, `--copper`, …) with separately art-directed
light and dark themes. Fonts: Manrope (UI), DM Serif Display (display), IBM Plex Mono (technical), IBM Plex Sans Arabic (Arabic).
Layout uses logical properties (`ms-`, `ps-`, `start-`, `end-`) so RTL is a true mirror rather than a patch.

## Motion

One timing language (`src/lib/motion.ts`). Reveals use IntersectionObserver + GSAP; scrubbed sequences use ScrollTrigger
(`BlueprintReality`, parallax, timelines); Lenis smooth scroll is synchronised with ScrollTrigger. Everything is skipped
under `prefers-reduced-motion`, and content is visible by default without JS (hidden-until-revealed states only apply
when `html.anim` is set by the boot script).

## Verification scripts (optional, need Chrome)

`tools/with-server.mjs <script>` starts the production server and runs: `tools/test.mjs` (all routes: console errors, broken images,
horizontal overflow, screenshots), `tools/interact.mjs` (25 functional checks), `tools/scroll.mjs` (section screenshots).
