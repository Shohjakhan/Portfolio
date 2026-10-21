"use client";

import { AboutExperience } from "@/components/AboutExperience";
import { ArtGallery } from "@/components/ArtGallery";
import { BookshelfLibrary } from "@/components/BookshelfLibrary";
import { CinemaTickets } from "@/components/CinemaTickets";
import { ContactExperience } from "@/components/ContactExperience";
import { FandomCorner } from "@/components/FandomCorner";
import { JournalDiary } from "@/components/JournalDiary";
import { LaptopInterface } from "@/components/LaptopInterface";
import { MemoriesGallery } from "@/components/MemoriesGallery";
import { PanelErrorBoundary } from "@/components/NavigationLayer/PanelErrorBoundary";
import { getPanel } from "@/data/sceneObjects";
import { usePanelHistorySync } from "@/hooks/usePanelHistorySync";
import { Modal } from "@/primitives/Modal";
import { sceneActions, useSceneValue } from "@/state/sceneStore";

/**
 * Single modal host for every object's destination panel — objects only
 * ever call `sceneActions.openPanel`, and this is the one place that turns
 * that state into UI. Every panel has a real, finished experience: "about"
 * (`AboutExperience`), "work" (`LaptopInterface`), "writings"
 * (`BookshelfLibrary`), "art" (`ArtGallery`), "notes" (`JournalDiary`),
 * "memories" (`MemoriesGallery`), "movies" (`CinemaTickets`), "fandom"
 * (`FandomCorner`), "contact" (`ContactExperience`).
 */
export function NavigationLayer() {
  const activePanelId = useSceneValue((state) => state.activePanel);
  const panel = activePanelId ? getPanel(activePanelId) : undefined;
  usePanelHistorySync(activePanelId);

  const isAbout = activePanelId === "about";
  const isWork = activePanelId === "work";
  const isWritings = activePanelId === "writings";
  const isArt = activePanelId === "art";
  const isNotes = activePanelId === "notes";
  const isMemories = activePanelId === "memories";
  const isMovies = activePanelId === "movies";
  const isFandom = activePanelId === "fandom";
  const isContact = activePanelId === "contact";

  return (
    <Modal
      open={Boolean(panel)}
      onClose={sceneActions.closePanel}
      title={panel?.title ?? ""}
      subtitle={panel?.subtitle}
      variant={
        isWritings || isNotes || isContact
          ? "art"
          : isAbout || isMemories || isFandom
          ? "memory"
          : isMovies
            ? "cinema"
          : isWork
            ? "screen"
            : isArt
              ? "gallery"
              : "fade"
      }
      className={isWork || isArt || isMemories ? "max-w-6xl p-4 sm:p-6" : undefined}
    >
      <PanelErrorBoundary key={activePanelId ?? "none"} onClose={sceneActions.closePanel}>
        {isAbout ? (
          <AboutExperience onClose={sceneActions.closePanel} />
        ) : isWork ? (
          <LaptopInterface />
        ) : isWritings ? (
          <BookshelfLibrary onClose={sceneActions.closePanel} />
        ) : isArt ? (
          <ArtGallery onClose={sceneActions.closePanel} />
        ) : isNotes ? (
          <JournalDiary onClose={sceneActions.closePanel} />
        ) : isMemories ? (
          <MemoriesGallery onClose={sceneActions.closePanel} />
        ) : isMovies ? (
          <CinemaTickets onClose={sceneActions.closePanel} />
        ) : isFandom ? (
          <FandomCorner onClose={sceneActions.closePanel} />
        ) : isContact ? (
          <ContactExperience onClose={sceneActions.closePanel} />
        ) : null}
      </PanelErrorBoundary>
    </Modal>
  );
}
