import { Reveal } from "@/components/Common/Reveal";
import { Button } from "@/components/Common/Button";
import { Portrait } from "@/components/Hero/Portrait";
import { heroContent } from "@/data/hero";

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-center pt-nav"
    >
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-24 px-6 py-32 sm:px-10 md:grid-cols-2 md:px-20">
        <Reveal>
          <p className="mb-8 text-xs tracking-[0.1em] text-ink-3 uppercase">{heroContent.eyebrow}</p>

          <h1 className="mb-8 font-serif text-[clamp(3.25rem,6vw,6rem)] leading-[1.04] tracking-[-0.025em] text-ink">
            {heroContent.headline}
            <br />
            <em className="text-accent italic">{heroContent.headlineEmphasis}</em>
          </h1>

          <p className="mb-16 max-w-[420px] text-[1.0625rem] leading-[1.65] font-light text-ink-2">
            {heroContent.subline}
          </p>

          <div className="mb-16 flex flex-wrap gap-3">
            <Button variant="primary" href={heroContent.primaryCta.href}>
              {heroContent.primaryCta.label}
            </Button>
            <Button variant="secondary" href={heroContent.secondaryCta.href}>
              {heroContent.secondaryCta.label}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[0.8125rem] tracking-[0.01em] text-ink-3">
              <span className="animate-pulse-dot h-[7px] w-[7px] shrink-0 rounded-full bg-accent" />
              {heroContent.status}
            </span>
          </div>
        </Reveal>

        <Reveal variant="fade-in" delay={200} className="order-first md:order-none">
          <Portrait />
        </Reveal>
      </div>

      <div className="absolute bottom-16 left-6 hidden flex-col items-start gap-3 opacity-45 sm:left-10 md:left-20 md:flex">
        <span className="text-[0.6875rem] tracking-[0.12em] text-ink-3 uppercase">Scroll</span>
        <div className="animate-scroll-line h-10 w-px origin-top bg-ink-3" />
      </div>
    </section>
  );
}
