import { SectionHeader } from "@/components/Common/SectionHeader";
import { ProjectItem } from "@/components/Projects/ProjectItem";
import { projects } from "@/data/projects";
import { sectionHeaders } from "@/data/sectionHeaders";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="bg-bg-alt py-24 sm:py-30 md:py-50">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 md:px-20">
        <SectionHeader {...sectionHeaders.projects} headingId="projects-heading" />

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <ProjectItem key={project.id} project={project} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
