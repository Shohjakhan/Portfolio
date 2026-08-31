"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("laptop")!;

/** Screen box within the base chassis — matches laptop-base.svg's bezel
 * opening (was previously passed to LayeredArt; hand-rolled here instead
 * since the "My Work" label needs to sit inside this same box, not just
 * the screen image). */
const SCREEN_BOX = { left: "12.7%", top: "10%", width: "74.5%", height: "55.6%" };

export function Laptop() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="flicker"
      idleDelayMs={3400}
      hoverEffect="glow"
      className="h-full w-full"
    >
      <div className="relative mx-auto h-full" style={{ aspectRatio: "110 / 90" }}>
        <img
          src="/assets/scene/desk/laptop-base.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[var(--shadow-warm-md)]"
        />
        <div className="absolute overflow-hidden" style={SCREEN_BOX}>
          <img src="/assets/scene/desk/laptop-screen.svg" alt="" aria-hidden className="laptop-screen h-full w-full object-cover" />
          <span
            aria-hidden
            className="laptop-screen-label pointer-events-none absolute bottom-[12%] left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[7px] text-[#f3e6cf] sm:text-[8px]"
          >
            My Work
          </span>
        </div>
      </div>
    </InteractiveObject>
  );
}
