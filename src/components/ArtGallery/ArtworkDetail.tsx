"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import { MEDIUM_LABELS } from "@/data/gallery";
import type { Artwork } from "@/types/content";

interface ArtworkDetailProps {
  artwork: Artwork;
  onClose: () => void;
}

/**
 * "User can just click on the painting to see it bigger and maybe a name
 * and description of it" — a focused lightbox over the whole viewport
 * (`fixed`, above Modal's own `z-50`), not scoped to wherever the wall
 * happened to be scrolled. Escape closes it, same convention as every
 * other overlay in the room; clicking the scrim closes it too, clicking
 * the artwork/text itself doesn't (`stopPropagation`).
 */
export function ArtworkDetail({ artwork, onClose }: ArtworkDetailProps) {
  useEffect(() => {
    // Modal (the panel this lightbox sits inside) has its own bubble-phase
    // Escape listener on `document` that closes the whole "art" panel —
    // registering here on `document` too but in the CAPTURE phase, and
    // calling stopPropagation, means this fires first and the event never
    // reaches Modal's listener. Without this, Escape while the lightbox is
    // open closes the entire panel instead of just the lightbox (capture
    // listeners on the same node always run before bubble listeners on
    // that node, regardless of registration order — that ordering is what
    // makes this reliable, not a coincidence of listener attach order).
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="animate-gallery-lightbox-in relative flex max-h-full w-full max-w-lg flex-col items-center gap-4 overflow-y-auto py-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-0 top-0 rounded-full p-1.5 text-[var(--color-cream)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-white/10 hover:text-[var(--color-cream)]"
        >
          <X size={20} strokeWidth={1.75} />
        </button>

        <div className="gallery-frame relative aspect-[3/4] h-[46vh] max-h-[420px] shrink-0 rounded-[2px] border-[10px] border-[#1a1410] bg-[#050403] p-2">
          <div className="relative h-full w-full overflow-hidden bg-black/40">
            <ArtworkImage image={artwork.image} priority sizes="(max-width: 640px) 88vw, 480px" className="p-1" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-8 text-center">
          <h3 className="font-serif text-xl text-[var(--color-cream)]">{artwork.title}</h3>
          <p className="text-xs tracking-[0.08em] text-[var(--color-cream)]/70 uppercase">
            {MEDIUM_LABELS[artwork.medium]}
            {artwork.year ? ` · ${artwork.year}` : ""}
          </p>
          {artwork.materials ? <p className="text-xs text-[var(--color-cream)]/70 italic">{artwork.materials}</p> : null}
          {artwork.description ? (
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-[var(--color-cream)]/70">{artwork.description}</p>
          ) : null}
          {artwork.notes ? (
            <p className="mt-2 max-w-sm font-hand-note text-lg leading-snug text-[var(--room-lamp-glow)]/90">
              &ldquo;{artwork.notes}&rdquo;
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
