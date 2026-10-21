"use client";

import { useEffect, useRef, useState } from "react";
import { useOccasionalTrigger } from "@/hooks/useOccasionalTrigger";
import { useSceneValue } from "@/state/sceneStore";
import type { VisitStage } from "@/types/scene";

/** How often the cat stirs on its own — shrinks a little at later visit
 * stages, per the LONG-STAY SYSTEM brief ("cat wakes briefly"). Still rare:
 * this is a small discovery, not a repeating gimmick. */
const STIR_INTERVAL_MS: Record<VisitStage, number> = {
  initial: 20_000,
  settled: 16_000,
  relaxed: 13_000,
  lateVisitor: 10_000,
};

/**
 * Purely environmental, like `Curtain`/`Window` — the cat sleeps on top
 * of the bookshelf but isn't a clickable object: no hover label, no
 * click-to-panel. It never had a real destination of its own (it was
 * piggybacking on the "about" panel), and per explicit feedback that read
 * as a false affordance — hovering/clicking something that looks
 * decorative shouldn't open an unrelated panel. Ambient motion (idle
 * breathing + the occasional stir below) stays; only the interactivity
 * (`InteractiveObject`, `sceneActions.setActiveObject`) is gone.
 */
export function Cat() {
  const visitStage = useSceneValue((state) => state.visitStage);
  const reducedMotion = useSceneValue((state) => state.reducedMotion);
  const activeObject = useSceneValue((state) => state.activeObject);
  const periodicStir = useOccasionalTrigger(STIR_INTERVAL_MS[visitStage], 3200);

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

  // The cat still notices the bookshelf being hovered (it sleeps right on
  // top of it — see Room's slot layout) even though it's no longer
  // interactive itself. "May react occasionally" per the library brief,
  // not "reacts every hover": ~40% of the time, once per hover-in.
  const [bookshelfGlance, setBookshelfGlance] = useState(false);
  useEffect(() => {
    if (activeObject !== "bookshelf" || reducedMotion) return;
    if (Math.random() >= 0.85) return;
    setBookshelfGlance(true);
    const id = window.setTimeout(() => setBookshelfGlance(false), 1500);
    return () => window.clearTimeout(id);
  }, [activeObject, reducedMotion]);

  const stirring = periodicStir || discoveryStir || bookshelfGlance;

  return (
    <div aria-hidden className="relative h-full w-full">
      {/* Two pixel-matched paintings of the same cat (asleep / head raised,
          see art-source/01-bookshelf-test/), crossfaded while it stirs —
          the "occasionally wakes" beat from CLAUDE.md §2, now with a real
          awake pose instead of only a transform wobble. */}
      <div style={{ transformOrigin: "50% 100%" }} className="cat-breathe absolute inset-0">
        <img
          src="/assets/scene/bookshelf/cat-sleeping.png"
          alt=""
          style={{ opacity: stirring ? 0 : 1, transition: "opacity 600ms var(--ease-soft)" }}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <img
          src="/assets/scene/bookshelf/cat-awake.png"
          alt=""
          style={{ opacity: stirring ? 1 : 0, transition: "opacity 600ms var(--ease-soft)" }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
