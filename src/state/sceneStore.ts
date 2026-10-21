"use client";

import { createStore, useStoreSelector } from "@/state/createStore";
import type { PanelId, SceneObjectId, TimeOfDay, VisitStage, WeatherCondition } from "@/types/scene";

export interface SceneState {
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
  /** Object currently hovered OR keyboard-focused — treated identically everywhere. */
  activeObject: SceneObjectId | null;
  activePanel: PanelId | null;
  reducedMotion: boolean;
  audioEnabled: boolean;
  /** Dwell-time stage — see useVisitProgress. Drives small ambient nudges only. */
  visitStage: VisitStage;
  /** The visitor's own switch on the table lamp. `null` = follow the time of day (lit from
   * sunset on); `true`/`false` = they've pressed it. The hanging string lights follow the lamp. */
  lampOverride: boolean | null;
}

/**
 * `timeOfDay` starts at a safe, static default — real detection only runs
 * client-side in an effect (useLocalTimeOfDay), same reasoning as
 * `reducedMotion` defaulting false: computing it during render/module-init
 * would either need `Date` at import time (wrong on the server, and would
 * make server and first client render disagree — a hydration mismatch) or
 * guessing. "night" was already the pre-existing default before the room
 * had any live clock, so this keeps first paint unchanged for anyone whose
 * effects haven't run yet (no-JS, or the split second before mount).
 */
const initialState: SceneState = {
  timeOfDay: "night",
  weather: "clear",
  activeObject: null,
  activePanel: null,
  reducedMotion: false,
  audioEnabled: false,
  visitStage: "initial",
  lampOverride: null,
};

export const sceneStore = createStore<SceneState>(initialState);

/** Same-tab-only preference key — see `setAudioEnabled`'s doc comment for
 * why this is `sessionStorage`, not `localStorage`. */
const AUDIO_PREFERENCE_KEY = "room.audioEnabled";

function persistAudioPreference(audioEnabled: boolean) {
  try {
    window.sessionStorage.setItem(AUDIO_PREFERENCE_KEY, String(audioEnabled));
  } catch {
    // Private browsing / storage disabled — the preference just won't
    // survive a reload this tab, same as if it were never remembered.
  }
}

/** Whether the lamp (and the string lights with it) is on: the visitor's switch, else the clock. */
export function isLampLit(state: Pick<SceneState, "lampOverride" | "timeOfDay">): boolean {
  if (state.lampOverride !== null) return state.lampOverride;
  return state.timeOfDay === "sunset" || state.timeOfDay === "evening" || state.timeOfDay === "night";
}

export const sceneActions = {
  toggleLamp() {
    sceneStore.setState({ lampOverride: !isLampLit(sceneStore.getState()) });
  },
  /** No-op when unchanged — useLocalTimeOfDay calls this on a recurring timer, and every store write notifies subscribers. */
  setTimeOfDay(timeOfDay: TimeOfDay) {
    if (sceneStore.getState().timeOfDay === timeOfDay) return;
    sceneStore.setState({ timeOfDay });
  },
  setWeather(weather: WeatherCondition) {
    if (sceneStore.getState().weather === weather) return;
    sceneStore.setState({ weather });
  },
  setVisitStage(visitStage: VisitStage) {
    if (sceneStore.getState().visitStage === visitStage) return;
    sceneStore.setState({ visitStage });
  },
  setActiveObject(activeObject: SceneObjectId | null) {
    sceneStore.setState({ activeObject });
  },
  openPanel(panel: PanelId) {
    sceneStore.setState({ activePanel: panel });
  },
  closePanel() {
    sceneStore.setState({ activePanel: null });
  },
  setReducedMotion(reducedMotion: boolean) {
    sceneStore.setState({ reducedMotion });
  },
  toggleAudio() {
    const audioEnabled = !sceneStore.getState().audioEnabled;
    sceneStore.setState({ audioEnabled });
    persistAudioPreference(audioEnabled);
  },
  /** Only two callers: `AudioControls` could use this instead of
   * `toggleAudio`, and `useAudioPreference`'s restore-on-mount, which
   * needs to *set* the remembered value rather than flip whatever the
   * default happens to be. Also persists — same reasoning as
   * `toggleAudio`, this is still a real preference change. */
  setAudioEnabled(audioEnabled: boolean) {
    if (sceneStore.getState().audioEnabled === audioEnabled) return;
    sceneStore.setState({ audioEnabled });
    persistAudioPreference(audioEnabled);
  },
};

/** Lamp on/off, as one boolean so only the lamp, string lights and room glow re-render. */
export function useLampLit(): boolean {
  return useStoreSelector(sceneStore, isLampLit);
}

/** Selector hook — always select a primitive (or a memoized value), never a fresh object literal. */
export function useSceneValue<U>(selector: (state: SceneState) => U): U {
  return useStoreSelector(sceneStore, selector);
}
