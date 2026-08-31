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
};

export const sceneStore = createStore<SceneState>(initialState);

export const sceneActions = {
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
    sceneStore.setState((state) => ({ audioEnabled: !state.audioEnabled }));
  },
};

/** Selector hook — always select a primitive (or a memoized value), never a fresh object literal. */
export function useSceneValue<U>(selector: (state: SceneState) => U): U {
  return useStoreSelector(sceneStore, selector);
}
