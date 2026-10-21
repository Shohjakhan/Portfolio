"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import type { Movie } from "@/types/content";

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

/** Click-to-enlarge a ticket — same capture-phase-Escape/backdrop-click
 * pattern as `ArtworkDetail`, so Escape closes only this, not the whole
 * "Cinema" panel underneath it. */
export function MovieDetail({ movie, onClose }: MovieDetailProps) {
  // Portalled to <body>: the dialog around it is a transformed (animated) element, which would
  // otherwise become this overlay's containing block and shrink "fixed inset-0" to the dialog.
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  useEffect(() => {
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
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-md flex-col items-center gap-4 py-4"
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

        {movie.poster ? (
          <div className="relative aspect-[2/3] w-[min(62vw,300px)] shrink-0 overflow-hidden rounded-[var(--radius-sm)] shadow-[var(--shadow-warm-lg)]">
            <ArtworkImage image={movie.poster} priority sizes="300px" fit="cover" />
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-1 px-6 text-center">
          <h3 className="font-serif text-xl text-[var(--color-cream)]">{movie.title}</h3>
          {movie.year ? <p className="text-xs text-[var(--color-cream)]/70">{movie.year}</p> : null}
          {movie.note ? <p className="mt-1 max-w-xs text-sm leading-relaxed text-[var(--color-cream)]/75">{movie.note}</p> : null}
        </div>
      </div>
    </div>,
    host,
  );
}
