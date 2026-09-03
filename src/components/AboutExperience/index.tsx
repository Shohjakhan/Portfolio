import { UserRound } from "lucide-react";
import { BackLink } from "@/components/shared/BackLink";
import { aboutExperience } from "@/data/aboutExperience";

interface AboutExperienceProps {
  onClose: () => void;
}

/** A small handwritten margin note above a passage — "who I am", not a loud
 * section header, per the "opening a memory" brief rather than a résumé.
 * `--font-hand-note` (Caveat), not `--font-hand` (Alex Brush) — the latter
 * read too delicate for text repeated this many times on one screen. */
function SectionTag({ children }: { children: string }) {
  return <p className="font-hand-note text-lg leading-none text-[var(--color-accent)]">{children}</p>;
}

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[var(--color-paper-ink)]/20 bg-[var(--color-cream)]/60 px-3 py-1 text-xs text-[var(--color-paper-ink)]/80">
      {children}
    </span>
  );
}

/**
 * The Coffee → "About Me" experience — a flowing personal narrative, not a
 * résumé card grid. Content lives entirely in `data/aboutExperience.ts`;
 * this component only lays it out. Rendered by NavigationLayer as the
 * "about" panel's body, inside Modal's `variant="memory"`.
 */
export function AboutExperience({ onClose }: AboutExperienceProps) {
  const {
    name,
    role,
    whoIAm,
    whatIDo,
    whatICareAbout,
    creativeInterests,
    technicalInterests,
    personalStatement,
    profileImage,
    facts,
    email,
    socialLinks,
  } = aboutExperience;

  const basedIn = facts.find((fact) => fact.label === "Based in")?.value;
  const languages = facts.find((fact) => fact.label === "Languages")?.value;
  const education = facts.find((fact) => fact.label === "Education")?.value;

  return (
    <div className="flex flex-col gap-8">
      {/* byline — a signature at the top of a letter, not a hero photo */}
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-paper-ink)]/15 bg-[var(--color-cream)] shadow-[var(--shadow-warm-sm)]"
        >
          {profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- decorative, data-driven; matches the rest of the room's plain <img> convention
            <img src={profileImage.src} alt={profileImage.alt} className="h-full w-full object-cover" />
          ) : (
            <UserRound size={26} strokeWidth={1.5} className="text-[var(--color-paper-ink)]/30" />
          )}
        </div>
        <div>
          <p className="font-serif text-lg text-[var(--color-paper-ink)]">{name}</p>
          <p className="text-sm text-[var(--color-paper-ink)]/70">{role}</p>
        </div>
      </div>

      <div className="h-px bg-[var(--color-paper-ink)]/12" />

      <div className="flex flex-col gap-6">
        <div>
          <SectionTag>who I am</SectionTag>
          <p className="mt-1.5 font-serif text-[0.95rem] leading-relaxed text-[var(--color-paper-ink)]/85">{whoIAm}</p>
        </div>

        <div>
          <SectionTag>what I study &amp; do</SectionTag>
          <p className="mt-1.5 font-serif text-[0.95rem] leading-relaxed text-[var(--color-paper-ink)]/85">{whatIDo}</p>
          {education ? <p className="mt-1.5 text-xs text-[var(--color-paper-ink)]/70">{education}</p> : null}
        </div>

        <div>
          <SectionTag>what I care about</SectionTag>
          <p className="mt-1.5 font-serif text-[0.95rem] leading-relaxed text-[var(--color-paper-ink)]/85">{whatICareAbout}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <SectionTag>creative interests</SectionTag>
          <div className="mt-2 flex flex-wrap gap-2">
            {creativeInterests.map((interest) => (
              <Pill key={interest}>{interest}</Pill>
            ))}
          </div>
        </div>
        <div>
          <SectionTag>technical interests</SectionTag>
          <div className="mt-2 flex flex-wrap gap-2">
            {technicalInterests.map((interest) => (
              <Pill key={interest}>{interest}</Pill>
            ))}
          </div>
        </div>
      </div>

      {personalStatement ? (
        <blockquote className="border-l-2 border-[var(--color-accent)]/40 pl-4">
          <p className="font-hand-note text-2xl leading-snug text-[var(--color-paper-ink)]">{personalStatement}</p>
        </blockquote>
      ) : (
        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-paper-ink)]/25 px-4 py-3">
          <p className="font-serif text-sm italic text-[var(--color-paper-ink)]/70">
            A short personal statement will live here — a line or two, in my own words.
          </p>
        </div>
      )}

      {basedIn || languages ? (
        <p className="text-xs text-[var(--color-paper-ink)]/70 italic">
          {[basedIn, languages].filter(Boolean).join(" · ")}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--color-paper-ink)]/12 pt-6">
        <a
          href={`mailto:${email}`}
          className="text-sm font-medium text-[var(--color-accent)] underline decoration-[var(--color-accent)]/30 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent-hover)]"
        >
          Say hello ↗
        </a>
        {socialLinks.map((link) =>
          link.href === "#" ? (
            <span key={link.label} className="text-sm text-[var(--color-paper-ink)]/35">
              {link.label} <span className="text-[0.65rem] italic">(coming soon)</span>
            </span>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--color-paper-ink)]/70 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent)] hover:underline"
            >
              {link.label}
            </a>
          ),
        )}
      </div>

      <BackLink onClick={onClose} />
    </div>
  );
}
