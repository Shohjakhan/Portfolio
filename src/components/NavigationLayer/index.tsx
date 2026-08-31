"use client";

import { AboutExperience } from "@/components/AboutExperience";
import { LaptopInterface } from "@/components/LaptopInterface";
import { getPanel } from "@/data/sceneObjects";
import { usePanelHistorySync } from "@/hooks/usePanelHistorySync";
import { Modal } from "@/primitives/Modal";
import { sceneActions, useSceneValue } from "@/state/sceneStore";

/**
 * Single modal host for every object's destination panel — objects only
 * ever call `sceneActions.openPanel`, and this is the one place that turns
 * that state into UI. Most panel bodies are still placeholders until each
 * existing section's content is migrated in (see
 * docs/adding-interactive-objects.md); "about" (`AboutExperience`) and
 * "work" (`LaptopInterface`) are the first two with a real, finished
 * experience — a template for migrating the rest, not special cases to
 * keep growing here.
 */
export function NavigationLayer() {
  const activePanelId = useSceneValue((state) => state.activePanel);
  const panel = activePanelId ? getPanel(activePanelId) : undefined;
  usePanelHistorySync(activePanelId);

  const isAbout = activePanelId === "about";
  const isWork = activePanelId === "work";

  return (
    <Modal
      open={Boolean(panel)}
      onClose={sceneActions.closePanel}
      title={panel?.title ?? ""}
      subtitle={panel?.subtitle}
      variant={isAbout ? "memory" : isWork ? "screen" : "fade"}
      className={isWork ? "max-w-6xl p-4 sm:p-6" : undefined}
    >
      {isAbout ? (
        <AboutExperience onClose={sceneActions.closePanel} />
      ) : isWork ? (
        <LaptopInterface />
      ) : (
        <p className="text-sm leading-relaxed text-[var(--color-paper-ink)]/80">
          This panel will hold the {panel?.title.toLowerCase()} content once it moves in from the existing
          section components.
        </p>
      )}
    </Modal>
  );
}
