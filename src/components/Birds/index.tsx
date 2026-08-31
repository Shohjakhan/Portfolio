"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useSceneValue } from "@/state/sceneStore";

interface Bird {
  id: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
  scale: number;
}

const BIRD_COUNT = 3;

/**
 * A handful of tiny silhouettes drifting across the sky — "subtle
 * birds/atmosphere" for the morning phase only (CLAUDE.md's living-room
 * brief). Deliberately not a new art asset: a CSS clip-path "M" shape (see
 * `.bird` in animations.css) at a few px is indistinguishable from a drawn
 * one and costs nothing to generate/replace later.
 *
 * Same randomize-in-an-effect pattern as AmbientLayer, for the same reason:
 * computing Math.random() during render would make server and first client
 * render disagree.
 */
export function Birds() {
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const reducedMotion = useSceneValue((state) => state.reducedMotion);
  const [birds, setBirds] = useState<Bird[]>([]);

  const visible = timeOfDay === "morning" && !reducedMotion;

  useEffect(() => {
    if (!visible) {
      setBirds([]);
      return;
    }
    setBirds(
      Array.from({ length: BIRD_COUNT }, (_, id) => ({
        id,
        top: 8 + Math.random() * 22,
        left: Math.random() * 20,
        delay: Math.random() * 8,
        duration: 14 + Math.random() * 10,
        scale: 0.7 + Math.random() * 0.5,
      })),
    );
  }, [visible]);

  if (birds.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {birds.map((bird) => (
        <span
          key={bird.id}
          className="bird text-[var(--color-ink)]"
          style={
            {
              top: `${bird.top}%`,
              left: `${bird.left}%`,
              width: `${8 * bird.scale}px`,
              height: `${5 * bird.scale}px`,
              opacity: 0,
              animationDelay: `${bird.delay}s`,
              animationDuration: `${bird.duration}s`,
              "--bird-opacity": 0.45,
              "--bird-drift-x": "160px",
              "--bird-drift-y": "-26px",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
