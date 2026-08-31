import { SectionHeader } from "@/components/Common/SectionHeader";
import { EventItem } from "@/components/Speaking/EventItem";
import { speakingEvents } from "@/data/events";
import { sectionHeaders } from "@/data/sectionHeaders";

export function Speaking() {
  return (
    <section id="events" aria-labelledby="events-heading" className="py-24 sm:py-30 md:py-50">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 md:px-20">
        <SectionHeader {...sectionHeaders.events} headingId="events-heading" />

        <div className="flex flex-col">
          {speakingEvents.map((event, index) => (
            <EventItem key={event.id} event={event} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
