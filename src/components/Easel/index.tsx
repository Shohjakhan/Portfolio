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
      idleAnimation="settle"
      idleDelayMs={2600}
      hoverEffect="tilt"
      className="h-full w-full"
    >
      <LayeredArt
        glowSrc="/assets/scene/art/easel.png"
        aspect="360 / 565"
        className="drop-shadow-[var(--shadow-warm-md)]"
        layers={[
          // The whole painted easel — frame, brush jar and palette — as one
          // image. The jar's brushes overlap the canvas, so it can't be cut
          // out cleanly to sway on its own (see art-source/03-easel/).
          { src: "/assets/scene/art/easel.png" },
          // The canvas again, cut from the same painting and sitting exactly
          // on top of itself, purely so the hover "catches the light" filter
          // (.easel-canvas-layer) can brighten only the painting.
          {
            src: "/assets/scene/art/easel-canvas.png",
            box: { left: "0.24%", top: "22.83%", width: "81.15%", height: "43.07%" },
            className: "easel-canvas-layer",
          },
        ]}
      />
    </InteractiveObject>
  );
}
