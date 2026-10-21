"use client";

import { Camera, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BackLink } from "@/components/shared/BackLink";
import { diaryLinks } from "@/data/journal";
import { SceneTransition } from "@/primitives/SceneTransition";
import type { DiaryLink } from "@/types/content";

interface JournalDiaryProps {
  onClose: () => void;
}

/** A painted diary page (art-source/07-panels J1), stretched behind the
 * content. The page has its own ruled lines, so no CSS ruling is drawn. */
const DIARY_PAGE_STYLE = {
  backgroundImage: "url(/assets/panels/journal/diary-page.jpg)",
  backgroundSize: "100% 100%",
  aspectRatio: "790 / 1120",
};

/** No brand glyphs in lucide-react (see ContactExperience) — generic marks instead. */
const STAMP_ICON: Record<string, LucideIcon> = { instagram: Camera, telegram: Send };

/** A painted postage stamp (J2) with a real icon behind its open centre — the
 * stamp art is transparent where the green was, so the icon shows through. */
function Stamp({ id, dim }: { id: string; dim?: boolean }) {
  const Icon = STAMP_ICON[id] ?? Send;
  return (
    <span aria-hidden className={`relative inline-block w-24 shrink-0 ${dim ? "opacity-45 grayscale-[0.4]" : ""}`} style={{ aspectRatio: "419 / 311" }}>
      <span
        className="absolute flex items-center justify-center bg-[var(--color-cream)] text-[var(--color-paper-ink)]/80"
        style={{ left: "15.5%", top: "19.3%", width: "68.7%", height: "61.1%" }}
      >
        <Icon size={26} strokeWidth={1.4} />
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention */}
      <img src="/assets/panels/journal/stamp.png" alt="" className="absolute inset-0 h-full w-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]" />
    </span>
  );
}

function DiaryLinkRow({ link }: { link: DiaryLink }) {
  if (!link.href) {
    return (
      <div className="flex items-center gap-4">
        <Stamp id={link.id} dim />
        <p className="font-hand-note text-3xl leading-none text-[var(--color-paper-ink)]/45">
          {link.label} <span className="align-middle text-sm italic">(not linked yet)</span>
        </p>
      </div>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 font-hand-note text-3xl leading-none text-[var(--color-paper-ink)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent)]"
    >
      <span className="transition-transform duration-[var(--duration-fast)] group-hover:-rotate-3 group-hover:scale-105">
        <Stamp id={link.id} />
      </span>
      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="underline decoration-wavy decoration-[var(--color-accent)]/40 underline-offset-8 group-hover:decoration-[var(--color-accent)]">
          {link.label}
        </span>
        <span className="text-lg text-[var(--color-accent)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5">↗</span>
        {link.value ? <span className="text-sm text-[var(--color-paper-ink)]/70">{link.value}</span> : null}
      </span>
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
      <div
        className="flex w-[min(92vw,calc(86vh*0.705))] flex-col justify-center gap-7 rounded-[4px] px-[11%] py-[9%] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        style={DIARY_PAGE_STYLE}
      >
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

        <BackLink onClick={onClose} className="self-end" />
      </div>
    </SceneTransition>
  );
}
