"use client";

import { useEffect, useRef } from "react";
import type { InteractionCueId } from "@/lib/audio/cues";
import { audioManager } from "@/lib/audio/manager";

export interface SoundTriggerProps {
  /** A cue id from `lib/audio/cues.ts`'s `INTERACTION_CUES` — not a raw
   * file path; the catalog is the one place a cue's file/volume/cooldown
   * live (see its own doc comment). */
  cue: InteractionCueId;
  /** Play a hit whenever this value changes — pass a click counter, a boolean pulse, etc. */
  trigger: unknown;
}

/**
 * Headless — renders nothing, just asks `audioManager` to play `cue`
 * whenever `trigger` changes. All the actual gating (on/off, cooldown,
 * concurrency cap, reduced-motion) lives in the manager, not here — this
 * is only the "value changed" → "play" wiring for the cases where a
 * component doesn't already have a direct event handler to call the
 * manager from (see `BookReader`/`PlainBook`'s page index, `Phone`'s ring
 * count). Skips the mount itself so opening with a truthy initial trigger
 * doesn't play.
 */
export function SoundTrigger({ cue, trigger }: SoundTriggerProps) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    audioManager.playInteraction(cue);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire only on `trigger` changes
  }, [trigger]);

  return null;
}
