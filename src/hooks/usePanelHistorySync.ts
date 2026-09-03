"use client";

import { useEffect, useRef } from "react";
import { getPanel } from "@/data/sceneObjects";
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
 *
 * Also restores from `location.hash` once, on mount — a direct link/bookmark
 * to `#contact`, or a refresh while a panel was open, opens that same panel
 * instead of silently dropping back to the bare room with a now-inert hash
 * in the address bar. `getPanel` doubles as validation: an unrecognized or
 * missing hash just leaves the room closed, never a crash.
 */
export function usePanelHistorySync(activePanelId: PanelId | null) {
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const hash = window.location.hash.slice(1) as PanelId;
    if (hash && getPanel(hash)) sceneActions.openPanel(hash);
  }, []);

  useEffect(() => {
    if (!activePanelId) return;

    window.history.pushState({ panel: activePanelId }, "", `#${activePanelId}`);

    const onPopState = () => sceneActions.closePanel();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [activePanelId]);
}
