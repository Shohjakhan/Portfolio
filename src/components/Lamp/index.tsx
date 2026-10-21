"use client";

import { audioManager } from "@/lib/audio/manager";
import { GlowCopy } from "@/components/shared/GlowCopy";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions, useLampLit } from "@/state/sceneStore";

/**
 * The table lamp — a real switch. Pressing it turns the lamp on or off, and the
 * hanging string lights follow it (see `FairyLights`, same `useLampLit`). Until
 * the visitor presses it, it follows the clock (lit from sunset on), so the room
 * still wakes up on its own at night. Painted as two matched images
 * (art-source/06-landing-objects/): the lamp with its shade dark, and the shade lit
 * up, faded in and out on top (transparency from brightness, so only light shows).
 */
export function Lamp() {
  const lit = useLampLit();

  return (
    <InteractiveObject
      id="lamp"
      label="The Lamp"
      description={lit ? "Switch the lamp off — the string lights go with it." : "Switch the lamp on — the string lights glow with it."}
      onActivate={() => {
        audioManager.playInteraction("uiTransition");
        sceneActions.toggleLamp();
      }}
      pressed={lit}
      idleAnimation="none"
      hoverEffect="glow"
      className="h-full w-full"
    >
      {/* Aspect-locked to the painted lamp and bottom-anchored, so the glow lands on the shade. */}
      <div className="absolute bottom-0 left-1/2 h-full max-w-full -translate-x-1/2" style={{ aspectRatio: "400 / 536" }}>
        <GlowCopy src="/assets/scene/decor/lamp.png" />
        <img src="/assets/scene/decor/lamp.png" alt="" aria-hidden className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-md)]" />
        <div data-idle={lit ? "flicker" : undefined} style={{ animationDelay: "600ms" }} className="pointer-events-none absolute inset-0">
          <img
            src="/assets/scene/decor/lamp-glow.png"
            alt=""
            aria-hidden
            className="h-full w-full"
            style={{ opacity: lit ? 1 : 0, transition: "opacity 600ms var(--ease-soft)" }}
          />
          {/* soft spill of the light onto the wall around the shade */}
          <div
            className="absolute -inset-x-[45%] -top-[10%] h-[70%]"
            style={{
              background: "radial-gradient(40% 38% at 50% 48%, var(--room-lamp-glow), transparent 72%)",
              opacity: lit ? 0.45 : 0,
              transition: "opacity 600ms var(--ease-soft)",
            }}
          />
        </div>
      </div>
    </InteractiveObject>
  );
}
