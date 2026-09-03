"use client";

import { LayeredArt } from "@/components/shared/LayeredArt";
import { getSceneObject } from "@/data/sceneObjects";
import { audioManager } from "@/lib/audio/manager";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("easel")!;

export function Easel() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => {
        audioManager.playInteraction("brushStroke");
        sceneActions.openPanel(definition.panel);
      }}
      idleAnimation="sway"
      idleDelayMs={2600}
      hoverEffect="tilt"
      className="h-full w-full"
      // The easel's interactive box (tall, `aspect: 120/240`) has empty
      // headroom above the canvas layer (which starts at 22.5% down the
      // box) — the default "top" placement anchors to the box's own top
      // edge, which reads as floating well above the easel itself.
      // Pulling it down past that headroom keeps it close to the canvas.
      labelStyle={{ marginBottom: "-42px" }}
    >
      <LayeredArt
        aspect="120 / 240"
        className="drop-shadow-[var(--shadow-warm-md)]"
        layers={[
          { src: "/assets/scene/art/easel-frame.svg" },
          {
            src: "/assets/scene/art/easel-canvas.svg",
            box: { left: "18%", top: "22.5%", width: "63%", height: "40%" },
            className: "easel-canvas-layer",
          },
          {
            src: "/assets/scene/art/easel-brushes.svg",
            box: { left: "62%", top: "31%", width: "33%", height: "32%" },
            idle: "sway",
            style: { animationDelay: "1900ms" },
          },
          {
            src: "/assets/scene/art/palette.svg",
            box: { left: "0%", top: "68%", width: "34%", height: "13%" },
          },
        ]}
      />
    </InteractiveObject>
  );
}
