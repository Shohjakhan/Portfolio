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
      idleAnimation="float"
      idleDelayMs={400}
      idleDurationMs={5400}
      hoverEffect="lift"
      hoverSound="paperRustle"
      className="h-full w-full"
    >
      <LayeredArt
        aspect="80 / 70"
        className="drop-shadow-[var(--shadow-warm-sm)]"
        layers={[
          { src: "/assets/scene/desk/journal-pages.svg", className: "journal-pages-layer" },
          {
            src: "/assets/scene/desk/journal-pen.svg",
            box: { left: "62.5%", top: "8.6%", width: "37.5%", height: "40%" },
            className: "journal-pen-layer",
          },
        ]}
      />
    </InteractiveObject>
  );
}
