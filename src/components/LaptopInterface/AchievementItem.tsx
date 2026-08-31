import type { Achievement } from "@/types/content";

export function AchievementItem({ achievement }: { achievement: Achievement }) {
  const Icon = achievement.icon;

  return (
    <article className="flex gap-3 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--room-lamp-glow)]/15 text-[var(--room-lamp-glow)]">
        <Icon size={16} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[0.7rem] tracking-[0.06em] text-[var(--color-cream)]/45 uppercase">{achievement.year}</p>
        <h3 className="mt-0.5 text-sm leading-snug text-[var(--color-cream)]">{achievement.name}</h3>
        <p className="mt-1 text-xs text-[var(--color-cream)]/60">{achievement.context}</p>
      </div>
    </article>
  );
}
