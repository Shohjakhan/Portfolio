import { Reveal } from "@/components/Common/Reveal";
import { Button } from "@/components/Common/Button";
import { contactContent } from "@/data/contact";
import { socialLinks } from "@/data/site";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-bg py-24 sm:py-30 md:py-50">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 md:px-20">
        <Reveal className="max-w-[720px]">
          <p className="mb-6 text-xs tracking-[0.1em] text-ink-3 uppercase">{contactContent.eyebrow}</p>

          <h2
            id="contact-heading"
            className="my-6 font-serif text-[clamp(2.75rem,5vw,5rem)] leading-[1.08] tracking-[-0.025em] text-ink"
          >
            {contactContent.title}
            <br />
            <em className="text-accent italic">{contactContent.titleEmphasis}</em>
          </h2>

          <p className="mb-16 max-w-[520px] text-[1.0625rem] leading-[1.7] font-light text-ink-2">
            {contactContent.subline}
          </p>

          <div className="mb-16 flex flex-wrap gap-3">
            <Button variant="primary" href={contactContent.emailCta.href}>
              {contactContent.emailCta.label}
            </Button>
            <Button variant="secondary" href={contactContent.resumeCta.href}>
              {contactContent.resumeCta.label}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <span key={link.label} className="flex items-center gap-4">
                {index > 0 && <span aria-hidden className="text-border">·</span>}
                <a
                  href={link.href}
                  className="text-sm text-ink-3 transition-colors duration-150 hover:text-accent"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
