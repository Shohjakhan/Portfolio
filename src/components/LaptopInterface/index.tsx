"use client";

import { useState } from "react";
import { AchievementItem } from "@/components/LaptopInterface/AchievementItem";
import { EventItem } from "@/components/LaptopInterface/EventItem";
import { ExperienceCard } from "@/components/LaptopInterface/ExperienceCard";
import { MenuBar } from "@/components/LaptopInterface/MenuBar";
import { ProjectCard } from "@/components/LaptopInterface/ProjectCard";
import { Window } from "@/components/LaptopInterface/Window";
import { achievements } from "@/data/achievements";
import { experience } from "@/data/experience";
import { speakingEvents } from "@/data/events";
import { laptopSections, type LaptopSectionId } from "@/data/laptopSections";
import { projects } from "@/data/projects";

const SECTION_TITLES: Record<LaptopSectionId, string> = {
  projects: "Projects",
  experience: "Experience",
  achievements: "Achievements",
  events: "Events",
};

/**
 * The Laptop → "My Work" experience — a miniature Mac-style desktop, not a
 * plain scrolling panel or an app-icon dashboard. `activeSection` is local
 * UI state (which folder, if any, is "open"); it's deliberately not
 * scene-store state — nothing outside this component needs to know which
 * laptop folder is open, and closing the whole panel (Modal) already
 * resets it on next mount.
 */
export function LaptopInterface() {
  const [activeSection, setActiveSection] = useState<LaptopSectionId | null>(null);
  const activeDefinition = activeSection ? laptopSections.find((section) => section.id === activeSection) : undefined;

  return (
    <div className="texture-desktop-wallpaper flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-white/10">
      <MenuBar />

      <div className="min-h-[60vh] p-5 sm:p-7">
        {activeSection && activeDefinition ? (
          <Window title={SECTION_TITLES[activeSection]} icon={activeDefinition.icon} onBack={() => setActiveSection(null)}>
            {activeSection === "projects" && (
              <div className="flex flex-col gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {activeSection === "experience" && (
              <div className="flex flex-col gap-6">
                {experience.map((item) => (
                  <ExperienceCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {activeSection === "achievements" && (
              <div className="flex flex-col gap-3">
                {achievements.map((achievement) => (
                  <AchievementItem key={achievement.id} achievement={achievement} />
                ))}
              </div>
            )}

            {activeSection === "events" && (
              <div className="flex flex-col gap-3">
                {speakingEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            )}
          </Window>
        ) : (
          <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6">
            {laptopSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className="group flex flex-col items-center gap-1.5 rounded-[var(--radius-sm)] bg-black/25 px-2 py-2.5 backdrop-blur-sm transition-colors duration-[var(--duration-fast)] hover:bg-black/40 focus-visible:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--room-lamp-glow)]"
              >
                {/* painted icon per folder (art-source/07-panels L2) */}
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention */}
                <img
                  src={`/assets/panels/laptop/icon-${section.id}.png`}
                  alt=""
                  aria-hidden
                  className="h-16 w-auto max-w-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.55)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-bounce-soft)] group-hover:scale-110 sm:h-20"
                />
                <span className="text-xs text-[var(--color-cream)]/90" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                  {section.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
