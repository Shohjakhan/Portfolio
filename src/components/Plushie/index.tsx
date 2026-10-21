"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { GlowCopy } from "@/components/shared/GlowCopy";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("plushie")!;

export function Plushie() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="breathe"
      idleDelayMs={2800}
      idleDurationMs={5800}
      hoverEffect="wiggle"
      className="h-full w-full"
    >
      <GlowCopy src="/assets/scene/decor/plushie.png" />
      <img
        src="/assets/scene/decor/plushie.png"
        alt=""
        aria-hidden
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
      />
    </InteractiveObject>
  );
}
