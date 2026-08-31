import { aboutContent } from "@/data/about";
import { siteInfo, socialLinks } from "@/data/site";
import type { AboutExperienceContent } from "@/types/content";

/**
 * Content for the Coffee → "About Me" room experience. Edit *this file*,
 * not the `AboutExperience` component, to change what it says.
 *
 * Reuses real content from `data/about.ts`/`data/site.ts` everywhere it
 * exists — nothing here is invented. Two fields (`personalStatement`,
 * `profileImage`) have no source anywhere on the site yet and are left
 * `null` on purpose rather than filled with a fabricated line/photo; the
 * component renders an honest, clearly-marked placeholder for either.
 */
export const aboutExperience: AboutExperienceContent = {
  name: siteInfo.name,
  role: siteInfo.role,
  whoIAm: aboutContent.paragraphs[0],
  whatIDo: aboutContent.paragraphs[1],
  whatICareAbout: aboutContent.paragraphs[2],

  // Not new facts — gathered from the room's own bookshelf/easel/movie-poster
  // descriptions (src/data/sceneObjects.ts: "My writings, fantasy novel...",
  // "Paintings, sketches, digital art & photography", "Favorite movies...").
  creativeInterests: ["Fantasy writing", "Painting & sketching", "Film"],

  // Grounded in aboutContent.facts' "Focused on" line, plus the hackathon/
  // rocket-avionics work named in aboutContent.paragraphs[2].
  technicalInterests: ["AI", "Mobile development", "Embedded systems", "Entrepreneurship"],

  // No dedicated personal statement exists anywhere on the site yet.
  personalStatement: null,

  // Hero/Portrait.tsx is itself still an icon placeholder — no real photo exists yet.
  profileImage: null,

  facts: aboutContent.facts,
  email: siteInfo.email,
  socialLinks,
};
