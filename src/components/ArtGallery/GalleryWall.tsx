"use client";

import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DECOR_SLOTS, WALL_SLOTS, getFrameStyle } from "@/components/ArtGallery/wallLayout";
import type { Artwork } from "@/types/content";

interface GalleryWallProps {
  artworks: Artwork[];
  wallIndex: number;
  onSelect: (artwork: Artwork) => void;
}

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
    <div className="relative w-full" style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}>
      {WALL_SLOTS.map((slot, slotIndex) => {
        const art = artworks[slotIndex];
        if (!art) return null;
        const style = getFrameStyle(wallIndex, slotIndex);
        return (
          <button
            key={art.id}
            type="button"
            onClick={() => onSelect(art)}
            aria-label={`View ${art.title}`}
            className="gallery-wall-piece absolute cursor-pointer"
            style={canvasStyle(slot)}
          >
            <div data-style={style} className="gallery-frame-piece h-full w-full">
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
          src={decor.kind === "plant" ? "/assets/scene/art/gallery-plant.svg" : "/assets/scene/art/gallery-bust.svg"}
          alt=""
          className="absolute object-contain object-bottom opacity-90"
          style={{ ...canvasStyle(decor), transform: decor.flip ? "scaleX(-1)" : undefined }}
        />
      ))}
    </div>
  );
}
