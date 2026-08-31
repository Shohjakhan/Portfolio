"use client";

import { useEffect } from "react";
import { sceneActions } from "@/state/sceneStore";

/**
 * Mounted once near the root. Syncs `prefers-reduced-motion` into the scene
 * store so animation primitives can read it via `useSceneValue` instead of
 * every component adding its own `matchMedia` listener.
 */
export function usePrefersReducedMotion() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => sceneActions.setReducedMotion(query.matches);
    sync();

    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
}
