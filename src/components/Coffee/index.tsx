"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions, useSceneValue } from "@/state/sceneStore";

const definition = getSceneObject("coffee")!;

/**
 * Two layers: the cup (float idle, lift on hover — both from
 * InteractiveObject) and steam, which reacts on its own — see
 * `.coffee-steam` in animations.css. Steam's `data-idle="sway"` is set
 * directly here rather than through InteractiveObject (which only owns the
 * button's own idle), so it's gated on reducedMotion explicitly rather than
 * relying solely on the CSS `@media` fallback — see the "ambient living
 * world" lesson about JS-driven state not always matching the media query.
 */
export function Coffee() {
  const reducedMotion = useSceneValue((state) => state.reducedMotion);

  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="float"
      idleDelayMs={1200}
      hoverEffect="lift"
      className="h-full w-full"
    >
      <div className="relative h-full w-full">
        <img
          src="/assets/scene/desk/coffee-cup.svg"
          alt=""
          aria-hidden
          className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
        />
        <img
          src="/assets/scene/desk/coffee-steam.svg"
          alt=""
          aria-hidden
          data-idle={reducedMotion ? undefined : "sway"}
          className="coffee-steam absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </InteractiveObject>
  );
}
