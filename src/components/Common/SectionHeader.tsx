import { Reveal } from "@/components/Common/Reveal";
import type { SectionHeaderContent } from "@/data/sectionHeaders";

interface SectionHeaderProps extends SectionHeaderContent {
  headingId: string;
}

export function SectionHeader({ label, title, titleEmphasis, headingId }: SectionHeaderProps) {
  return (
    <Reveal className="mb-24 md:mb-32">
      <p className="mb-6 text-xs tracking-[0.1em] text-ink-3 uppercase">{label}</p>
      <h2
        id={headingId}
        className="font-serif text-[clamp(2.25rem,9vw,3rem)] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[clamp(2.75rem,5vw,4.5rem)]"
      >
        {title}
        <br />
        <em className="text-accent italic">{titleEmphasis}</em>
      </h2>
    </Reveal>
  );
}
