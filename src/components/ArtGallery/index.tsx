"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ArtFrame } from "@/components/ArtGallery/wallLayout";
import { ArtworkDetail } from "@/components/ArtGallery/ArtworkDetail";
import { GalleryWall } from "@/components/ArtGallery/GalleryWall";
import { WALL_SIZE } from "@/components/ArtGallery/wallLayout";
import { BackLink } from "@/components/shared/BackLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { artworks } from "@/data/gallery";
import { AmbientLayer } from "@/primitives/AmbientLayer";
import { SceneTransition } from "@/primitives/SceneTransition";
import type { Artwork } from "@/types/content";

interface ArtGalleryProps {
  onClose: () => void;
}

/**
 * The Easel → "My Art" experience — a small private gallery's wall, not a
 * grid and not sections/categories. `GalleryWall` scatters one "wallful"
 * of pieces (`WALL_SIZE` at a time, salon-style — see `wallLayout.ts`);
 * when there are more pieces than fit, "if one wall fills up there will
 * be another wall" becomes literal wall-to-wall paging here, reusing
 * `SceneTransition`'s direction-aware artwork-slide variant. Clicking any
 * piece opens `ArtworkDetail` (bigger, with its name/description) as a
 * full-viewport lightbox, independent of which wall is showing.
 */
export function ArtGallery({ onClose }: ArtGalleryProps) {
  const walls = useMemo(() => {
    if (artworks.length === 0) return [];
    const chunks: Artwork[][] = [];
    for (let i = 0; i < artworks.length; i += WALL_SIZE) {
      chunks.push(artworks.slice(i, i + WALL_SIZE));
    }
    return chunks;
  }, []);

  const [wallIndex, setWallIndex] = useState(0);
  const [wallDirection, setWallDirection] = useState<"forward" | "backward">("forward");
  const [openArtwork, setOpenArtwork] = useState<{ artwork: Artwork; frame: ArtFrame } | null>(null);

  const goToWall = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(walls.length - 1, nextIndex));
    if (clamped === wallIndex) return;
    setWallDirection(clamped > wallIndex ? "forward" : "backward");
    setWallIndex(clamped);
  };

  // Wall-to-wall paging by keyboard — only when there's more than one wall
  // and no piece is currently open (ArtworkDetail owns Escape/keyboard while it's up).
  useEffect(() => {
    if (openArtwork || walls.length < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goToWall(wallIndex + 1);
      else if (event.key === "ArrowLeft") goToWall(wallIndex - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo closes over wallIndex/walls.length, both already deps
  }, [wallIndex, walls.length, openArtwork]);

  if (walls.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          icon={ImageOff}
          message="The gallery is still empty — paintings, sketches, and photographs will hang here soon."
        />
        <BackLink onClick={onClose} variant="dark" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-3">
      <AmbientLayer variant="dust" count={10} className="opacity-60" />

      <SceneTransition
        transitionKey={wallIndex}
        variant={wallDirection === "forward" ? "artwork-forward" : "artwork-backward"}
      >
        <GalleryWall artworks={walls[wallIndex]} wallIndex={wallIndex} onSelect={(artwork, frame) => setOpenArtwork({ artwork, frame })} />
      </SceneTransition>

      {walls.length > 1 ? (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToWall(wallIndex - 1)}
            disabled={wallIndex === 0}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-[var(--color-cream)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-white/10 hover:text-[var(--color-cream)] disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={14} strokeWidth={1.75} aria-hidden />
            Previous wall
          </button>
          <p className="text-xs text-[var(--color-cream)]/70">
            Wall {wallIndex + 1} of {walls.length}
          </p>
          <button
            type="button"
            onClick={() => goToWall(wallIndex + 1)}
            disabled={wallIndex === walls.length - 1}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-[var(--color-cream)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-white/10 hover:text-[var(--color-cream)] disabled:pointer-events-none disabled:opacity-30"
          >
            Next wall
            <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      ) : null}

      <BackLink onClick={onClose} variant="dark" align="center" />

      {openArtwork ? <ArtworkDetail artwork={openArtwork.artwork} frame={openArtwork.frame} onClose={() => setOpenArtwork(null)} /> : null}
    </div>
  );
}
