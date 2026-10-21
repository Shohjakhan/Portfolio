"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { audioManager } from "@/lib/audio/manager";
import { GlowCopy } from "@/components/shared/GlowCopy";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("laptop")!;

/** The painted laptop's screen panel (inside its bezel), measured from
 * laptop.png — the HTML screen (constellation + "My Work") sits exactly in
 * it. Hand-rolled rather than LayeredArt since the label shares the box. */
const SCREEN_BOX = { left: "17.25%", top: "4.1%", width: "65.8%", height: "54.2%" };

export function Laptop() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => {
        audioManager.playInteraction("laptopClick");
        sceneActions.openPanel(definition.panel);
      }}
      idleAnimation="none"
      hoverEffect="glow"
      className="h-full w-full"
    >
      <div className="relative mx-auto h-full" style={{ aspectRatio: "600 / 448" }}>
        <GlowCopy src="/assets/scene/desk/laptop.png" />
        <img
          src="/assets/scene/desk/laptop.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[var(--shadow-warm-md)]"
        />
        <div className="laptop-screen-pulse absolute overflow-hidden" style={SCREEN_BOX}>
          <img src="/assets/scene/desk/laptop-screen.svg" alt="" aria-hidden className="laptop-screen h-full w-full object-cover" />
          <span
            aria-hidden
            className="laptop-screen-label pointer-events-none absolute bottom-[12%] left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[9px] text-[#f3e6cf] sm:text-[11px]"
          >
            My Work
          </span>
        </div>
      </div>
    </InteractiveObject>
  );
}
