"use client";

import { useEffect, useRef } from "react";
import { sceneActions } from "@/state/sceneStore";

const AUDIO_PREFERENCE_KEY = "room.audioEnabled";

/**
 * Mounted once near the root (see Room). Restores "sound was on" from
 * `sessionStorage` — deliberately session-only, not `localStorage`: the
 * brief's "do not autoplay… sound must begin only after explicit user
 * interaction" rule is easiest to honor exactly by making a brand-new tab
 * always start silent, no exception. `sessionStorage` still satisfies
 * "remember the preference during the session" — a reload or a
 * back/forward navigation within the same tab restores it — while never
 * attempting to resume audio on a tab that's never seen a real gesture at
 * all. Restoring still goes through the same gated `AudioManager` calls
 * every other trigger does (see `useAmbientAudio`), so if the browser
 * blocks the resume anyway (some browsers reset gesture history harder
 * than others across reloads), it just stays silent — the toggle can look
 * "on" but silent for a moment until the next real click, same
 * fail-quiet contract as everywhere else in this system.
 */
export function useAudioPreference() {
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    let stored: string | null = null;
    try {
      stored = window.sessionStorage.getItem(AUDIO_PREFERENCE_KEY);
    } catch {
      // Private browsing / storage disabled — start from the default (off).
    }
    if (stored === "true") sceneActions.setAudioEnabled(true);
  }, []);
}
