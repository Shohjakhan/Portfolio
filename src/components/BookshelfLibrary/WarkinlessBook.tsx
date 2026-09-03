"use client";

import { BookFrame } from "@/components/BookshelfLibrary/BookFrame";
import { BookReader } from "@/components/BookshelfLibrary/BookReader";
import { EmptyState } from "@/components/shared/EmptyState";
import { getLibraryBook } from "@/data/library";
import { WARKINLESS_SECTIONS, warkinless, type WarkinlessSectionId } from "@/data/warkinless";

const definition = getLibraryBook("warkinless")!;

interface WarkinlessBookProps {
  onBack: () => void;
}

function Prose({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-line font-serif text-[0.95rem] leading-relaxed text-[var(--color-paper-ink)]/85">{text}</p>
  );
}

/**
 * Renders one Warkinless section. Every branch here is empty right now —
 * `warkinless` in `data/warkinless.ts` has no lore, characters, or text
 * supplied yet, and per explicit instruction none is invented to fill
 * these in. Structure is real; content is not.
 */
function renderWarkinlessSection(sectionId: WarkinlessSectionId) {
  switch (sectionId) {
    case "introduction":
      return warkinless.introduction ? (
        <Prose text={warkinless.introduction} />
      ) : (
        <EmptyState message="The introduction hasn't been written yet — the first page of Ruining of Warkinless is still blank." />
      );

    case "world":
      return warkinless.world ? (
        <Prose text={warkinless.world} />
      ) : (
        <EmptyState message="The world and its lore haven't been laid out here yet." />
      );

    case "characters":
      return warkinless.characters.length === 0 ? (
        <EmptyState message="No characters have been introduced yet." />
      ) : (
        <div className="flex flex-col gap-6">
          {warkinless.characters.map((character) => (
            <article key={character.id} className="flex gap-4">
              {character.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- decorative, data-driven; matches the room's plain <img> convention
                <img
                  src={character.image.src}
                  alt={character.image.alt}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : null}
              <div>
                <h3 className="font-serif text-base text-[var(--color-paper-ink)]">{character.name}</h3>
                <p className="text-xs text-[var(--color-paper-ink)]/70">{character.role}</p>
                <p className="mt-2 font-serif text-sm leading-relaxed text-[var(--color-paper-ink)]/80">
                  {character.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      );

    case "excerpts":
      return warkinless.excerpts.length === 0 ? (
        <EmptyState message="No excerpts have been shared yet." />
      ) : (
        <div className="flex flex-col gap-8">
          {warkinless.excerpts.map((excerpt) => (
            <blockquote key={excerpt.id} className="border-l-2 border-[var(--color-accent)]/40 pl-4">
              <p className="font-hand-note text-lg text-[var(--color-paper-ink)]">{excerpt.title}</p>
              <p className="mt-2 whitespace-pre-line font-serif text-[0.9rem] leading-relaxed text-[var(--color-paper-ink)]/80">
                {excerpt.body}
              </p>
            </blockquote>
          ))}
        </div>
      );

    case "illustrations":
      return warkinless.illustrations.length === 0 ? (
        <EmptyState message="No illustrations yet — this page is reserved for them." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {warkinless.illustrations.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element -- decorative, data-driven; matches the room's plain <img> convention
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="aspect-square w-full rounded-[var(--radius-sm)] object-cover"
            />
          ))}
        </div>
      );

    case "updates":
      return warkinless.updates.length === 0 ? (
        <EmptyState message="No updates posted yet — check back as the story grows." />
      ) : (
        <ul className="flex flex-col gap-4">
          {warkinless.updates.map((update) => (
            <li key={update.id}>
              <p className="text-xs text-[var(--color-paper-ink)]/70">{update.date}</p>
              <p className="mt-1 font-serif text-sm leading-relaxed text-[var(--color-paper-ink)]/85">{update.note}</p>
            </li>
          ))}
        </ul>
      );
  }
}

export function WarkinlessBook({ onBack }: WarkinlessBookProps) {
  return (
    <BookFrame
      title={definition.title}
      subtitle={warkinless.tagline ?? definition.subtitle}
      icon={definition.icon}
      onBack={onBack}
      tilt={-1}
    >
      <BookReader sections={WARKINLESS_SECTIONS} renderSection={renderWarkinlessSection} />
    </BookFrame>
  );
}
