"use client";

import { Film, PlayCircle } from "lucide-react";
import { ArtworkImage } from "@/components/ArtGallery/ArtworkImage";
import { BackLink } from "@/components/shared/BackLink";
import type { MemoryReel } from "@/types/content";

/** The five frame windows of the painted strip, as % of its width. */
const FRAMES = [
  { left: 4.79, width: 16.5 },
  { left: 22.56, width: 17.48 },
  { left: 41.21, width: 17.58 },
  { left: 59.96, width: 17.48 },
  { left: 78.71, width: 16.5 },
];

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

      {/* The painted filmstrip (art-source/07-panels M3): five transparent frames per
          strip, so a reel's photos show through them. Frame boxes are % of the strip. */}
      <div className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-2">
        {Array.from({ length: Math.max(1, Math.ceil(reel.items.length / 5)) }, (_, strip) => (
          <div key={strip} className="relative w-[min(88vw,820px)] shrink-0 snap-start" style={{ aspectRatio: "1024 / 223" }}>
            {reel.items.slice(strip * 5, strip * 5 + 5).map((item, i) => (
              <div
                key={item.id}
                className="absolute overflow-hidden bg-black/60"
                style={{ left: `${FRAMES[i].left}%`, width: `${FRAMES[i].width}%`, top: "26%", height: "48.9%" }}
              >
                <ArtworkImage image={item.image} sizes="160px" fit="cover" />
                {item.kind === "video" ? (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                    <PlayCircle size={24} strokeWidth={1.5} className="text-[var(--color-cream)]/90" aria-hidden />
                  </span>
                ) : null}
              </div>
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention */}
            <img src="/assets/panels/memories/filmstrip.png" alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {reel.items.length === 0 ? (
          <p className="flex items-center justify-center gap-2 text-center font-serif text-sm italic text-[var(--color-paper-ink)]/75">
            <Film size={16} strokeWidth={1.5} aria-hidden />
            No frames developed yet for {reel.title} — photos and videos will hang here.
          </p>
        ) : null}
      </div>
    </div>
  );
}
