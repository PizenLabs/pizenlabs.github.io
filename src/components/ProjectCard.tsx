import { ArrowUpRight } from '@/lib/icons';
import { useSpotlight } from '@/lib/useSpotlight';
import type { Project } from '@/lib/content';

/**
 * A project link. The pointer highlight is CSS-driven from --sx/--sy, so the
 * only JavaScript on hover is two custom-property writes inside one rAF.
 */
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { ref, onPointerMove } = useSpotlight<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noreferrer noopener"
      onPointerMove={onPointerMove}
      className="panel spotlight group reveal flex flex-col p-7 !rounded-xl sm:p-8"
      style={{ ['--reveal-i' as string]: index }}
    >
      <div className="mb-7 flex items-center justify-between gap-4">
        <span className="label text-bone-500">
          {project.kind}
        </span>
        <ArrowUpRight
          className="btn-arrow h-4 w-4 shrink-0 text-bone-500 transition-colors duration-300 group-hover:text-forest-300"
          aria-hidden="true"
        />
      </div>

      <h3 className="font-sans text-2xl font-medium tracking-tight text-bone-50 transition-colors duration-300 group-hover:text-forest-200 sm:text-[1.75rem]">
        {project.name}
      </h3>

      <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-bone-300">
        {project.summary}
      </p>

      <p className="mt-auto pt-7 font-mono text-[0.6875rem] leading-relaxed text-bone-500">
        {project.meta}
      </p>
    </a>
  );
}