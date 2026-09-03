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
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-hand-note text-2xl leading-none text-[var(--color-paper-ink)]">You picked up.</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-paper-ink)]/70">
          Say hello by email, or find me on one of these — happy to hear from you.
        </p>
      </div>

      <a
        href={`mailto:${contactEmail}`}
        className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-[var(--color-accent)]/10 px-5 py-4 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-accent)]/16"
      >
        <span className="flex items-center gap-3">
          <Mail size={20} strokeWidth={1.5} className="text-[var(--color-accent)]" aria-hidden />
          <span className="flex flex-col">
            <span className="text-sm font-medium text-[var(--color-paper-ink)]">Send an email</span>
            <span className="text-xs text-[var(--color-paper-ink)]/70">{contactEmail}</span>
          </span>
        </span>
        <span className="shrink-0 text-sm text-[var(--color-accent)]">Say Hello ↗</span>
      </a>

      <ul className="flex flex-col">
        {contactLinks.map((link) => (
          <ContactRow key={link.id} link={link} />
        ))}
      </ul>

      <BackLink onClick={onClose} />
    </div>
  );
}
