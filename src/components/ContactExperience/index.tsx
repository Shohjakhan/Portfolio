"use client";

import { Briefcase, Code2, Mail, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BackLink } from "@/components/shared/BackLink";
import { contactEmail, contactLinks } from "@/data/contactExperience";
import type { ContactLink, ContactLinkKind } from "@/types/content";

interface ContactExperienceProps {
  onClose: () => void;
}

// lucide-react dropped brand/logo icons — Code2/Briefcase stand in for
// GitHub/LinkedIn as generic "code" and "professional" marks instead.
const KIND_ICON: Record<ContactLinkKind, LucideIcon> = {
  email: Mail,
  github: Code2,
  linkedin: Briefcase,
  telegram: Send,
  other: Mail,
};

function ContactRow({ link }: { link: ContactLink }) {
  const Icon = KIND_ICON[link.kind];
  return (
    <li className="flex items-center gap-3 border-b border-[var(--color-paper-ink)]/10 py-3 last:border-none">
      <Icon size={18} strokeWidth={1.5} className="shrink-0 text-[var(--color-paper-ink)]/45" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium text-[var(--color-paper-ink)]">{link.label}</span>
        {link.value ? <span className="truncate text-xs text-[var(--color-paper-ink)]/70">{link.value}</span> : null}
      </div>
      {link.href ? (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm text-[var(--color-accent)] underline decoration-[var(--color-accent)]/30 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent-hover)]"
        >
          Open ↗
        </a>
      ) : (
        <span className="shrink-0 text-xs text-[var(--color-paper-ink)]/35 italic">not linked yet</span>
      )}
    </li>
  );
}

/**
 * The Phone → "Contact" room experience — an address-book page, not a
 * corporate "get in touch" form: a real `mailto:` as the one prominent
 * action (picking up the phone to actually say something), then a plain
 * list of the other real channels underneath. Every link here is either
 * genuinely real (`data/contactExperience.ts`, sourced from
 * `data/site.ts`) or an honest "not linked yet" line — never a fabricated
 * handle or a dead `href="#"`.
 */
export function ContactExperience({ onClose }: ContactExperienceProps) {
  return (
    <div className="address-book w-[min(94vw,1100px)]">
      <div className="address-book-pages">
        <div className="flex min-h-0 flex-col gap-4">
          <div>
            <p className="font-hand-note text-2xl leading-none text-[var(--color-paper-ink)]">You picked up.</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-paper-ink)]/75">
              Say hello by email, or find me on one of these — happy to hear from you.
            </p>
          </div>

          {/* the one prominent action: a sealed letter (art-source/07-panels K2) */}
          <a
            href={`mailto:${contactEmail}`}
            className="group relative flex items-center gap-3 self-start rounded-[var(--radius-md)] py-1 pr-2 transition-transform duration-[var(--duration-fast)] hover:-translate-y-0.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative, matches the room's plain <img> convention */}
            <img
              src="/assets/panels/contact/envelope.png"
              alt=""
              aria-hidden
              className="w-24 shrink-0 -rotate-3 drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-bounce-soft)] group-hover:rotate-0 group-hover:scale-105"
            />
            <span className="flex min-w-0 flex-col">
              <span className="font-hand-note text-2xl leading-none text-[var(--color-paper-ink)]">Send an email</span>
              <span className="mt-1 break-all text-[0.7rem] leading-tight text-[var(--color-paper-ink)]/75">{contactEmail}</span>
              <span className="mt-1 text-sm text-[var(--color-accent)]">Say Hello ↗</span>
            </span>
          </a>

          <BackLink onClick={onClose} className="mt-auto hidden sm:block" />
        </div>

        <ul className="flex min-h-0 flex-col overflow-y-auto">
          {contactLinks.map((link) => (
            <ContactRow key={link.id} link={link} />
          ))}
        </ul>

        {/* phones: the book is a plain column, so the way out goes last */}
        <BackLink onClick={onClose} className="sm:hidden" />
      </div>
    </div>
  );
}
