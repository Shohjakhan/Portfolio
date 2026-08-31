import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Common/Reveal";
import type { Project } from "@/types/content";

interface ProjectItemProps {
  project: Project;
  delay: number;
}

export function ProjectItem({ project, delay }: ProjectItemProps) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className="group grid grid-cols-[1fr_40px] items-center gap-4 border-t border-border py-8 transition-colors duration-150 last:border-b md:grid-cols-[100px_1fr_48px] md:gap-8 md:py-12"
    >
      <div className="col-span-2 flex flex-row items-center gap-3 md:col-span-1 md:flex-col md:items-start md:gap-2">
        <span className="text-xs tracking-[0.04em] text-ink-3">{project.year}</span>
        <span className="w-fit rounded border border-border px-[7px] py-[3px] text-[0.6875rem] tracking-[0.08em] text-ink-3 uppercase">
          {project.tag}
        </span>
      </div>

      <div>
        <h3 className="mb-2 font-serif text-[1.375rem] tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-accent">
          {project.name}
        </h3>
        <p className="mb-4 max-w-[600px] text-[0.9rem] leading-[1.6] font-light text-ink-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="text-[0.6875rem] tracking-[0.06em] text-ink-3 before:content-['—__']">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <a
        href={project.href}
        aria-label={`View ${project.name}`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-3 transition-all duration-150 ease-out-expo group-hover:rotate-45 group-hover:border-ink-2 group-hover:bg-bg group-hover:text-ink"
      >
        <ArrowUpRight size={20} strokeWidth={1.5} />
      </a>
    </Reveal>
  );
}
