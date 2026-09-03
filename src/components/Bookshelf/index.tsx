"use client";

import type { CSSProperties } from "react";
import { LayeredArt } from "@/components/shared/LayeredArt";
import { getSceneObject } from "@/data/sceneObjects";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { sceneActions } from "@/state/sceneStore";

const definition = getSceneObject("bookshelf")!;

export function Bookshelf() {
  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={() => sceneActions.openPanel(definition.panel)}
      idleAnimation="breathe"
      idleDelayMs={0}
      hoverEffect="tilt"
      labelPlacement="bottom"
      className="h-full w-full"
    >
      <LayeredArt
        aspect="150 / 320"
        className="drop-shadow-[var(--shadow-warm-md)]"
        layers={[
          { src: "/assets/scene/bookshelf/bookshelf-frame.svg" },
          {
            src: "/assets/scene/bookshelf/bookshelf-books.svg",
            box: { left: "8%", top: "3.5%", width: "84%", height: "27%" },
            idle: "flicker",
            className: "bookshelf-books-layer",
            style: { animationDelay: "1100ms", "--book-row-delay": "0ms" } as CSSProperties,
          },
          {
            src: "/assets/scene/bookshelf/bookshelf-books.svg",
            box: { left: "8%", top: "36%", width: "84%", height: "26%" },
            className: "bookshelf-books-layer",
            style: {
              filter: "hue-rotate(45deg) brightness(0.92)",
              "--book-flip": -1,
              "--book-row-delay": "60ms",
            } as CSSProperties,
          },
          {
            src: "/assets/scene/bookshelf/bookshelf-books.svg",
            box: { left: "8%", top: "68%", width: "84%", height: "27%" },
            className: "bookshelf-books-layer",
            style: { filter: "hue-rotate(-35deg) brightness(1.05)", "--book-row-delay": "120ms" } as CSSProperties,
          },
        ]}
      />
    </InteractiveObject>
  );
}
