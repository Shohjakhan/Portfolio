import { SectionHeader } from "@/components/Common/SectionHeader";
import { AchievementCard } from "@/components/Achievements/AchievementCard";
import { achievements } from "@/data/achievements";
import { sectionHeaders } from "@/data/sectionHeaders";

export function Achievements() {
  return (
    <section id="achievements" aria-labelledby="achievements-heading" className="bg-bg-alt py-24 sm:py-30 md:py-50">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 md:px-20">
        <SectionHeader {...sectionHeaders.achievements} headingId="achievements-heading" />

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
