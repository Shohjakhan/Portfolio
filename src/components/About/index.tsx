import { Reveal } from "@/components/Common/Reveal";
import { SectionHeader } from "@/components/Common/SectionHeader";
import { aboutContent } from "@/data/about";
import { socialLinks } from "@/data/site";
import { sectionHeaders } from "@/data/sectionHeaders";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 sm:py-30 md:py-50">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 md:px-20">
        <SectionHeader {...sectionHeaders.about} headingId="about-heading" />

        <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-[1fr_0.45fr] md:gap-32">
          <Reveal delay={100}>
            {aboutContent.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-6 max-w-[580px] text-[1.0625rem] leading-[1.75] font-light text-ink-2 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={200} className="border-t border-border pt-8">
            {aboutContent.facts.map((fact) => (
              <div key={fact.label} className="border-b border-border py-6">
                <p className="mb-1 text-[0.6875rem] tracking-[0.08em] text-ink-3 uppercase">{fact.label}</p>
                <p className="text-[0.9375rem] font-light text-ink-2">{fact.value}</p>
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-8">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-1 text-sm tracking-[0.01em] text-ink-2 transition-colors duration-150 hover:text-accent"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
