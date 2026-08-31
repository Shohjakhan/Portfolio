"use client";

import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("memoryWall")!;

const FRAME = "/assets/scene/decor/photo-frame.svg";

/** Same reuse-over-duplication approach as ArtGallery — one frame asset,
 * instanced in a loose grid. See docs/asset-architecture.md §2. */
export function MemoryWall() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="breathe"
      idleDelayMs={3000}
      hoverEffect="glow"
      className="h-full w-full"
    >
      <div className="relative h-full w-full">
        <img
          src={FRAME}
          alt=""
          aria-hidden
          className="absolute left-[4%] top-[12%] w-[34%] -rotate-1 drop-shadow-[var(--shadow-warm-sm)]"
        />
        <img
          src={FRAME}
          alt=""
          aria-hidden
          className="absolute left-[40%] top-0 w-[30%] rotate-2 drop-shadow-[var(--shadow-warm-sm)]"
        />
        <img
          src={FRAME}
          alt=""
          aria-hidden
          className="absolute left-[68%] top-[20%] w-[28%] -rotate-1 drop-shadow-[var(--shadow-warm-sm)]"
        />
        <img
          src={FRAME}
          alt=""
          aria-hidden
          className="absolute left-[22%] top-[52%] w-[26%] rotate-1 drop-shadow-[var(--shadow-warm-sm)]"
        />
      </div>
    </InteractiveObject>
  );
}
