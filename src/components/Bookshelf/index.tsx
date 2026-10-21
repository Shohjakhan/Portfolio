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
      // Still idle + glow (not breathe/tilt): the cat and plant sit on top
      // as separate layers (see BookshelfCorner), and any scale/rotation of
      // the shelf would visibly lift it out from under them. The per-row
      // book nudge below is the hover motion instead.
      idleAnimation="none"
      // glow + scale come from the whole BookshelfCorner instead (see .bookshelf-corner)
      hoverEffect="none"
      labelPlacement="right"
      className="h-full w-full"
    >
      <LayeredArt
        glowSrc="/assets/scene/bookshelf/bookshelf-frame.png"
        aspect="488 / 827"
        className="drop-shadow-[var(--shadow-warm-md)]"
        layers={[
          // Painted carcass with each compartment darkened, so the book rows
          // below can nudge on hover without exposing a duplicate of
          // themselves (see art-source/01-bookshelf-test/review.md).
          { src: "/assets/scene/bookshelf/bookshelf-frame.png" },
          {
            src: "/assets/scene/bookshelf/bookshelf-books-1.png",
            box: { left: "10.45%", top: "6.05%", width: "79.1%", height: "12.94%" },
            className: "bookshelf-books-layer",
            style: { "--book-row-delay": "0ms" } as CSSProperties,
          },
          {
            src: "/assets/scene/bookshelf/bookshelf-books-2.png",
            box: { left: "10.45%", top: "20.8%", width: "79.1%", height: "14.27%" },
            className: "bookshelf-books-layer",
            style: { "--book-row-delay": "50ms" } as CSSProperties,
          },
          {
            src: "/assets/scene/bookshelf/bookshelf-books-3.png",
            box: { left: "10.45%", top: "36.88%", width: "79.1%", height: "19.11%" },
            className: "bookshelf-books-layer",
            style: { "--book-row-delay": "100ms" } as CSSProperties,
          },
          {
            src: "/assets/scene/bookshelf/bookshelf-books-4.png",
            box: { left: "10.45%", top: "58.04%", width: "79.1%", height: "18.74%" },
            className: "bookshelf-books-layer",
            style: { "--book-row-delay": "150ms" } as CSSProperties,
          },
          {
            src: "/assets/scene/bookshelf/bookshelf-books-5.png",
            box: { left: "10.45%", top: "78.6%", width: "79.1%", height: "15.72%" },
            className: "bookshelf-books-layer",
            style: { "--book-row-delay": "200ms" } as CSSProperties,
          },
        ]}
      />
    </InteractiveObject>
  );
}
