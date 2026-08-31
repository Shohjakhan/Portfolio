import { ExternalLink } from "lucide-react";
import { Gallery } from "@/components/LaptopInterface/Gallery";
import type { Project } from "@/types/content";

export function ProjectCard({ project }: { project: Project }) {
  const hasLink = Boolean(project.href) && project.href !== "#";

  return (
    <article className="rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] tracking-[0.06em] text-[var(--room-lamp-glow)]/85 uppercase">
            {project.tag} · {project.year}
          </p>
          <h3 className="mt-0.5 truncate font-serif text-lg text-[var(--color-cream)]">{project.name}</h3>
        </div>
        {hasLink ? (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name}`}
            className="shrink-0 rounded-full p-1.5 text-[var(--color-cream)]/50 transition-colors duration-[var(--duration-fast)] hover:bg-white/10 hover:text-[var(--color-cream)]"
          >
            <ExternalLink size={15} strokeWidth={1.75} />
          </a>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-cream)]/75">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span key={tech} className="rounded border border-white/10 px-2 py-0.5 text-[0.7rem] text-[var(--color-cream)]/60">
            {tech}
          </span>
        ))}
      </div>
      <Gallery images={project.screenshots} />
    </article>
  );
}
