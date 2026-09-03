"use client";

import { useEffect, useState } from "react";

/** Starts empty and fills in on mount — same reasoning as AmbientLayer's
 * randomized particles: computing `Date` during render would make the
 * server-rendered HTML and the client's first render disagree. */
function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

/**
 * The screen's system menu bar — the single most recognizable "this is a
 * Mac desktop" cue, sitting above both the desktop icon grid and any open
 * window (matching how a real menu bar persists across app windows rather
 * than belonging to one). A real, ticking clock is the one bit of "small
 * animation" here — everything else is static chrome, not decoration.
 */
export function MenuBar() {
  const time = useClock();

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-black/35 px-4 py-1.5 text-xs text-[var(--color-cream)]/80">
      <div className="flex items-center gap-4">
        <span className="font-serif text-[var(--color-cream)]">✧ Shohjahon</span>
        <span className="hidden text-[var(--color-cream)]/70 sm:inline">Finder</span>
      </div>
      <span className="tabular-nums text-[var(--color-cream)]/70">{time}</span>
    </div>
  );
}
