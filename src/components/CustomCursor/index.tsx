"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SoundTrigger } from "@/primitives/SoundTrigger";
import { useCursorSupport } from "@/hooks/useCursorSupport";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cursorActions, resolveCursorVariant, useCursorValue } from "@/state/cursorStore";
import { useSceneValue } from "@/state/sceneStore";

/** Quill's resting tilt, and how far movement is allowed to nudge it either
 * way — kept small so it reads as a natural wrist tilt, not a weathervane.
 * The nib (tip, the actual click point) sits at the SVG's `transformOrigin`
 * and stays fixed under the pointer; this rotates the vane around it. The
 * unrotated vane's far end points roughly 41° east of north (up-and-right,
 * see the SVG path below) — 94° of clockwise rotation from there lands the
 * far end at a bearing of 135° (south-east, down-and-right), the same
 * "tip upper-left, body trailing lower-right" silhouette a regular system
 * pointer has, just feather-shaped. (Previously -38°, which put the far
 * end at ~3° — almost due north/straight up — reading as an odd upward
 * spike rather than a tilted pointer.) */
const REST_TILT_DEG = 94;
/** The painted feather's size on screen (its art is 753×805) and where its nib is within it. */
const FEATHER_W = 46;
const FEATHER_H = 49;
const FEATHER_TIP_X = 0.2;
const FEATHER_TIP_Y = 48.9;
const MAX_DYNAMIC_TILT_DEG = 14;
/** 0..1 follow smoothing per frame — high enough to feel responsive, low enough to carry a touch of trailing weight. */
const FOLLOW_EASE = 0.35;
const TRAIL_MIN_DISTANCE_PX = 8;
const TRAIL_MIN_INTERVAL_MS = 40;
const TRAIL_MAX_DOTS = 24;

interface TrailDot {
  id: number;
  x: number;
  y: number;
  size: number;
  star: boolean;
  dx: number;
  dy: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

let seq = 0;
const nextId = () => seq++;

/**
 * The site's signature cursor — an antique feather/quill that replaces the
 * system pointer. Position and rotation are driven imperatively (direct
 * style mutation via `featherRef`, once per rAF) rather than through React
 * state or the cursor store, matching Room's pointer-parallax pattern
 * (see Room/index.tsx) — this runs every frame and must never trigger a
 * re-render.
 *
 * Everything *other* components need to know — is the pointer over
 * something clickable, was it just clicked — lives in `cursorStore`
 * (@/state/cursorStore), which future interactive objects can read or
 * write without touching this component. Most objects need nothing extra:
 * being a real `<button>`/`<a>`/`[role="button"]` is enough for the hover
 * reaction to apply automatically (see CURSOR_INTERACTIVE_SELECTOR).
 */
export function CustomCursor() {
  useCursorSupport();
  usePrefersReducedMotion();

  const supported = useCursorValue((state) => state.supported);
  const variant = useCursorValue((state) => state.variant);
  const hoverSeq = useCursorValue((state) => state.hoverSeq);
  const clickSeq = useCursorValue((state) => state.clickSeq);
  const reducedMotion = useSceneValue((state) => state.reducedMotion);

  const featherRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef(REST_TILT_DEG);
  const lastTrailRef = useRef({ x: 0, y: 0, t: 0 });
  const rafRef = useRef<number | null>(null);
  const hasPositionedRef = useRef(false);

  const [visible, setVisible] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const active = supported;

  // Hide the native pointer only once the custom one is actually taking over.
  useEffect(() => {
    document.documentElement.dataset.customCursor = active ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.customCursor;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const handleMove = (event: PointerEvent) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      hasPositionedRef.current = true;
      setVisible(true);

      cursorActions.setVariant(resolveCursorVariant(event.target));

      if (reducedMotion) return;
      const last = lastTrailRef.current;
      const dist = Math.hypot(event.clientX - last.x, event.clientY - last.y);
      const now = performance.now();
      if (dist > TRAIL_MIN_DISTANCE_PX && now - last.t > TRAIL_MIN_INTERVAL_MS) {
        lastTrailRef.current = { x: event.clientX, y: event.clientY, t: now };
        setTrail((prev) => [
          ...prev.slice(-(TRAIL_MAX_DOTS - 1)),
          {
            id: nextId(),
            x: event.clientX + (Math.random() - 0.5) * 6,
            y: event.clientY + (Math.random() - 0.5) * 6,
            size: 6 + Math.random() * 7,
            star: Math.random() < 0.33,
            dx: (Math.random() - 0.5) * 16,
            dy: 8 + Math.random() * 16,
          },
        ]);
      }
    };

    const handleLeaveViewport = () => setVisible(false);
    const handleEnterViewport = () => {
      if (hasPositionedRef.current) setVisible(true);
    };
    const handlePointerDown = () => cursorActions.pulseClick();

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    document.documentElement.addEventListener("mouseleave", handleLeaveViewport);
    document.documentElement.addEventListener("mouseenter", handleEnterViewport);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.removeEventListener("mouseleave", handleLeaveViewport);
      document.documentElement.removeEventListener("mouseenter", handleEnterViewport);
    };
  }, [active, reducedMotion]);

  // Smoothed follow + natural tilt. Own effect (vs. folded into the
  // listener above) so it keeps running every frame regardless of how
  // often pointermove actually fires.
  useEffect(() => {
    if (!active) return;

    const tick = () => {
      const target = targetRef.current;
      const pos = posRef.current;

      if (reducedMotion) {
        pos.x = target.x;
        pos.y = target.y;
        tiltRef.current = REST_TILT_DEG;
      } else {
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        pos.x += dx * FOLLOW_EASE;
        pos.y += dy * FOLLOW_EASE;

        const dynamicTilt = Math.max(-MAX_DYNAMIC_TILT_DEG, Math.min(MAX_DYNAMIC_TILT_DEG, dx * 0.6));
        tiltRef.current += (REST_TILT_DEG + dynamicTilt - tiltRef.current) * 0.2;
      }

      const node = featherRef.current;
      if (node) {
        node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tiltRef.current}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, reducedMotion]);

  // Click ripple — skip the mount itself so a truthy initial count never fires (mirrors SoundTrigger).
  const hasMountedClickRef = useRef(false);
  useEffect(() => {
    if (!hasMountedClickRef.current) {
      hasMountedClickRef.current = true;
      return;
    }
    if (!active || reducedMotion) return;
    const { x, y } = posRef.current;
    setRipples((prev) => [...prev.slice(-3), { id: nextId(), x, y }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire only on clickSeq changes
  }, [clickSeq]);

  if (!active) return null;

  const isInteractive = variant === "interactive";
  const isText = variant === "text";

  return (
    <>
      <div
        ref={featherRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ transformOrigin: "0 0" }}
      >
        {/* the painted feather (public/assets/cursor/feather.png): nib at its bottom-left corner,
            which is the click point and the pivot of the tilt */}
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative cursor sprite */}
        <img
          src="/assets/cursor/feather.png"
          alt=""
          width={FEATHER_W}
          height={FEATHER_H}
          draggable={false}
          style={
            {
              position: "absolute",
              left: -FEATHER_TIP_X,
              top: -FEATHER_TIP_Y,
              width: FEATHER_W,
              height: FEATHER_H,
              maxWidth: "none", // the global img{max-width:100%} would squash it inside this zero-width box
              transformOrigin: `${FEATHER_TIP_X}px ${FEATHER_TIP_Y}px`,
              transform: `scale(${isInteractive ? 1.16 : 1})`,
              opacity: visible && !isText ? 1 : 0,
              filter: isInteractive
                ? "drop-shadow(0 0 7px rgba(255, 184, 112, 0.85)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))"
                : "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))",
              transition: reducedMotion
                ? "opacity var(--duration-fast) var(--ease-soft)"
                : "transform var(--duration-fast) var(--ease-bounce-soft), filter var(--duration-fast) var(--ease-soft), opacity var(--duration-fast) var(--ease-soft)",
            } as CSSProperties
          }
        />

        {isInteractive && !reducedMotion && (
          <span key={hoverSeq} className="cursor-sparkle" style={{ left: -5, top: -5 }} />
        )}
      </div>

      {!reducedMotion &&
        trail.map((dot) => (
          <span
            key={dot.id}
            aria-hidden
            className={`cursor-trail-dot pointer-events-none fixed z-[9998]${dot.star ? " is-star" : ""}`}
            style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size, "--dx": `${dot.dx}px`, "--dy": `${dot.dy}px` } as CSSProperties}
            onAnimationEnd={() => setTrail((prev) => prev.filter((d) => d.id !== dot.id))}
          />
        ))}

      {!reducedMotion &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            aria-hidden
            className="cursor-ripple pointer-events-none fixed z-[9998]"
            style={{ left: ripple.x, top: ripple.y }}
            onAnimationEnd={() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id))}
          />
        ))}

      {/* Silent until both an audio file exists at this cue's path (see
          lib/audio/cues.ts) and the user opts into sound via AudioControls. */}
      <SoundTrigger cue="featherClick" trigger={clickSeq} />
    </>
  );
}
