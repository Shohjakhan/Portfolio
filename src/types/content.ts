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

/**
 * One line in the Phone → "Contact" room experience's address-book list
 * (see `data/contactExperience.ts` and `components/ContactExperience`).
 * `href` is optional on purpose — a channel can be real (worth listing)
 * before a link for it exists; omitting `href` renders an honest
 * "not linked yet" line instead of a dead `href="#"`, same convention
 * `AboutExperience` already uses for `SocialLink`s pointing at `"#"`.
 */
export type ContactLinkKind = "email" | "github" | "linkedin" | "telegram" | "other";

export interface ContactLink {
  id: string;
  kind: ContactLinkKind;
  label: string;
  /** The handle/address shown on the line, e.g. "@username" — omitted
   * when the label alone already says everything there is to show (e.g.
   * a bare "GitHub"/"LinkedIn" with no specific handle on file yet). */
  value?: string;
  href?: string;
}

/**
 * One outbound link in the Journal → "Find me elsewhere" diary page (see
 * `data/journal.ts` and `components/JournalDiary`). The journal exists to
 * redirect visitors to real social spaces, not to host content of its own
 * — `href` omitted means "not linked yet," rendered as an honest disabled
 * line, same convention as `ContactLink.href`, never a fabricated handle.
 */
export interface DiaryLink {
  id: string;
  label: string;
  value?: string;
  href?: string;
}

/**
 * Content for the Bookshelf → "My Library" room experience (see
 * `data/writings.ts`, `data/warkinless.ts`, `data/booksRead.ts` and
 * `components/BookshelfLibrary`). Three shapes, one per book on the shelf —
 * kept separate rather than one blob since each has a genuinely different
 * structure (a flat tagged list / a lore document / a reading list), not
 * three variations on the same fields.
 */
export type WritingCategory = "poem" | "essay" | "paragraph" | "personal" | "thought";

export interface WritingEntry {
  id: string;
  category: WritingCategory;
  title: string;
  date?: string;
  body: string;
}

export interface WarkinlessCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: GalleryImage;
}

export interface WarkinlessExcerpt {
  id: string;
  title: string;
  body: string;
}

export interface WarkinlessUpdate {
  id: string;
  date: string;
  note: string;
}

/**
 * `null`/`[]` mean "not written yet," the same contract as
 * `AboutExperienceContent.personalStatement` — never fabricate lore to
 * fill these in (see CLAUDE.md's "do not invent" precedent from the
 * laptop's Research folder). `WarkinlessBook` renders an honest empty
 * state per section instead.
 */
export interface WarkinlessContent {
  tagline: string | null;
  introduction: string | null;
  world: string | null;
  characters: WarkinlessCharacter[];
  excerpts: WarkinlessExcerpt[];
  illustrations: GalleryImage[];
  updates: WarkinlessUpdate[];
}

export interface BookReadEntry {
  id: string;
  title: string;
  author: string;
  note?: string;
  cover?: GalleryImage;
}

/**
 * Content for the Easel → "My Art" room experience (see `data/gallery.ts`
 * and `components/ArtGallery`) — a scattered salon-style wall hang, not
 * sections or a grid. One shape covers every medium — a painting and a
 * photograph share the same fields — since every piece just hangs on the
 * same wall regardless of medium; `medium` only drives the small label
 * shown when a piece is opened (see `MEDIUM_LABELS`).
 */
export type ArtworkMedium = "painting" | "sketch" | "digital" | "photography";

export interface Artwork {
  id: string;
  title: string;
  medium: ArtworkMedium;
  image: GalleryImage;
  year?: string;
  /** What the piece is / the story behind it — curatorial, not the artist's own voice (see `notes`). */
  description?: string;
  /** The artist's own words about the piece — optional, separate from `description` on purpose (a plaque vs. a signature). */
  notes?: string;
  /** e.g. "Oil on canvas, 40×50cm" — optional, only shown when present. */
  materials?: string;
}

/**
 * Content for the Photo Frames → "Memories" room experience (see
 * `data/memories.ts` and `components/MemoriesGallery`) — the frames on the
 * wall open a shelf of labeled reels (MUN, Graduation, ...), and each reel
 * opens onto its own filmstrip of individual frames. A reel can exist
 * (a real event/place worth having a shelf slot) before any photo or video
 * has actually been added to it — `items` stays `[]` until real media is
 * supplied, never filled with invented photos.
 */
export interface MemoryMediaItem {
  id: string;
  kind: "photo" | "video";
  image: GalleryImage;
  caption?: string;
}

export interface MemoryReel {
  id: string;
  title: string;
  /** e.g. "2024" or "Spring 2023" — optional, shown on the reel label. */
  period?: string;
  description?: string;
  items: MemoryMediaItem[];
}

/**
 * Content for the Movie Poster → "Cinema" room experience (see
 * `data/movies.ts` and `components/CinemaTickets`) — one "ticket stub" per
 * favorite film. `poster` is optional since a ticket reads fine on title
 * alone; add it once a real poster image exists.
 */
export interface Movie {
  id: string;
  title: string;
  year?: string;
  /** Why it's a favorite — one line, the ticket's own "review". */
  note?: string;
  poster?: GalleryImage;
}

/**
 * Content for the Plushie → "Anime & Manga" room experience (see
 * `data/anime.ts` and `components/FandomCorner`) — a charm hanging from
 * the rack per title/character.
 */
export interface AnimeEntry {
  id: string;
  title: string;
  note?: string;
  cover?: GalleryImage;
}
