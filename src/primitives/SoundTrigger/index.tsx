"use client";

import { useEffect, useRef } from "react";
import { useSceneValue } from "@/state/sceneStore";

export interface SoundTriggerProps {
  /** Path to an audio file, e.g. "/sounds/page-turn.mp3". */
  src: string;
  /** Play a hit whenever this value changes — pass a click counter, a boolean pulse, etc. */
  trigger: unknown;
  volume?: number;
}

/**
 * Headless — renders nothing, just plays `src` when `trigger` changes,
 * gated on the scene's global audioEnabled flag (see AudioControls). Skips
 * the mount itself so opening with a truthy initial trigger doesn't play.
 */
export function SoundTrigger({ src, trigger, volume = 0.5 }: SoundTriggerProps) {
  const audioEnabled = useSceneValue((state) => state.audioEnabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (!audioEnabled) return;

    audioRef.current ??= new Audio(src);
    audioRef.current.volume = volume;
    audioRef.current.currentTime = 0;
    void audioRef.current.play().catch(() => {
      // Autoplay can still be blocked by the browser; failing silently is fine here.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire only on `trigger` changes
  }, [trigger]);

  return null;
}
