"use client";

import { useRef, type ComponentType, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { AmbientEffects } from "@/components/AmbientEffects";
import { ArtWall } from "@/components/ArtWall";
import { AudioControls } from "@/components/AudioControls";
import { BookshelfCorner } from "@/components/BookshelfCorner";
import { CandleShelf } from "@/components/CandleShelf";
import { CoatOnHook } from "@/components/CoatOnHook";
import { Coffee } from "@/components/Coffee";
import { Easel } from "@/components/Easel";
import { FairyLights } from "@/components/FairyLights";
import { Gramophone } from "@/components/Gramophone";
import { Journal } from "@/components/Journal";
import { Lamp } from "@/components/Lamp";
import { Laptop } from "@/components/Laptop";
import { MemoryWall } from "@/components/MemoryWall";
import { MoviePoster } from "@/components/MoviePoster";
import { NavigationLayer } from "@/components/NavigationLayer";
import { Phone } from "@/components/Phone";
import { Plushie } from "@/components/Plushie";
import { MobileRoom } from "@/components/Room/MobileRoom";
import { WallClock } from "@/components/WallClock";
import { Window } from "@/components/Window";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useAudioPreference } from "@/hooks/useAudioPreference";
import { useLocalTimeOfDay } from "@/hooks/useLocalTimeOfDay";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useViewportTier } from "@/hooks/useViewportTier";
import { useRealWeather } from "@/hooks/useRealWeather";
import { useVisitProgress } from "@/hooks/useVisitProgress";
import { ParallaxLayer } from "@/primitives/ParallaxLayer";
import { useLampLit, useSceneValue } from "@/state/sceneStore";
import type { TimeOfDay, VisitStage } from "@/types/scene";
import { cn } from "@/utils/cn";

/** Warm light the lamp/window casts into the room per time of day — objects
 * that want to react to lighting read `var(--room-glow)` rather than
 * knowing about time-of-day themselves (see variables.css). */
const ROOM_GLOW: Record<TimeOfDay, string> = {
  morning: "rgba(255, 210, 165, 0.14)",
  afternoon: "rgba(255, 255, 255, 0)",
  sunset: "rgba(255, 150, 90, 0.38)",
  evening: "rgba(255, 184, 112, 0.42)",
  night: "rgba(255, 184, 112, 0.45)",
};

/** "Lighting changes slightly" / "environmental movement changes" at later
 * visit stages (LONG-STAY SYSTEM) — a gentle multiplier on idle-sway
 * amplitude (see --sway-scale, room-sway/room-float keyframes) and on the
 * room glow's opacity, never a jump. */
const SWAY_SCALE: Record<VisitStage, number> = {
  initial: 1,
  settled: 1.05,
  relaxed: 1.1,
  lateVisitor: 1.18,
};

const GLOW_BOOST: Record<VisitStage, number> = {
  initial: 1,
  settled: 1.05,
  relaxed: 1.1,
  lateVisitor: 1.15,
};

interface ObjectSlot {
  key: string;
  depth: number;
  /** Position as % of the stage; size as a width plus the art's own aspect
   * ratio (height follows), so painted objects are never stretched. */
  box: { left: string; top: string; width: string; aspectRatio: string };
  /** Contact shadow under the object, inset from the slot's left/right edges (% of its width). */
  shadowInset?: number;
  Component: ComponentType;
}

/**
 * The composition lives in a fixed **3:2 frame** (the reference image's exact
 * shape, docs/design-reference.png), centred in the viewport. Every slot below
 * is a position and width in % of that frame, measured off the reference, so
 * the room has the same proportions and overlaps on a 16:9 monitor, a 16:10
 * laptop or a tablet; the painted wall and desk extend past the frame to
 * fill whatever's left. `--fh` (set on the stage) is the frame's height.
 */
const u = (n: number) => `${+n.toFixed(2)}%`;
/** Frames are click-through (`pointer-events-none`), otherwise the desk
 * frame would sit over the wall frame and swallow its hovers; only
 * `InteractiveObject`s opt back in. */
const FRAME_CLASS = "pointer-events-none absolute left-1/2 -translate-x-1/2";
const FRAME_STYLE: CSSProperties = { height: "var(--fh)", width: "calc(var(--fh) * 1.5)", top: "var(--ft)" };
/** The desk's back edge sits ~63% down the reference frame (its front edge ~83%); this is that
 * line in stage terms (50% - fh/2 + 0.63·fh), so the full-width desk plane meets
 * the frame's desk line exactly. */
const DESK_TOP = "calc(var(--ft) + var(--fh) * 0.61)";

/**
 * Things on the back wall, painted *before* the desk plane so the desk's top
 * edge overlaps their bottoms. Order within is back-to-front. Positions are
 * measured from the reference (1536×1024): left/top/width in % of the frame.
 */
const WALL_SLOTS: ObjectSlot[] = [
  // left wall, beside the shelf
  { key: "artWall", depth: 0.2, box: { left: u(0.5), top: u(18), width: u(8.2), aspectRatio: "400 / 345" }, Component: ArtWall },
  // right wall: a smaller memories cluster, and the poster out to the right, clear of the lamp
  { key: "memoryWall", depth: 0.2, box: { left: u(64.5), top: u(24.5), width: u(17.5), aspectRatio: "560 / 393" }, Component: MemoryWall },
  { key: "moviePoster", depth: 0.22, box: { left: u(84.7), top: u(13), width: u(11.6), aspectRatio: "340 / 469" }, Component: MoviePoster },
  // the shelf stands behind the desk: the desk's back edge covers its feet
  { key: "bookshelfCorner", depth: 0.3, box: { left: u(11), top: u(3), width: u(23), aspectRatio: "514 / 960" }, Component: BookshelfCorner },
  // things on the wall: the clock above the photos, a coat on the far-left wall, a candle shelf under the poster
  { key: "wallClock", depth: 0.2, box: { left: u(69), top: u(5), width: u(7.2), aspectRatio: "1 / 1" }, Component: WallClock },
  { key: "coat", depth: 0.2, box: { left: u(0.4), top: u(31), width: u(7.4), aspectRatio: "531 / 1043" }, Component: CoatOnHook },
  { key: "candleShelf", depth: 0.22, box: { left: u(83.5), top: u(42), width: u(14.5), aspectRatio: "870 / 152" }, Component: CandleShelf },
  // hanging lights: between the shelf and the photo wall, not across the shelf or its cat
  { key: "fairyLights", depth: 0.12, box: { left: u(27), top: u(-2), width: u(46), aspectRatio: "1400 / 594" }, Component: FairyLights },
];

/**
 * The window and the shelf stand ON the desk (they're drawn after the desk plane, so
 * the desk meets the wall behind them and their bottoms rest on its surface), then
 * everything else on the desk, back to front. Widths and positions: easel 5-28%,
 * coffee 29-40%, laptop 42-61%, journal 40-56%, phone 62-75%, lamp 72-87%, plushie 85-99%.
 */
const DESK_SLOTS: ObjectSlot[] = [
  { key: "easel", depth: 0.42, box: { left: u(5), top: u(35), width: u(18.5), aspectRatio: "360 / 565" }, shadowInset: 10, Component: Easel },
  { key: "lamp", depth: 0.4, box: { left: u(72), top: u(40), width: u(14.5), aspectRatio: "400 / 536" }, shadowInset: 26, Component: Lamp },
  { key: "laptop", depth: 0.5, box: { left: u(42.2), top: u(48), width: u(18.6), aspectRatio: "600 / 448" }, shadowInset: 6, Component: Laptop },
  { key: "phone", depth: 0.52, box: { left: u(63.4), top: u(58.6), width: u(10), aspectRatio: "380 / 355" }, shadowInset: 8, Component: Phone },
  { key: "plushie", depth: 0.55, box: { left: u(85.5), top: u(57), width: u(11.5), aspectRatio: "320 / 349" }, shadowInset: 14, Component: Plushie },
  { key: "gramophone", depth: 0.5, box: { left: u(27.3), top: u(47.6), width: u(10.2), aspectRatio: "497 / 647" }, shadowInset: 10, Component: Gramophone },
  { key: "coffee", depth: 0.58, box: { left: u(30.3), top: u(65.4), width: u(8.6), aspectRatio: "260 / 208" }, shadowInset: 6, Component: Coffee },
  { key: "journal", depth: 0.66, box: { left: u(40.5), top: u(69), width: u(16), aspectRatio: "600 / 330" }, shadowInset: 4, Component: Journal },
];

/** A soft contact shadow where an object meets the desk, so it sits on it rather than floating. */
function GroundShadow({ inset = 8 }: { inset?: number }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: `${inset}%`,
        right: `${inset}%`,
        bottom: "-3%",
        height: "9%",
        background:
          "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.55) 40%, transparent 75%)",
        filter: "blur(2px)",
      }}
    />
  );
}

/** Hovering/focusing an object lifts its whole slot above its neighbours, so
 * its callout label is never hidden behind a later object (each
 * `ParallaxLayer` is its own stacking context, so the label's own z-index
 * can't escape it). */
const SLOT_CLASS = "absolute hover:z-40 focus-within:z-40";

const renderSlot = ({ key, depth, box, shadowInset, Component }: ObjectSlot) => (
  <ParallaxLayer key={key} depth={depth} className={SLOT_CLASS} style={box}>
    {shadowInset !== undefined ? <GroundShadow inset={shadowInset} /> : null}
    <Component />
  </ParallaxLayer>
);

/**
 * Composition root for the illustrated room. Owns the things every object
 * needs but shouldn't own itself: layout (each slot's position/depth), the
 * pointer-driven parallax signal, and — per the responsive brief this was
 * built against ("do not simply shrink the desktop room onto a phone") —
 * *which* layout renders at all. `useViewportTier()` picks between two
 * genuinely different trees, not one tree at different sizes:
 *
 * - **`"desktop"` and `"tablet"`** share this file's absolute-positioned
 *   canvas (`WALL_SLOTS`/`DESK_SLOTS`, parallax, the desk-plane and
 *   vignette overlays). Tablet doesn't get a separate composition of its
 *   own — every slot is already `clamp()`-scaled across a wide size range
 *   with a touch-friendly floor (see `ObjectSlot`'s own doc comment), and
 *   hover vs. tap is already decided per-device by `useCursorSupport`'s
 *   `(pointer: fine) and (hover: hover)` check, not by viewport width — an
 *   iPad with a trackpad gets real hover, a touch-only one doesn't,
 *   automatically. That's "simplified but still immersive... preserve
 *   major objects" without needing a third bespoke layout to maintain.
 * - **`"mobile"`** renders `MobileRoom` instead — a different, purpose-
 *   built vertical composition (see its own doc comment for the full
 *   reasoning). This file still owns the shared chrome around it
 *   (background texture, `NavigationLayer`, `AudioControls`) so panels and
 *   the sound toggle behave identically regardless of which room renders.
 *
 * Everything else — hover, idle motion, opening a panel — lives on the
 * object components themselves, so adding a new object never means
 * touching this file's canvas rendering logic, only adding one slot (and,
 * separately, a spot in `MobileRoom`'s vignettes). See
 * docs/adding-interactive-objects.md.
 */
export function Room() {
  usePrefersReducedMotion();
  useLocalTimeOfDay();
  useVisitProgress();
  useRealWeather();
  useAudioPreference();
  useAmbientAudio();
  const tier = useViewportTier();
  const isMobile = tier === "mobile";
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const visitStage = useSceneValue((state) => state.visitStage);
  const lampLit = useLampLit();
  const stageRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--pointer-x", x.toFixed(3));
    stage.style.setProperty("--pointer-y", y.toFixed(3));
  };

  const handlePointerLeave = () => {
    if (isMobile) return;
    stageRef.current?.style.setProperty("--pointer-x", "0");
    stageRef.current?.style.setProperty("--pointer-y", "0");
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "texture-wood-dark relative w-full",
        // Desktop/tablet: one viewport-locked stage — the canvas is laid
        // out in percentages of exactly this box, so horizontal overflow
        // stays clipped (nothing should ever need to scroll sideways to
        // reach an object). Vertical is `auto`, not `hidden`, specifically
        // for a short viewport (a phone/small tablet in landscape can be
        // under 560px tall) where `min-h-[560px]` makes this box taller
        // than the actual viewport — `hidden` would silently clip the
        // bottom of the room; `auto` lets it scroll into view instead, and
        // is a no-op (no scrollbar, identical to `hidden`) whenever the
        // viewport is already ≥560px tall, which is every normal case.
        // Mobile: natural content height, no clipping either axis —
        // `MobileRoom` is meant to be scrolled top to bottom (see
        // "scrolling is intentional" in the responsive brief).
        isMobile ? "min-h-screen overflow-x-hidden" : "h-screen min-h-[560px] overflow-hidden",
      )}
      style={
        {
          "--room-glow": lampLit ? ROOM_GLOW.night : ROOM_GLOW[timeOfDay],
          "--H": "max(100vh, 560px)",
          // frame height: fill the viewport WIDTH (the reference's objects are sized as a share of
          // its width), overhanging the height by at most 25% — the overhang is cropped mostly from
          // the dark cabinet at the bottom, not the heading at the top
          "--fh": "min(max(125vh, 700px), 66.667vw)",
          "--ft": "max(calc((var(--H) - var(--fh)) * 0.5), calc((var(--H) - var(--fh)) * 0.12))",
          "--sway-scale": SWAY_SCALE[visitStage],
          "--glow-boost": GLOW_BOOST[visitStage],
        } as CSSProperties
      }
    >
      {isMobile ? (
        <MobileRoom />
      ) : (
        <>
          {/* painted back wall (plaster + wainscot) — replaces the flat
              wood-texture wall on the canvas; the CSS texture underneath
              stays as the fallback while the image loads */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: "url(/assets/scene/background/room-wall.jpg)", filter: "brightness(0.62) saturate(0.9)" }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(60% 50% at 50% 84%, var(--room-glow), transparent 70%)",
              filter: "brightness(var(--glow-boost, 1))",
              transition: "background var(--duration-scene) var(--ease-soft), filter var(--duration-scene) var(--ease-soft)",
            }}
          />

          {/* back wall layer: the window and everything hung or standing against the wall.
              Drawn BEFORE the desk plane, so the desk's back edge covers their bottoms. */}
          <div className={FRAME_CLASS} style={FRAME_STYLE}>
            <ParallaxLayer depth={0.1} className="absolute inset-0">
              <Window />
            </ParallaxLayer>
            {WALL_SLOTS.map(renderSlot)}
          </div>

          {/* desk plane — a lighter, horizontally-grained band so the lower
              part of the room reads as a tabletop, not more wall; full width,
              starting at the frame's desk line and drawn over the wall layer */}
          <ParallaxLayer depth={0.05} className="absolute inset-x-0" style={{ top: DESK_TOP, height: "calc(var(--fh) * 0.225)" }}>
            {/* painted desk (art-source/07-panels 2b); the CSS wood stays underneath as the load fallback */}
            <div
              aria-hidden
              className="texture-wood h-full w-full"
              style={{
                backgroundImage: "url(/assets/scene/background/desk-surface.jpg)",
                backgroundSize: "100% 100%",
                backgroundPosition: "center top",
                boxShadow: "0 -6px 18px rgba(0, 0, 0, 0.35)",
              }}
            />
          </ParallaxLayer>

          {/* under the desk: the reference's dark cabinet of books, below the desk's front edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              top: "calc(var(--ft) + var(--fh) * 0.835)",
              background: "linear-gradient(180deg, #1a120c 0%, #0d0907 60%, #070504 100%)",
              boxShadow: "0 -10px 24px rgba(0, 0, 0, 0.45)",
            }}
          />

          <div className={FRAME_CLASS} style={FRAME_STYLE}>
            {DESK_SLOTS.map(renderSlot)}

            {/* the reference's title, above the window */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 text-center" style={{ top: "3.4%" }}>
              <p className="font-hand text-[clamp(1.4rem,3.4vw,3.2rem)] leading-none text-[var(--color-cream)]/85 [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
                Welcome to my little universe
              </p>
              <p className="mt-1 font-hand-note text-[clamp(0.8rem,1.5vw,1.4rem)] leading-none text-[var(--color-cream)]/60 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
                every object has a story
              </p>
            </div>
          </div>

          <AmbientEffects />

          {/* cinematic edge vignette — keeps the corners of a full-viewport
              scene from feeling like a flat rectangle of wallpaper */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(120% 100% at 50% 42%, transparent 55%, rgba(0, 0, 0, 0.45) 100%)" }}
          />
        </>
      )}

      <NavigationLayer />
      <AudioControls className={isMobile ? "fixed right-4 top-4 z-20" : "absolute right-4 top-4 z-20"} />
    </div>
  );
}
