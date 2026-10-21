"use client";

import { LayeredArt } from "@/components/shared/LayeredArt";
import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("journal")!;

/**
 * Two independent layers (see `.journal-pages-layer`/`.journal-pen-layer`
 * hover rules in animations.css) so hover can read as "the pages shift" and
 * "the pen lifts" separately, per the diary brief — a single flat `<img>`
 * can't be targeted per-part since an externally-referenced SVG is opaque
 * to CSS (see docs/asset-architecture.md), hence the split art files.
 */
export function Journal() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="settle"
      idleDelayMs={400}
      idleDurationMs={5400}
      hoverEffect="lift"
      hoverSound="paperRustle"
      className="h-full w-full"
    >
      <LayeredArt
        glowSrc="/assets/scene/desk/journal-pages.png"
        aspect="600 / 330"
        className="drop-shadow-[var(--shadow-warm-md)]"
        layers={[
          { src: "/assets/scene/desk/journal-pages.png", className: "journal-pages-layer" },
          {
            src: "/assets/scene/desk/journal-pen.png",
            box: { left: "64.29%", top: "28.34%", width: "26.59%", height: "37.87%" },
            className: "journal-pen-layer",
          },
        ]}
      />
    </InteractiveObject>
  );
}
