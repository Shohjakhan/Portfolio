import { ExternalLink } from "lucide-react";
import type { SpeakingEvent } from "@/types/content";

export function EventItem({ event }: { event: SpeakingEvent }) {
  const hasLink = Boolean(event.href) && event.href !== "#";

  return (
    <article className="flex items-center gap-4 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex w-14 shrink-0 flex-col items-center rounded-[var(--radius-sm)] bg-black/20 py-1.5">
        <span className="text-[0.6rem] tracking-[0.08em] text-[var(--color-cream)]/50 uppercase">{event.month}</span>
        <span className="font-serif text-lg leading-tight text-[var(--color-cream)]">{event.day}</span>
        <span className="text-[0.6rem] text-[var(--color-cream)]/50">{event.year}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-base text-[var(--color-cream)]">{event.name}</h3>
        <p className="text-xs text-[var(--color-cream)]/65">{event.role}</p>
        <p className="text-xs text-[var(--color-cream)]/45">{event.location}</p>
      </div>
      {hasLink ? (
        <a
          href={event.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${event.name}`}
          className="shrink-0 rounded-full p-1.5 text-[var(--color-cream)]/50 transition-colors duration-[var(--duration-fast)] hover:bg-white/10 hover:text-[var(--color-cream)]"
        >
          <ExternalLink size={14} strokeWidth={1.75} />
        </a>
      ) : null}
    </article>
  );
}
