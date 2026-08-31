"use client";

import { LayeredArt } from "@/components/shared/LayeredArt";
import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("easel")!;

export function Easel() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="sway"
      idleDelayMs={2600}
      hoverEffect="tilt"
      className="h-full w-full"
    >
      <LayeredArt
        aspect="120 / 240"
        className="drop-shadow-[var(--shadow-warm-md)]"
        layers={[
          { src: "/assets/scene/art/easel-frame.svg" },
          {
            src: "/assets/scene/art/easel-canvas.svg",
            box: { left: "18%", top: "22.5%", width: "63%", height: "40%" },
          },
          {
            src: "/assets/scene/art/easel-brushes.svg",
            box: { left: "62%", top: "31%", width: "33%", height: "32%" },
            idle: "sway",
            style: { animationDelay: "1900ms" },
          },
        ]}
      />
    </InteractiveObject>
  );
}
