import { siteInfo, socialLinks } from "@/data/site";
import type { ContactLink } from "@/types/content";

/**
 * Content for the Phone → "Contact" room experience (see
 * `components/ContactExperience`). Real values only — nothing here is
 * invented. `email` comes straight from `data/site.ts`. GitHub/LinkedIn
 * are sourced from the shared `socialLinks` array rather than re-typed by
 * hand, so filling in the real URL there (currently `"#"`, not set yet)
 * automatically shows up here too, no second edit needed; still `"#"`
 * means "not linked yet" and gets an honest placeholder, not a dead link
 * (see `ContactLink.href`'s doc comment). X/Twitter is deliberately not
 * carried over from `socialLinks` — asked not to be included here.
 * The two Telegram entries (personal + the "My World, My People" blog
 * channel) are real handles the user gave directly.
 */
export const contactEmail = siteInfo.email;

const github = socialLinks.find((link) => link.label === "GitHub");
const linkedin = socialLinks.find((link) => link.label === "LinkedIn");

function realHref(href: string | undefined): string | undefined {
  return href && href !== "#" ? href : undefined;
}

export const contactLinks: ContactLink[] = [
  {
    id: "telegram",
    kind: "telegram",
    label: "Telegram",
    value: "@Black_swan_0808",
    href: "https://t.me/Black_swan_0808",
  },
  {
    id: "telegram-blog",
    kind: "telegram",
    label: "Telegram — My World, My People (blog)",
    value: "@myworld_mypeople",
    href: "https://t.me/myworld_mypeople",
  },
  {
    id: "github",
    kind: "github",
    label: "GitHub",
    href: realHref(github?.href),
  },
  {
    id: "linkedin",
    kind: "linkedin",
    label: "LinkedIn",
    href: realHref(linkedin?.href),
  },
];
