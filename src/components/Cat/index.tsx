"use client";

import { useEffect, useRef, useState } from "react";
import { getSceneObject } from "@/data/sceneObjects";
import { useOccasionalTrigger } from "@/hooks/useOccasionalTrigger";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions, useSceneValue } from "@/state/sceneStore";
import type { VisitStage } from "@/types/scene";

const definition = getSceneObject("cat")!;

/** How often the cat stirs on its own — shrinks a little at later visit
 * stages, per the LONG-STAY SYSTEM brief ("cat wakes briefly"). Still rare:
 * this is a small discovery, not a repeating gimmick. */
const STIR_INTERVAL_MS: Record<VisitStage, number> = {
  initial: 100_000,
  settled: 75_000,
  relaxed: 55_000,
  lateVisitor: 38_000,
};

export function Cat() {
  const visitStage = useSceneValue((state) => state.visitStage);
  const reducedMotion = useSceneValue((state) => state.reducedMotion);
  const periodicStir = useOccasionalTrigger(STIR_INTERVAL_MS[visitStage], 1500);

  // One extra stir right as a new visit stage begins — skips the very
  // first render (mounting already "settled", e.g. after a fast refresh,
  // shouldn't fire one) so it only ever fires on a real transition.
  const [discoveryStir, setDiscoveryStir] = useState(false);
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (reducedMotion) return;
    setDiscoveryStir(true);
    const id = window.setTimeout(() => setDiscoveryStir(false), 1500);
    return () => window.clearTimeout(id);
  }, [visitStage, reducedMotion]);

  const stirring = periodicStir || discoveryStir;

  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="breathe"
      idleDelayMs={1800}
      idleDurationMs={7000}
      hoverEffect="wiggle"
      className="h-full w-full"
    >
      <img
        src="/assets/scene/bookshelf/cat.svg"
        alt=""
        aria-hidden
        data-stir={stirring ? "true" : undefined}
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
      />
    </InteractiveObject>
  );
}
