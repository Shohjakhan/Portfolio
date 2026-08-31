"use client";

import { useEffect, useState } from "react";
import { useSceneValue } from "@/state/sceneStore";
import { cn } from "@/utils/cn";

export type AmbientVariant = "dust" | "firefly" | "snow" | "ember" | "rain";

export interface AmbientLayerProps {
  variant?: AmbientVariant;
  count?: number;
  className?: string;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  driftX: number;
  width: number;
  height: number;
}

/**
 * Decorative floating particles (dust motes, fireflies, snow, embers).
 * Positions/timings are randomized once per mount, then driven purely by
 * CSS (`room-drift` keyframe) — no per-frame React state, so this never
 * re-renders once mounted regardless of how long it runs.
 *
 * Particles are generated in an effect (not useMemo) and start as `[]` so
 * the server-rendered HTML and the client's first render match exactly —
 * computing Math.random() during render would make them differ and trip a
 * hydration mismatch the moment this is actually mounted in the tree.
 */
export function AmbientLayer({ variant = "dust", count = 18, className }: AmbientLayerProps) {
  const reducedMotion = useSceneValue((state) => state.reducedMotion);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setParticles([]);
      return;
    }
    const isRain = variant === "rain";
    setParticles(
      Array.from({ length: count }, (_, id) => {
        const size = 2 + Math.random() * 3;
        return {
          id,
          left: Math.random() * 100,
          delay: Math.random() * 6,
          // Rain falls noticeably faster than drifting dust/snow — a streak, not a drift.
          duration: isRain ? 0.4 + Math.random() * 0.4 : 5 + Math.random() * 7,
          driftX: isRain ? 0 : Math.random() * 40 - 20,
          width: isRain ? 1.5 : size,
          height: isRain ? 14 + Math.random() * 10 : size,
        };
      }),
    );
  }, [count, reducedMotion, variant]);

  if (particles.length === 0) return null;

  return (
    <div
      aria-hidden
      data-variant={variant}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="ambient-particle"
          style={
            {
              left: `${particle.left}%`,
              width: particle.width,
              height: particle.height,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              "--drift-x": `${particle.driftX}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
