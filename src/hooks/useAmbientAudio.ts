"use client";

import { useEffect, useRef } from "react";
import type { AmbientCueId } from "@/lib/audio/cues";
import { audioManager } from "@/lib/audio/manager";
import { useSceneValue } from "@/state/sceneStore";
import type { WeatherCondition } from "@/types/scene";

/** Which single environment bed plays for a given weather — see
 * `AudioManager.syncAmbient`'s doc comment for why it's always exactly
 * one of these, never more. `snow` maps to `wind` rather than getting a
 * dedicated snow bed of its own: a real snowfall has no meaningful sound
 * on its own (it's silent by nature) beyond the light wind that usually
 * comes with it — a fifth near-identical "snow" loop would just be
 * another asset to source for no audible difference. Keyed on
 * `WeatherCondition` itself (not a loose string map) so adding a new
 * weather value without updating this fails to type-check instead of
 * silently falling back. */
const BED_FOR_WEATHER: Record<WeatherCondition, AmbientCueId> = {
  rain: "rain",
  snow: "wind",
  cloudy: "roomTone",
  clear: "roomTone",
};

/**
 * Mounted once near the root (see Room). The reactive glue between scene
 * state and `AudioManager.syncAmbient` — the manager itself knows nothing
 * about weather or time of day, it just plays what it's told, same
 * separation `sceneStore` already keeps between "what the room's state
 * is" and "what each object does about it."
 *
 * `music` (the brief's "optional background music") is registered in the
 * cue catalog but deliberately never triggered from here — nothing in the
 * room's scene state maps naturally to "start playing music now," and
 * layering unrequested music under nature ambience is more likely to
 * read as cluttered than cozy (the brief's own "avoid overlapping sounds
 * becoming chaotic," applied to a layer nobody asked to hear). It stays
 * available in the catalog for a future dedicated control, not wired to
 * anything today.
 */
export function useAmbientAudio() {
  const audioEnabled = useSceneValue((state) => state.audioEnabled);
  const weather = useSceneValue((state) => state.weather);
  const timeOfDay = useSceneValue((state) => state.timeOfDay);
  const hasWarmed = useRef(false);

  useEffect(() => {
    if (audioEnabled && !hasWarmed.current) {
      hasWarmed.current = true;
      audioManager.warmInteractionCues();
    }

    audioManager.syncAmbient({
      enabled: audioEnabled,
      bed: BED_FOR_WEATHER[weather],
      fireplace: timeOfDay === "evening" || timeOfDay === "night",
    });
  }, [audioEnabled, weather, timeOfDay]);
}
