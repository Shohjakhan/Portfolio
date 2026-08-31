import type { LucideIcon } from "lucide-react";

export interface SiteInfo {
  name: string;
  role: string;
  email: string;
  copyrightYear: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  headlineEmphasis: string;
  subline: string;
  status: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface AboutFact {
  label: string;
  value: string;
}

export interface AboutContent {
  paragraphs: string[];
  facts: AboutFact[];
}

/**
 * Content for the Coffee → "About Me" room experience (see
 * `data/aboutExperience.ts` and `components/AboutExperience`) — a distinct
 * shape from `AboutContent` because this is a narrative "memory," not the
 * linear page's paragraphs+facts block, and it has fields (personal
 * statement, profile image) with no source yet. `null` means "not written
 * yet," not "empty" — the component shows a placeholder for those, never a
 * blank gap.
 */
export interface AboutExperienceContent {
  name: string;
  role: string;
  whoIAm: string;
  whatIDo: string;
  whatICareAbout: string;
  creativeInterests: string[];
  technicalInterests: string[];
  personalStatement: string | null;
  profileImage: { src: string; alt: string } | null;
  facts: AboutFact[];
  email: string;
  socialLinks: SocialLink[];
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Project {
  id: string;
  year: string;
  tag: string;
  name: string;
  description: string;
  stack: string[];
  href: string;
  /** Optional, plural on purpose — the plan is several photos per project
   * (screenshots, event photos, ...) once they exist. Unset everywhere
   * right now; `ProjectCard` only renders a gallery when this is
   * non-empty, never a placeholder image. */
  screenshots?: GalleryImage[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  /** Same "several photos, none yet" contract as `Project.screenshots`. */
  images?: GalleryImage[];
}

export interface Achievement {
  id: string;
  icon: LucideIcon;
  year: string;
  name: string;
  context: string;
}

export interface SpeakingEvent {
  id: string;
  month: string;
  day: string;
  year: string;
  name: string;
  role: string;
  location: string;
  href: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  subline: string;
  emailCta: { label: string; href: string };
  resumeCta: { label: string; href: string };
}
