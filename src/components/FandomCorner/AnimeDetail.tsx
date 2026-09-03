"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import type { AnimeEntry } from "@/types/content";

interface AnimeDetailProps {
  entry: AnimeEntry;
  onClose: () => void;
}

/** Click-to-enlarge a charm — same click-to-enlarge shape as
 * `MovieDetail`/`ArtworkDetail`. */
export function AnimeDetail({ entry, onClose }: AnimeDetailProps) {
  useEffect(() => {
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-sm flex-col items-center gap-4 py-4"
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

        {entry.cover ? (
          <div className="relative aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-[var(--radius-sm)] shadow-[var(--shadow-warm-lg)]">
            <ArtworkImage image={entry.cover} priority sizes="192px" fit="cover" />
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-1 px-6 text-center">
          <h3 className="font-serif text-xl text-[var(--color-cream)]">{entry.title}</h3>
          {entry.note ? <p className="mt-1 max-w-xs text-sm leading-relaxed text-[var(--color-cream)]/75">{entry.note}</p> : null}
        </div>
      </div>
    </div>
  );
}
