"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("journal")!;

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
      hoverEffect="wiggle"
      className="h-full w-full"
    >
      <img
        src="/assets/scene/desk/journal.svg"
        alt=""
        aria-hidden
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
      />
    </InteractiveObject>
  );
}
