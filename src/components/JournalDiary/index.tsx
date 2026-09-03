"use client";

import { BackLink } from "@/components/shared/BackLink";
import { diaryLinks } from "@/data/journal";
import { SceneTransition } from "@/primitives/SceneTransition";
import type { DiaryLink } from "@/types/content";

interface JournalDiaryProps {
  onClose: () => void;
}

/** Faint ruled lines under the handwritten text — a notebook page, not a
 * plain panel. Kept as a scoped inline gradient rather than a new
 * `.texture-*` class since nothing else in the room needs ruled paper. */
const RULED_PAGE_STYLE = {
  backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(28, 19, 12, 0.09) 35px)",
  backgroundPosition: "0 4px",
};

function DiaryLinkRow({ link }: { link: DiaryLink }) {
  if (!link.href) {
    return (
      <p className="font-hand-note text-3xl leading-none text-[var(--color-paper-ink)]/35">
        {link.label} <span className="align-middle text-sm italic">(not linked yet)</span>
      </p>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-baseline gap-2 font-hand-note text-3xl leading-none text-[var(--color-paper-ink)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent)]"
    >
      <span className="underline decoration-wavy decoration-[var(--color-accent)]/40 underline-offset-8 group-hover:decoration-[var(--color-accent)]">
        {link.label}
      </span>
      <span className="text-lg text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5">
        ↗
      </span>
      {link.value ? <span className="ml-1 text-sm text-[var(--color-paper-ink)]/70">{link.value}</span> : null}
    </a>
  );
}

/**
 * The Journal → "Find me elsewhere" room experience. Deliberately not a
 * blog and not an address-book list (see `components/ContactExperience`
 * for that pattern) — this page's only job is to hand a visitor off to
 * real, shorter-form social spaces. Content lives entirely in
 * `data/journal.ts`'s small `diaryLinks` array; add/remove a real link
 * there and this component picks it up unchanged. Rendered by
 * NavigationLayer as the "notes" panel's body, inside Modal's
 * `variant="memory"`.
 */
export function JournalDiary({ onClose }: JournalDiaryProps) {
  return (
    <SceneTransition transitionKey="journal-diary" variant="page-turn">
      <div className="flex flex-col gap-8 rounded-[var(--radius-md)] px-1 py-2" style={RULED_PAGE_STYLE}>
        <div>
          <p className="font-hand text-4xl leading-tight text-[var(--color-paper-ink)] sm:text-5xl">
            These thoughts live elsewhere.
          </p>
          <p className="mt-4 max-w-md font-serif text-[0.95rem] leading-relaxed text-[var(--color-paper-ink)]/70">
            I don&rsquo;t keep a blog in this room — for shorter, more frequent thoughts, find me here instead.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {diaryLinks.map((link) => (
            <DiaryLinkRow key={link.id} link={link} />
          ))}
        </div>

        <BackLink onClick={onClose} />
      </div>
    </SceneTransition>
  );
}
