"use client";

import type { CSSProperties } from "react";
import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DECOR_SLOTS, WALL_SLOTS, getFrameStyle, type ArtFrame } from "@/components/ArtGallery/wallLayout";
import type { Artwork } from "@/types/content";

interface GalleryWallProps {
  artworks: Artwork[];
  wallIndex: number;
  onSelect: (artwork: Artwork, frame: ArtFrame) => void;
}

const DECOR_SRC = {
  monstera: "/assets/panels/art/decor-plant.png",
  ballerina: "/assets/panels/art/decor-ballerina.png",
  bust: "/assets/panels/art/decor-bust.png",
  fig: "/assets/panels/art/decor-fig.png",
} as const;

function canvasStyle(slot: { leftPx: number; topPx: number; widthPx: number; heightPx: number }) {
  return {
    left: `${(slot.leftPx / CANVAS_WIDTH) * 100}%`,
    top: `${(slot.topPx / CANVAS_HEIGHT) * 100}%`,
    width: `${(slot.widthPx / CANVAS_WIDTH) * 100}%`,
    height: `${(slot.heightPx / CANVAS_HEIGHT) * 100}%`,
  };
}

/**
 * A real museum/salon wall — frames hand-hung at irregular heights and
 * sizes, plants and a classical bust standing in the floor gap under
 * specific frames (see `wallLayout.ts` for the canvas/percentage
 * approach that makes this scale to any dialog width without ever
 * overlapping or needing to scroll). Frame style (gold/black/wood/slim,
 * gold-dominant) varies per piece too, same as a real wall accumulated
 * over time rather than bought as a matching set. The decor is purely
 * decorative, never clickable, same as the room's own `ArtWall`.
 */
export function GalleryWall({ artworks, wallIndex, onSelect }: GalleryWallProps) {
  return (
    <div className="relative w-full [container-type:inline-size]"
      style={{
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        // the painted gallery room: its floor strip is the bottom ~7%, where the decor stands
        backgroundImage: "linear-gradient(rgba(6,5,4,0.35), rgba(6,5,4,0.5)), url(/assets/panels/art/gallery-wall.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      {WALL_SLOTS.map((slot, slotIndex) => {
        const art = artworks[slotIndex];
        if (!art) return null;
        const style = getFrameStyle(wallIndex, slotIndex);
        return (
          <button
            key={art.id}
            type="button"
            onClick={() => onSelect(art, { style, aspect: slot.widthPx / slot.heightPx })}
            aria-label={`View ${art.title}`}
            className="gallery-wall-piece absolute cursor-pointer"
            style={canvasStyle(slot)}
          >
            <div
              data-style={style}
              className="gallery-frame-piece h-full w-full"
              style={{ "--frame-k": Math.min(slot.widthPx, slot.heightPx) / CANVAS_WIDTH } as CSSProperties}
            >
              <div className="gallery-frame-mat h-full w-full">
                <div className="relative h-full w-full overflow-hidden">
                  <ArtworkImage image={art.image} sizes="20vw" fit="cover" />
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {DECOR_SLOTS.map((decor, index) => (
        <img
          key={index}
          aria-hidden
          src={DECOR_SRC[decor.kind]}
          alt=""
          className="absolute object-contain object-bottom opacity-90"
          style={{ ...canvasStyle(decor), transform: decor.flip ? "scaleX(-1)" : undefined }}
        />
      ))}
    </div>
  );
}
