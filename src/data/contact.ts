import type { ContactContent } from "@/types/content";
import { siteInfo } from "@/data/site";

export const contactContent: ContactContent = {
  eyebrow: "06 — Contact",
  title: "Let's build",
  titleEmphasis: "something together.",
  subline:
    "Whether you have a project in mind, an idea worth exploring, or just want to say hello — my inbox is always open.",
  emailCta: { label: "Say Hello ↗", href: `mailto:${siteInfo.email}` },
  resumeCta: { label: "Download CV", href: "/cv/Shohjahon_Abduhamidov_CV.pdf" },
};
