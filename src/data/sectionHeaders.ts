export interface SectionHeaderContent {
  label: string;
  title: string;
  titleEmphasis: string;
}

export const sectionHeaders = {
  about: {
    label: "01 — About",
    title: "A little about",
    titleEmphasis: "who I am.",
  },
  projects: {
    label: "02 — Projects",
    title: "Selected",
    titleEmphasis: "work.",
  },
  experience: {
    label: "03 — Experience",
    title: "Where I've",
    titleEmphasis: "contributed.",
  },
  achievements: {
    label: "04 — Achievements",
    title: "Recognition &",
    titleEmphasis: "milestones.",
  },
  events: {
    label: "05 — Events",
    title: "Conferences &",
    titleEmphasis: "leadership.",
  },
} as const satisfies Record<string, SectionHeaderContent>;
