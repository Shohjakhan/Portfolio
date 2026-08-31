"use client";

import { useEffect } from "react";
import { sceneActions } from "@/state/sceneStore";
import type { PanelId } from "@/types/scene";

/**
 * Makes browser Back close an open panel instead of leaving /room. On open,
 * pushes one shallow history entry (a `#hash`, no real navigation); if the
 * visitor presses Back while it's open, that pops the entry and we close
 * the panel to match. Closing any other way (X, Escape, backdrop click, an
 * in-content "back to the room" link) just leaves that entry inert —
 * pressing Back afterward is then a normal, harmless one-step navigation
 * back past it, not a special case to handle.
 */
export function usePanelHistorySync(activePanelId: PanelId | null) {
  useEffect(() => {
    if (!activePanelId) return;

    window.history.pushState({ panel: activePanelId }, "", `#${activePanelId}`);

    const onPopState = () => sceneActions.closePanel();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [activePanelId]);
}
