"use client";

import { useRef, type ComponentType, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { AmbientEffects } from "@/components/AmbientEffects";
import { ArtWall } from "@/components/ArtWall";
import { AudioControls } from "@/components/AudioControls";
import { Bookshelf } from "@/components/Bookshelf";
import { Cat } from "@/components/Cat";
import { Coffee } from "@/components/Coffee";
import { CurtainLeft, CurtainRight } from "@/components/Curtain";
import { Easel } from "@/components/Easel";
import { Journal } from "@/components/Journal";
import { Lamp } from "@/components/Lamp";
import { Laptop } from "@/components/Laptop";
import { MemoryWall } from "@/components/MemoryWall";
import { MoviePoster } from "@/components/MoviePoster";
import { NavigationLayer } from "@/components/NavigationLayer";
import { Phone } from "@/components/Phone";
import { Plants } from "@/components/Plants";
import { Plushie } from "@/components/Plushie";
import { MobileRoom } from "@/components/Room/MobileRoom";
import { Window } from "@/components/Window";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useAudioPreference } from "@/hooks/useAudioPreference";
import { useLocalTimeOfDay } from "@/hooks/useLocalTimeOfDay";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useViewportTier } from "@/hooks/useViewportTier";
import { useVisitProgress } from "@/hooks/useVisitProgress";
import { ParallaxLayer } from "@/primitives/ParallaxLayer";
import { useSceneValue } from "@/state/sceneStore";
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
  /** left/top/width/height — percentages of the stage, clamped so hit targets never shrink below a touch-friendly minimum. */
  box: { left: string; top: string; width: string; height: string };
  Component: ComponentType;
}

/**
 * Every layer painted into the stage, back-to-front-ish by `depth`. Most
 * entries are clickable `InteractiveObject`s, but this list isn't only
 * that — purely decorative layers (the curtains, the lamp) share the exact
 * same slot mechanism since all Room cares about here is "where does this
 * component's box sit and how far does it parallax," not whether it's a
 * button. See docs/adding-interactive-objects.md.
 */
const OBJECT_SLOTS: ObjectSlot[] = [
  // --- left: bookshelf, plants + sleeping cat on top ---------------------
  { key: "bookshelf", depth: 0.3, box: { left: "3%", top: "8%", width: "clamp(130px, 16%, 210px)", height: "clamp(280px, 54%, 440px)" }, Component: Bookshelf },
  { key: "plants", depth: 0.45, box: { left: "4%", top: "1%", width: "clamp(56px, 6.5%, 92px)", height: "clamp(56px, 6.5%, 92px)" }, Component: Plants },
  { key: "cat", depth: 0.45, box: { left: "11.5%", top: "2%", width: "clamp(84px, 9.5%, 140px)", height: "clamp(60px, 7%, 102px)" }, Component: Cat },

  // --- lower left: easel + paintings + brushes ---------------------------
  { key: "artWall", depth: 0.25, box: { left: "18%", top: "8%", width: "clamp(96px, 12%, 160px)", height: "clamp(150px, 28%, 230px)" }, Component: ArtWall },
  { key: "easel", depth: 0.42, box: { left: "21%", top: "44%", width: "clamp(84px, 9.5%, 140px)", height: "clamp(170px, 32%, 280px)" }, Component: Easel },

  // --- right: memories wall, movie poster, lamp, phone, plushie ----------
  { key: "memoryWall", depth: 0.2, box: { left: "70%", top: "10%", width: "clamp(130px, 18%, 240px)", height: "clamp(110px, 16%, 200px)" }, Component: MemoryWall },
  { key: "moviePoster", depth: 0.25, box: { left: "88%", top: "12%", width: "clamp(80px, 8.5%, 130px)", height: "clamp(130px, 17%, 230px)" }, Component: MoviePoster },
  { key: "lamp", depth: 0.35, box: { left: "89%", top: "52%", width: "clamp(74px, 7%, 120px)", height: "clamp(140px, 15%, 230px)" }, Component: Lamp },
  { key: "phone", depth: 0.5, box: { left: "78%", top: "66%", width: "clamp(74px, 7%, 120px)", height: "clamp(74px, 7%, 120px)" }, Component: Phone },
  { key: "plushie", depth: 0.45, box: { left: "90%", top: "74%", width: "clamp(66px, 6.5%, 104px)", height: "clamp(66px, 6.5%, 104px)" }, Component: Plushie },

  // --- center: desk with coffee, laptop (behind), journal (in front) -----
  { key: "coffee", depth: 0.58, box: { left: "33%", top: "80%", width: "clamp(74px, 6%, 96px)", height: "clamp(74px, 6%, 96px)" }, Component: Coffee },
  { key: "laptop", depth: 0.5, box: { left: "43%", top: "71%", width: "clamp(130px, 12.5%, 190px)", height: "clamp(106px, 10.2%, 155px)" }, Component: Laptop },
  { key: "journal", depth: 0.68, box: { left: "45.5%", top: "85%", width: "clamp(84px, 7%, 110px)", height: "clamp(74px, 6.1%, 96px)" }, Component: Journal },
];

/** Flanks the window; kept separate from OBJECT_SLOTS since both share one
 * depth/behavior and read more clearly as a pair here. */
const CURTAIN_SLOTS: ObjectSlot[] = [
  { key: "curtainLeft", depth: 0.15, box: { left: "26%", top: "3%", width: "clamp(50px, 6%, 90px)", height: "clamp(280px, 56%, 460px)" }, Component: CurtainLeft },
  { key: "curtainRight", depth: 0.15, box: { left: "65%", top: "3%", width: "clamp(50px, 6%, 90px)", height: "clamp(280px, 56%, 460px)" }, Component: CurtainRight },
];

/**
 * Composition root for the illustrated room. Owns the things every object
 * needs but shouldn't own itself: layout (each slot's position/depth), the
 * pointer-driven parallax signal, and — per the responsive brief this was
 * built against ("do not simply shrink the desktop room onto a phone") —
 * *which* layout renders at all. `useViewportTier()` picks between two
 * genuinely different trees, not one tree at different sizes:
 *
 * - **`"desktop"` and `"tablet"`** share this file's absolute-positioned
 *   canvas (`OBJECT_SLOTS`/`CURTAIN_SLOTS`, parallax, the desk-plane and
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
  useAudioPreference();
  useAmbientAudio();
  const tier = useViewportTier();
  const isMobile = tier === "mobile";
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const visitStage = useSceneValue((state) => state.visitStage);
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
        isMobile ? "min-h-screen overflow-x-hidden" : "h-screen min-h-[560px] overflow-x-hidden overflow-y-auto",
      )}
      style={
        {
          "--room-glow": ROOM_GLOW[timeOfDay],
          "--sway-scale": SWAY_SCALE[visitStage],
          "--glow-boost": GLOW_BOOST[visitStage],
        } as CSSProperties
      }
    >
      {isMobile ? (
        <MobileRoom />
      ) : (
        <>
          {/* desk plane — a lighter, horizontally-grained band so the lower
              third of the room reads as a tabletop, not more wall */}
          <ParallaxLayer depth={0.05} className="absolute inset-x-0 bottom-0 h-[38%]">
            <div
              aria-hidden
              className="texture-wood h-full w-full"
              style={{ boxShadow: "0 2px 0 rgba(255, 255, 255, 0.08) inset, 0 40px 70px -30px rgba(0, 0, 0, 0.5) inset" }}
            />
          </ParallaxLayer>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(60% 50% at 50% 84%, var(--room-glow), transparent 70%)",
              filter: "brightness(var(--glow-boost, 1))",
              transition: "background var(--duration-scene) var(--ease-soft), filter var(--duration-scene) var(--ease-soft)",
            }}
          />

          <ParallaxLayer depth={0.1} className="absolute inset-0">
            <Window />
          </ParallaxLayer>

          {CURTAIN_SLOTS.map(({ key, depth, box, Component }) => (
            <ParallaxLayer key={key} depth={depth} className="absolute" style={box}>
              <Component />
            </ParallaxLayer>
          ))}

          {OBJECT_SLOTS.map(({ key, depth, box, Component }) => (
            <ParallaxLayer key={key} depth={depth} className="absolute" style={box}>
              <Component />
            </ParallaxLayer>
          ))}

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
