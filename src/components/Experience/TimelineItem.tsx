import { Reveal } from "@/components/Common/Reveal";
import type { ExperienceItem } from "@/types/content";

interface TimelineItemProps {
  item: ExperienceItem;
  delay: number;
}

export function TimelineItem({ item, delay }: TimelineItemProps) {
  return (
    <Reveal
      delay={delay}
      className="group relative grid grid-cols-1 gap-3 border-t border-border py-16 last:border-b lg:grid-cols-[132px_1fr] lg:gap-16"
    >
      <span
        aria-hidden
        className="absolute top-[74px] left-[126px] hidden h-[13px] w-[13px] rounded-full border-[1.5px] border-border bg-bg transition-colors duration-150 group-hover:border-accent group-hover:bg-accent-light lg:block"
      />

      <div className="pb-2 lg:pb-0">
        <span className="text-[0.8125rem] tracking-[0.02em] whitespace-nowrap text-ink-3">{item.period}</span>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-baseline gap-4">
          <h3 className="font-serif text-xl tracking-[-0.01em] text-ink">{item.role}</h3>
          <span className="text-sm text-accent">{item.company}</span>
        </div>
        <p className="mb-4 max-w-[600px] text-[0.9375rem] leading-[1.7] font-light text-ink-2">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border px-[7px] py-[3px] text-[0.6875rem] tracking-[0.08em] text-ink-3 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
