import { Gallery } from "@/components/LaptopInterface/Gallery";
import type { ExperienceItem } from "@/types/content";

/**
 * Named "ExperienceCard", not "ExperienceItem" — the content type is
 * already called `ExperienceItem` (`types/content.ts`), so a component of
 * the same name would collide in any file importing both. Same role as
 * `ProjectCard`/`AchievementItem`/`EventItem` otherwise.
 */
export function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <article className="border-l-2 border-white/10 pl-4">
      <p className="text-[0.7rem] tracking-[0.06em] text-[var(--color-cream)]/70 uppercase">{item.period}</p>
      <h3 className="mt-0.5 font-serif text-lg text-[var(--color-cream)]">{item.role}</h3>
      <p className="text-sm text-[var(--room-lamp-glow)]/85">{item.company}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-cream)]/75">{item.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded border border-white/10 px-2 py-0.5 text-[0.7rem] text-[var(--color-cream)]/70">
            {tag}
          </span>
        ))}
      </div>
      <Gallery images={item.images} />
    </article>
  );
}
