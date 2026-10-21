"use client";

import { useEffect, useState } from "react";

/** Hand geometry in % of the clock face (art-source/08-living-room, measured off the painted
 * hands): each hand's width, and where its pivot ring sits within it. */
const FACE_HOLE = { x: 50.13, y: 48.7 };
const HANDS = {
  hour: { src: "/assets/scene/living/hand-hour.png", width: 11.79, pivotX: 5.953, pivotY: 27.42, originX: 50.5, originY: 85.7 },
  minute: { src: "/assets/scene/living/hand-minute.png", width: 7.627, pivotX: 3.609, pivotY: 35.78, originX: 47.3, originY: 88.6 },
} as const;

/**
 * The wall clock — purely environmental, and it tells the real local time (the same clock that
 * drives the room's time of day). The face and the two hands are separate paintings; the hands
 * turn about their pivot rings.
 */
export function WallClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const minutes = now ? now.getMinutes() + now.getSeconds() / 60 : 0;
  const hours = now ? (now.getHours() % 12) + minutes / 60 : 0;
  const angle = { hour: hours * 30, minute: minutes * 6 };

  return (
    <div aria-hidden className="pointer-events-none relative h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- painted art, matches the room's plain <img> convention */}
      <img src="/assets/scene/living/clock-face.png" alt="" className="absolute inset-0 h-full w-full" />
      {(["hour", "minute"] as const).map((name) => {
        const hand = HANDS[name];
        return (
          // eslint-disable-next-line @next/next/no-img-element -- painted art
          <img
            key={name}
            src={hand.src}
            alt=""
            className="absolute drop-shadow-[1px_2px_2px_rgba(0,0,0,0.45)]"
            style={{
              left: `${FACE_HOLE.x - hand.pivotX}%`,
              top: `${FACE_HOLE.y - hand.pivotY}%`,
              width: `${hand.width}%`,
              transformOrigin: `${hand.originX}% ${hand.originY}%`,
              transform: `rotate(${angle[name]}deg)`,
              transition: now ? "transform 400ms linear" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
