import { Reveal } from "@/components/Common/Reveal";
import type { Achievement } from "@/types/content";

interface AchievementCardProps {
  achievement: Achievement;
  delay: number;
}

export function AchievementCard({ achievement, delay }: AchievementCardProps) {
  const Icon = achievement.icon;

  return (
    <Reveal
      delay={delay}
      className="flex gap-6 bg-bg-alt px-8 py-12 transition-colors duration-150 hover:bg-accent/[0.03]"
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-accent">
        <Icon size={20} strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <p className="mb-1 text-[0.6875rem] tracking-[0.08em] text-ink-3 uppercase">{achievement.year}</p>
        <h3 className="mb-1 text-[0.9375rem] leading-[1.4] text-ink">{achievement.name}</h3>
        <p className="text-[0.8125rem] font-light text-ink-3">{achievement.context}</p>
      </div>
    </Reveal>
  );
}
