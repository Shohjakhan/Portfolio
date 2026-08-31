import { SectionHeader } from "@/components/Common/SectionHeader";
import { TimelineItem } from "@/components/Experience/TimelineItem";
import { experience } from "@/data/experience";
import { sectionHeaders } from "@/data/sectionHeaders";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-24 sm:py-30 md:py-50">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 md:px-20">
        <SectionHeader {...sectionHeaders.experience} headingId="experience-heading" />

        <div className="relative flex flex-col">
          <div aria-hidden className="absolute top-0 bottom-0 left-[132px] hidden w-px bg-border lg:block" />
          {experience.map((item, index) => (
            <TimelineItem key={item.id} item={item} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
