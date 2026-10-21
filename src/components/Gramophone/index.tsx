"use client";

import { useSyncExternalStore } from "react";
import { GlowCopy } from "@/components/shared/GlowCopy";
import { music } from "@/lib/audio/gramophoneMusic";
import { InteractiveObject } from "@/primitives/InteractiveObject";

const NOTES = ["♪", "♫", "♪"];

/**
 * The gramophone plays the room's music: press it and a random track from the owner's YouTube
 * playlist starts, shuffled anew every time (see `lib/audio/gramophoneMusic.ts`); press again to
 * lift the needle. Little notes drift up from the horn while it plays.
 */
export function Gramophone() {
  const { playing, title } = useSyncExternalStore(music.subscribe, music.getSnapshot, music.getServerSnapshot);

  return (
    <InteractiveObject
      id="gramophone"
      label="The Gramophone"
      description={playing ? (title ? `Now playing: ${title}` : "Finding a record…") : "Drop the needle — a random record from the playlist."}
      onActivate={music.toggle}
      pressed={playing}
      idleAnimation="none"
      hoverEffect="glow"
      className="h-full w-full"
    >
      <div
        className="absolute bottom-0 left-1/2 h-full max-w-full -translate-x-1/2"
        style={{ aspectRatio: "497 / 647" }}
        onPointerEnter={music.preload}
      >
        <GlowCopy src="/assets/scene/living/gramophone.png" />
        {/* eslint-disable-next-line @next/next/no-img-element -- painted art, matches the room's plain <img> convention */}
        <img
          src="/assets/scene/living/gramophone.png"
          alt=""
          aria-hidden
          className="h-full w-full object-contain drop-shadow-[var(--shadow-warm-md)]"
        />
        {playing ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-full mt-1 w-max max-w-[16rem] -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-center font-serif text-[0.7rem] leading-tight text-[var(--color-cream)]/90 backdrop-blur-sm"
          >
            ♪ {title || "finding a record…"}
          </span>
        ) : null}
        {playing
          ? NOTES.map((note, index) => (
              <span
                key={index}
                aria-hidden
                className="music-note pointer-events-none absolute font-serif text-[clamp(0.9rem,1.6vw,1.6rem)] text-[var(--room-lamp-glow)]"
                style={{ left: `${32 + index * 9}%`, top: "14%", animationDelay: `${index * 1.1}s` }}
              >
                {note}
              </span>
            ))
          : null}
      </div>
    </InteractiveObject>
  );
}
