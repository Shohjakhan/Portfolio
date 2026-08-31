import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Common/Reveal";
import type { SpeakingEvent } from "@/types/content";

interface EventItemProps {
  event: SpeakingEvent;
  delay: number;
}

export function EventItem({ event, delay }: EventItemProps) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className="group grid grid-cols-[60px_1fr_36px] items-center gap-6 border-t border-border py-12 last:border-b md:grid-cols-[80px_1fr_40px] md:gap-16"
    >
      <div className="flex flex-col items-start gap-px">
        <span className="text-[0.6875rem] tracking-[0.1em] text-ink-3 uppercase">{event.month}</span>
        <span className="font-serif text-2xl leading-none text-ink">{event.day}</span>
        <span className="text-[0.6875rem] text-ink-3">{event.year}</span>
      </div>

      <div>
        <h3 className="mb-1 font-serif text-[1.1875rem] tracking-[-0.01em] text-ink">{event.name}</h3>
        <p className="mb-1 text-sm font-light text-ink-2">{event.role}</p>
        <p className="text-[0.8125rem] font-light text-ink-3">{event.location}</p>
      </div>

      <a
        href={event.href}
        aria-label={`View ${event.name}`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-3 transition-all duration-150 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:text-accent"
      >
        <ArrowUpRight size={16} strokeWidth={1.5} />
      </a>
    </Reveal>
  );
}
