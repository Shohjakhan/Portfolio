"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { GlowCopy } from "@/components/shared/GlowCopy";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("moviePoster")!;

export function MoviePoster() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="breathe"
      idleDelayMs={800}
      hoverEffect="tilt"
      className="h-full w-full"
    >
      <GlowCopy src="/assets/scene/decor/movie-poster.png" />
      <img
        src="/assets/scene/decor/movie-poster.png"
        alt=""
        aria-hidden
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-md)]"
      />
    </InteractiveObject>
  );
}
