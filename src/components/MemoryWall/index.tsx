"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { GlowCopy } from "@/components/shared/GlowCopy";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("memoryWall")!;

/** One painted cluster of five pinned photos (art-source/06-landing-objects/). */
export function MemoryWall() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="breathe"
      idleDelayMs={3000}
      hoverEffect="glow"
      labelPlacement="top"
      className="h-full w-full"
    >
      <GlowCopy src="/assets/scene/decor/memory-wall.png" />
      <img
        src="/assets/scene/decor/memory-wall.png"
        alt=""
        aria-hidden
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
      />
    </InteractiveObject>
  );
}
