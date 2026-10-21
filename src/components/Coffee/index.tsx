"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { GlowCopy } from "@/components/shared/GlowCopy";
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
      idleAnimation="settle"
      idleDelayMs={1200}
      hoverEffect="lift"
      labelStyle={{ marginBottom: "2.75rem" }}
      className="h-full w-full"
    >
      <div className="relative mx-auto h-full" style={{ aspectRatio: "260 / 208" }}>
        <GlowCopy src="/assets/scene/desk/coffee-cup.png" />
        <img
          src="/assets/scene/desk/coffee-cup.png"
          alt=""
          aria-hidden
          className="relative h-full w-full object-contain drop-shadow-[var(--shadow-warm-sm)]"
        />
        {/* Painted on black; transparency derived from brightness, so
            only the light wisps show. */}
        <img
          src="/assets/scene/desk/coffee-steam.png"
          alt=""
          aria-hidden
          data-idle={reducedMotion ? undefined : "sway"}
          style={{ transformOrigin: "50% 100%" }}
          className="coffee-steam pointer-events-none absolute bottom-[62%] left-[22%] w-[48%]"
        />
      </div>
    </InteractiveObject>
  );
}
