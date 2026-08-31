"use client";

import { getSceneObject } from "@/data/sceneObjects";
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
      idleAnimation="flicker"
      idleDelayMs={800}
      hoverEffect="tilt"
      className="h-full w-full"
    >
      <img
        src="/assets/scene/decor/movie-poster.svg"
        alt=""
        aria-hidden
        className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-md)]"
      />
    </InteractiveObject>
  );
}
