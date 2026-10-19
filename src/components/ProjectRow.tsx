import { ArrowUpRight } from '@/lib/icons';
import { useSpotlight } from '@/lib/useSpotlight';
import type { Project } from '@/lib/content';

/**
 * A sub-project, as a row in the index.
 *
 * The hero shows the projects as medallions; this is the other half of the
 * story — the same projects written out, with the detail that does not fit
 * inside a circle. Rows rather than cards, because a list of four lines
 * reads as a table of contents and a grid of boxes reads as a shop.
 *
 * The pointer highlight is CSS-driven from --sx/--sy, so the only JavaScript
 * on hover is two custom-property writes inside one rAF.
 */
export default function ProjectRow({
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
      className="spotlight group reveal grid gap-x-6 gap-y-3 border-t border-ink-500/50 py-7 transition-colors duration-300 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-8"
      style={{ ['--reveal-i' as string]: index }}
    >
      <span className="label text-bone-500">{String(index + 1).padStart(2, '0')}</span>

      <span className="block min-w-0">
        <span className="flex items-center gap-3">
          <span className="font-sans text-xl font-medium tracking-tight text-bone-50 transition-colors duration-300 group-hover:text-forest-200 sm:text-2xl">
            {project.name}
          </span>
          <span className="label text-forest-300">{project.kind}</span>
        </span>
        <span className="mt-3 block max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-bone-300">
          {project.summary}
        </span>
        <span className="mt-3 block font-mono text-[0.6875rem] tracking-wide text-bone-500">
          {project.meta}
        </span>
      </span>

      <span className="flex items-center gap-3 sm:justify-end">
        <span className="label text-bone-400 transition-colors duration-300 group-hover:text-bone-50">
          Open
        </span>
        <ArrowUpRight
          className="btn-arrow h-4 w-4 shrink-0 text-bone-500 transition-colors duration-300 group-hover:text-forest-300"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
