"use client";

import { Bookshelf } from "@/components/Bookshelf";
import { Cat } from "@/components/Cat";
import { Plants } from "@/components/Plants";

/**
 * The bookshelf with its plant and sleeping cat, laid out in the painted
 * composite's own coordinate system (514×960, the bounding box of the
 * approved art — see art-source/01-bookshelf-test/). The three pieces were
 * cut from one painting, so they only line up if they share one box; as
 * separate `Room` slots with independent `clamp()` sizes they drifted
 * apart at different viewport sizes.
 *
 * Each piece keeps its own component and behavior: `Bookshelf` is the
 * clickable object (hover tilt, per-row book nudge); `Plants` and `Cat`
 * are ambient, `pointer-events-none` so hovering a vine over the shelf
 * still hovers the shelf.
 */
const ASPECT = "514 / 960";

export function BookshelfCorner() {
  return (
    <div className="bookshelf-corner relative mx-auto h-full" style={{ aspectRatio: ASPECT }}>
      <div className="absolute" style={{ left: "4.9%", top: "14%", width: "95.1%", height: "86%" }}>
        <Bookshelf />
      </div>
      <div className="pointer-events-none absolute" style={{ left: "0%", top: "0%", width: "42.6%", height: "37.8%" }}>
        <Plants />
      </div>
      <div className="pointer-events-none absolute" style={{ left: "42.9%", top: "5.4%", width: "57.1%", height: "8.6%" }}>
        <Cat />
      </div>
    </div>
  );
}
