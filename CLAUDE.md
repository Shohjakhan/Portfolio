@AGENTS.md

# Portfolio — Project Rules & Design Vision

This file is the permanent source of truth for how this project is built.
Read it before making structural changes. It supersedes generic instincts
("this looks like a normal dev portfolio, let me build it like one").

## 1. Locked-in stack (do not swap frameworks)

- **Next.js 15 (App Router)** — `src/app`, React Server Components by default,
  `"use client"` only where interactivity requires it.
- **React 19**, **TypeScript strict** (`tsconfig.json` has `strict: true` — keep it).
- **Tailwind CSS v4**, config-free, tokens defined via `@theme` in
  `src/styles/variables.css`. Don't reintroduce a `tailwind.config.js`.
- **npm** is the package manager (`package-lock.json` is the only lockfile —
  never add `yarn.lock` / `pnpm-lock.yaml`).
- Path alias `@/*` → `src/*`.

This stack is confirmed capable of the interactive illustrated-room concept
below. Do not migrate to Vite/Astro/Remix/plain React or rewrite in another
framework without an explicit request — the audit that produced this file
found no technical blocker that would justify it.

Note: `AGENTS.md` claims this Next.js build has undocumented breaking
changes and points to `node_modules/next/dist/docs/` for guides. That
directory does not currently exist in this install — treat the claim as
unverifiable rather than acting on it blindly. If something behaves
unexpectedly, verify against actual runtime behavior first.

## 2. Design vision — "the little universe" room

The site is being rebuilt from a generic scrolling developer-portfolio
layout into a single illustrated room/world (reference: `docs/design-reference.png`).
Do not treat that reference as a static image to slice and ship — it's mood
and composition reference for a *layered, interactive* scene.

**Scene contents:** large window (sky changes, moon/stars at night), bookshelf,
a cat sleeping near plants on top of the bookshelf, a wall/gallery of paintings,
easel + paintbrushes, laptop, coffee cup, journal, retro rotary phone, framed
photographs, a movie poster, small decorative objects, warm magical lighting
(fairy lights, a lamp).

**Interaction model:**
- Hover an object → subtle reaction (glow, tilt, wiggle) + a short label
  revealing what it represents (see reference image's callout cards).
- Click an object → opens that portfolio section.
- Mapping: Coffee → About Me · Laptop → Projects/Experience/Achievements/Events/Research
  · Bookshelf → Writings/Fantasy Novel/Books · Paintings/Easel → Art ·
  Journal → Instagram + Telegram · Photo wall → Memories/Media ·
  Movie poster → Movies · Retro phone → Contact.

**Living environment (gradual, never abrupt):**
- Time-of-day cycle (sky color, lighting, lamp on/off).
- Moving clouds, moon/stars at night, optional rain/snow.
- Plants sway gently; cat has idle animation and occasionally moves/wakes.
- Ambient particles (dust motes, fireflies, embers depending on time).
- Every object has a subtle idle animation, not just hover state.

**Custom cursor:** a feather/quill, replacing the system cursor.

**Tone:** whimsical, magical, artistic, cozy, slightly mysterious,
storybook, handcrafted, elegant, warm.
**Explicitly avoid:** futuristic/cyberpunk aesthetics, corporate SaaS look,
generic "hero + card grid" developer-portfolio conventions, excessive
glassmorphism.

## 3. Critical architectural principle: layered, independent objects

Build the room as **composable, independently animatable pieces**, not one
flattened illustration:
- Each interactive object (cat, lamp, cloud, curtain, plant, phone, etc.)
  should be its own component/layer so it can animate, react to hover, and
  update on its own animation loop without re-rendering or coupling to
  siblings.
- Prefer SVG or layered image/sprite composition over a single baked
  background image, specifically so hover/click hit-areas and independent
  motion are possible per-object.
- Scene-wide state (time of day, weather, which panel is open) should live
  in a small shared store/context that individual object components read
  from — objects should not need to know about each other.
- This principle applies going forward; it does not need to be fully
  realized in any single task. Land it incrementally.

## 4. Working agreed (from the architectural audit)

- This is an **audit-then-build** project. Don't jump ahead to implementing
  the room in a task explicitly scoped as audit/planning-only.
- Don't delete existing work without being asked, even code that looks
  superseded (e.g. `legacy-static/`) — flag it, don't remove it.
- The original linear-scroll section components (`Hero`, `About`, `Projects`,
  `Experience`, `Achievements`, `Speaking`, `Contact`, `Navbar`, `Footer`,
  `MainLayout`) have been removed (2026-08-31) now that the room panels cover
  their content — see [[room_first_visual_version]]-era memory for history.
  `src/app/page.tsx` renders `Room` directly; there is no separate `/room`
  preview route anymore. Content data files under `src/data/*.ts` and the
  `src/types/content.ts` shapes survived the cut and are what the room panels
  (e.g. `LaptopInterface`, `AboutExperience`) read from.
- No test suite exists yet (no test script, no Jest/Vitest/Playwright). Build
  (`npm run build`) and lint (`npm run lint`) are the only current
  verification gates — keep both green.

## 5. Commands

```bash
npm run dev     # start dev server
npm run build   # production build (also runs type-check)
npm run lint    # ESLint (flat config, next/core-web-vitals + next/typescript)
npm run start   # serve production build
```
