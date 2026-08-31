# Art direction — visual style guide

Primary reference: `docs/design-reference.png` — a warm, cinematic, night-time
artist's study. This document translates that image into concrete guidance
for anyone producing final artwork for the room, and cross-references the
design tokens already defined in `src/styles/variables.css` so art and code
stay in the same palette rather than drifting apart.

**This is a target to build toward, not a description of what exists.**
Every current object asset is a flat-vector placeholder — see
`docs/asset-inventory.md` for the honest, per-object gap analysis.

## The feeling

Illustrated fantasy artist's study — whimsical, magical, artistic, cozy,
atmospheric, handcrafted, storybook-like, slightly mysterious, warm,
sophisticated. Think a painted scene from a narrative game or an animated
film's key art, not an app illustration.

**Explicitly not:** flat vector, generic cartoon, childish, SaaS
illustration, corporate, futuristic, cyberpunk, neon, glossy 3D, or generic
AI-stock-art blandness. If a piece of art could plausibly be a marketing
site's hero illustration, it's wrong for this room.

## Color

Every named bucket below already has a home in `variables.css` — reuse
these tokens rather than inventing new hex values, so the room's CSS
(glows, shadows, sky) and any future illustrated art read as one palette.

| Direction | Existing token(s) | Value |
|---|---|---|
| Warm cream | `--color-cream` | `#f6ecd9` |
| Aged parchment | `--color-paper` / `--color-paper-ink` | `#ede3cd` / `#33291d` |
| Natural wood | `--color-wood`, `--color-wood-dark`, `--room-wall-warm`, `--room-wall-dark` | `#4a3423`, `#2f2015`, `#3c2c1e`, `#2a2018` |
| Deep forest green | `--color-accent` / `--color-accent-hover` | `#214b3e` / `#2c6452` |
| Muted blue | `--room-moonlight`, `--sky-night-top`, `--sky-dusk-top` | `#7c8fc9`, `#0b1024`, `#34294f` |
| Dusty brown | `--color-ink-3`, blended with the wood tones above | `#9b9590` |
| Warm amber/gold | `--room-lamp-glow`, `--sky-dawn-bottom` | `#ffb870`, `#e8a978` |
| Restrained dark tones | `--color-ink`, `--room-wall-dark`, `--sky-night-top` | `#111111`, `#2a2018`, `#0b1024` |

General rule from the reference: the room is lit almost entirely by warm
practical sources (lamp, window moonlight, fairy lights) against dark
wood/wall tones — avoid pure white, avoid saturated primary colors, avoid
anything that reads as "UI blue" or "brand color" rather than "lamplight
and moonlight."

## Materials

The reference sells "handcrafted" primarily through material rendering, not
composition. Each material below should read distinctly in final art:

- **Wood** — visible grain direction, not a flat gradient. Warm mid-to-dark
  browns, occasional worn/lighter edges where light catches a surface.
- **Aged paper** — slightly uneven tone, soft deckled or worn edges, faint
  foxing/spotting at low opacity rather than a pure flat cream fill.
- **Brass** — warm specular highlights, not a flat gold fill; brass should
  visibly catch the lamp glow (see the reference's phone and lamp base).
- **Glass** (window, lamp shade) — the window glass shows the sky through
  it with a faint reflection/highlight, not a flat color rectangle; the
  lamp's stained-glass shade shows individual colored panes with light
  passing through them, not a solid cone.
- **Fabric** (curtains) — visible folds/drape with soft shadow between
  them, not a flat rectangle with a uniform gradient.
- **Paint** (easel canvas, wall art) — actual brushwork/texture in the
  painted scene itself; the "painting within the painting" is a good test
  of whether an asset has crossed from placeholder to final art.
- **Ceramic** (coffee cup) — soft rounded highlight, faint reflected light
  from its surroundings, not a hard-edged flat shape.
- **Leather** (journal cover) — slightly worn, soft sheen at grazing
  light angles rather than a flat fill.

## Lighting

- **Cinematic warm interior light** as the dominant mood — most of the
  frame sits in warm shadow, with light doing the work of drawing the eye
  (lamp pool, laptop screen glow, window backlight).
- **Soft shadows**, not hard vector drop-shadows — falloff should feel
  like it's coming from a real practical light source, not a uniform
  `box-shadow`.
- **Subtle moonlight** through the window — cool blue-violet, low
  intensity, contrasting with the warm interior light rather than
  competing with it.
- **Gentle window glow** — the glass itself should read as a light source
  at dusk/night, not just a hole showing the sky.
- **Warm practical lamps** — light pools falling on nearby surfaces
  (desk, books), not just a glow behind the lamp shape. The room already
  has a CSS approximation of this (`--room-glow`, set per time-of-day on
  `Room`'s root, and the lamp's own radial-gradient glow div) — final art
  should be lit *consistent with* that same light direction/color, not
  independently.
- **Atmospheric depth** — things further from the "camera" (deeper shelf
  compartments, the cityscape through the window) should recede via
  contrast/desaturation, not just get smaller.

Existing shadow tokens to reuse rather than inventing new blur/spread
values: `--shadow-warm-sm/md/lg` and `--shadow-glow-amber` (already used by
every object's `drop-shadow`).

## Texture

Painterly, tactile, slightly imperfect, handcrafted, rich but not noisy.
Concretely: visible brush/paper texture at close inspection, asymmetry in
hand-drawn elements (no two book spines identically spaced), and enough
restraint that the room doesn't compete with itself — the reference is
detailed but every object still reads clearly at a glance, nothing is
visual noise for its own sake.

## Style

Storybook fantasy / magical realism / artistic interior illustration.
Reference points: painted key art from narrative games, Studio Ghibli-style
interior backgrounds, cozy-game marketing art (the genre this room is
visually adjacent to, even though it's a portfolio, not a game).

## Implementation rule (not just an art rule)

**Visual quality must come from the art itself, not from CSS compensating
for weak art.** Concretely, for this codebase:

- Don't stack `filter: hue-rotate()`/`brightness()`/`blur()` on a flat
  placeholder to fake variety or richness — `docs/asset-inventory.md`
  flags one existing instance of this (bookshelf book-spine reuse) as a
  pattern to fix when real art lands, not one to repeat.
- Don't add heavier drop-shadows, glows, or gradients to a placeholder to
  make it "look more finished" — that reads as CSS effort standing in for
  missing art, which is the opposite of what makes the reference feel
  handcrafted.
- CSS/animation's job in this codebase is motion (idle sway/float/breathe,
  hover reactions, parallax) and *lighting the scene the art already sits
  in* (the room-wide glow, shadows) — not manufacturing texture or detail
  that should be baked into the asset itself.

## Avoid list (explicit)

Flat vector · generic cartoon · childish · SaaS/product illustration ·
corporate · futuristic/cyberpunk · neon · glossy 3D render · generic
AI-stock-art look · excessive glassmorphism · visual clutter (the reference
is detailed, not busy — every object still has clear silhouette-level
readability).
