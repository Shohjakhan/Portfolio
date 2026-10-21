"use client";

import { X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import type { ArtFrame } from "@/components/ArtGallery/wallLayout";
import { MEDIUM_LABELS } from "@/data/gallery";
import type { Artwork } from "@/types/content";

interface ArtworkDetailProps {
  artwork: Artwork;
  /** The frame the piece hangs in on the wall — it keeps it here. */
  frame: ArtFrame;
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
export function ArtworkDetail({ artwork, frame, onClose }: ArtworkDetailProps) {
  // Portalled to <body>: the panel around it is a transformed (animated) element, which would
  // otherwise become this overlay's containing block and shrink "fixed inset-0" to the panel.
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

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

  if (!host) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
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

        {/* the piece in its own painted frame, same style and proportions as on the wall; the frame's
            thickness is a share of the piece's shorter side (see `.gallery-frame-piece` in textures.css) */}
        <div
          className="relative shrink-0 [container-type:inline-size]"
          style={{ width: `min(88vw, calc(min(46vh, 420px) * ${frame.aspect}))`, aspectRatio: `${frame.aspect}` }}
        >
          <div
            data-style={frame.style}
            className="gallery-frame-piece h-full w-full"
            style={{ "--frame-k": Math.min(1, 1 / frame.aspect) } as CSSProperties}
          >
            <div className="gallery-frame-mat h-full w-full">
              <div className="relative h-full w-full overflow-hidden">
                <ArtworkImage image={artwork.image} priority sizes="(max-width: 640px) 88vw, 480px" fit="cover" />
              </div>
            </div>
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
    </div>,
    host,
  );
}
