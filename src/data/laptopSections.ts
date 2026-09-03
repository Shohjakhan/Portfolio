import { Briefcase, CalendarDays, FolderKanban, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LaptopSectionId = "projects" | "experience" | "achievements" | "events";

export interface LaptopSectionDefinition {
  id: LaptopSectionId;
  label: string;
  icon: LucideIcon;
}

/**
 * The laptop desktop's folder icons, in display order — CLAUDE.md §2's
 * "Laptop → Projects/Experience/Achievements/Events". Research was dropped
 * (no real content existed for it anywhere on the site) and Resume was
 * removed too (not needed here). One entry per `LaptopInterface` section
 * component.
 */
export const laptopSections: LaptopSectionDefinition[] = [
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "events", label: "Events", icon: CalendarDays },
];
