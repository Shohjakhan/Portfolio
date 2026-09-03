"use client";

import { AmbientEffects } from "@/components/AmbientEffects";
import { ArtWall } from "@/components/ArtWall";
import { Bookshelf } from "@/components/Bookshelf";
import { Cat } from "@/components/Cat";
import { Coffee } from "@/components/Coffee";
import { Easel } from "@/components/Easel";
import { Journal } from "@/components/Journal";
import { Lamp } from "@/components/Lamp";
import { Laptop } from "@/components/Laptop";
import { MemoryWall } from "@/components/MemoryWall";
import { MoviePoster } from "@/components/MoviePoster";
import { Phone } from "@/components/Phone";
import { Plants } from "@/components/Plants";
import { Plushie } from "@/components/Plushie";
import { Window } from "@/components/Window";

/**
 * The room's mobile composition — a *different* layout, not the desktop
 * canvas scaled down (see the brief this was built against: "do not
 * simply shrink the desktop room onto a phone"). Concretely:
 *
 * - **Document flow, not an absolute-positioned canvas.** Desktop/tablet
 *   (`Room`'s own canvas branch) place every object by percentage inside
 *   one `h-screen` stage, which is exactly what produces tiny, hard-to-
 *   tap objects once that stage is squeezed into a phone's width. Here,
 *   objects are grouped into a handful of "vignettes" (shelf, art, wall,
 *   desk) stacked down an intentionally taller, scrollable page — each
 *   object gets a fixed, comfortable size (well past the 44px WCAG
 *   floor, closer to 80–160px) instead of shrinking to fit a fixed box.
 * - **No parallax, no cursor-follow.** Both are explicitly desktop-only
 *   per the brief; there's no pointer to parallax against on a touchscreen
 *   anyway (`ParallaxLayer` is skipped entirely, not just inert).
 * - **Curtains and the canvas-specific desk-plane/vignette overlays are
 *   dropped, not shrunk.** They're framing devices tuned for one
 *   viewport-locked scene; repurposing them for a multi-screen-tall page
 *   would mean stretching or awkwardly repeating them for no visual gain.
 *   `Window`'s own day/night sky, each object's idle motion, and the
 *   shared `texture-wood-dark` background (set by `Room`, the parent of
 *   this component) carry the "magical, cozy" identity instead.
 * - **Every interactive object is untouched** — this only changes where
 *   `Coffee`/`Laptop`/`Bookshelf`/etc. sit, not how they behave. All the
 *   existing hover/focus/keyboard/aria/sound wiring on `InteractiveObject`
 *   applies exactly as-is; ambient-only companions (`Cat`, `Plants`,
 *   `ArtWall`, `Lamp` — none of them a real `SceneObjectId`, see
 *   `types/assets.ts`) ride along at a smaller, decorative size since
 *   they were never tap targets to begin with.
 *
 * Rendered by `Room` in place of the canvas when `useViewportTier()` is
 * `"mobile"` — `NavigationLayer`/`AudioControls` stay owned by `Room`
 * itself, unchanged, since panels and the sound toggle work identically
 * regardless of the room's layout.
 */
export function MobileRoom() {
  return (
    <div className="relative flex flex-col items-center gap-12 px-4 pb-28 pt-8">
      {/* sky band — Window unmodified, just given a sized box to read its
          own internal percentages against. */}
      <div className="relative h-56 w-full max-w-xs shrink-0 sm:h-64 sm:max-w-sm">
        <Window />
      </div>

      <AmbientEffects density={0.5} />

      {/* shelf vignette — plants/cat are decorative companions (not
          SceneObjectIds), sized smaller on purpose; the bookshelf itself
          is the real tap target. */}
      <section className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-3">
          <div className="h-14 w-14 shrink-0">
            <Plants />
          </div>
          <div className="h-14 w-20 shrink-0">
            <Cat />
          </div>
        </div>
        <div className="h-72 w-36 shrink-0">
          <Bookshelf />
        </div>
      </section>

      {/* art vignette */}
      <section className="flex flex-col items-center gap-5">
        <div className="h-24 w-40 shrink-0">
          <ArtWall />
        </div>
        <div className="h-60 w-28 shrink-0">
          <Easel />
        </div>
      </section>

      {/* wall vignette — memories, cinema, and the fandom charm rack */}
      <section className="flex flex-wrap items-center justify-center gap-8">
        <div className="h-32 w-44 shrink-0">
          <MemoryWall />
        </div>
        <div className="h-40 w-24 shrink-0">
          <MoviePoster />
        </div>
        <div className="h-24 w-24 shrink-0">
          <Plushie />
        </div>
      </section>

      {/* desk vignette — coffee, laptop, journal, phone; lamp rides along
          as a decorative accent, same as it sits beside the phone on desktop. */}
      <section className="flex flex-wrap items-end justify-center gap-6">
        <div className="h-24 w-24 shrink-0">
          <Coffee />
        </div>
        <div className="h-28 w-40 shrink-0">
          <Laptop />
        </div>
        <div className="h-24 w-28 shrink-0">
          <Journal />
        </div>
        <div className="h-24 w-24 shrink-0">
          <Phone />
        </div>
        <div className="h-32 w-16 shrink-0">
          <Lamp />
        </div>
      </section>
    </div>
  );
}
