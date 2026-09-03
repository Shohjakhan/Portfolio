"use client";

import { Film, PlayCircle } from "lucide-react";
import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import { BackLink } from "@/components/shared/BackLink";
import type { MemoryReel } from "@/types/content";

interface FilmStripProps {
  reel: MemoryReel;
  onBack: () => void;
}

/**
 * "A long movie tape I'll put the photos and videos on" — a reel's
 * photos/videos laid out as frames scrolling between two perforated
 * edges, like an actual filmstrip. The strip itself is dark, so its text
 * uses cream/light tones directly rather than the shared `EmptyState`
 * (built for the light paper background every other empty state sits
 * on) — reused as-is here would be low-contrast on this dark strip.
 */
export function FilmStrip({ reel, onBack }: FilmStripProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-serif text-2xl text-[var(--color-paper-ink)]">{reel.title}</h3>
        {reel.period ? <p className="text-sm text-[var(--color-paper-ink)]/70">{reel.period}</p> : null}
        {reel.description ? (
          <p className="mt-1 max-w-lg text-sm leading-relaxed text-[var(--color-paper-ink)]/70">{reel.description}</p>
        ) : null}
      </div>

      <div className="filmstrip overflow-hidden rounded-[var(--radius-md)]">
        <div className="filmstrip-edge" aria-hidden />
        {reel.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
            <Film size={22} strokeWidth={1.5} className="text-[var(--color-cream)]/35" aria-hidden />
            <p className="max-w-xs font-serif text-sm italic text-[var(--color-cream)]/70">
              No frames developed yet for {reel.title} — photos and videos will hang here.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto px-4 py-4">
            {reel.items.map((item) => (
              <div
                key={item.id}
                className="relative h-56 w-40 shrink-0 overflow-hidden rounded-[2px] border-[6px] border-[var(--color-cream)] bg-black/40 shadow-[var(--shadow-warm-md)]"
              >
                <ArtworkImage image={item.image} sizes="160px" fit="cover" />
                {item.kind === "video" ? (
                  <PlayCircle
                    size={30}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute inset-0 m-auto text-[var(--color-cream)]/85"
                    aria-hidden
                  />
                ) : null}
                {item.caption ? (
                  <p className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[0.65rem] text-[var(--color-cream)]">
                    {item.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
        <div className="filmstrip-edge" aria-hidden />
      </div>

      <BackLink onClick={onBack} label="the reels" />
    </div>
  );
}
