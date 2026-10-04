import { ArrowRight, ArrowUpRight, Blocks, Eye, GitBranch, Terminal } from '@/lib/icons';
import { GITHUB_URL, PRINCIPLES, PROJECTS } from '@/lib/content';
import Backdrop from '@/components/Backdrop';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProjectCard from '@/components/ProjectCard';
import SectionLabel from '@/components/SectionLabel';
import TerminalPanel from '@/components/TerminalPanel';

const PRINCIPLE_ICONS = {
  eye: Eye,
  terminal: Terminal,
  branch: GitBranch,
  arrow: ArrowUpRight,
} as const;

/** Hero headline, split so each line can be masked and revealed on a stagger. */
const HEADLINE = [
  { text: 'Tools for clearer', accent: false },
  { text: 'human-computer', accent: false },
  { text: 'collaboration.', accent: true },
] as const;

export default function PizenLabsHome() {
  return (
    <div id="top" className="relative flex min-h-screen flex-col text-bone-100">
      <a
        href="#main"
        className="label skip-link sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-4 focus:z-[70] focus:px-4 focus:py-3"
      >
        Skip to content
      </a>

      <Backdrop />
      {/* Scroll progress: compositor-only scaleX driven by useScrollProgress. */}
      <div className="progress-bar" aria-hidden="true" />

      <SiteHeader />

      <main id="main" className="relative z-10 flex-1">
        {/* ── 01 / HERO ───────────────────────────────────────────────────── */}
        {/* Tighter stagger than the rest of the page: the hero is the first
            thing anyone sees, and a slow entrance reads as sluggish rather
            than considered. */}
        <section className="relative pt-32 sm:pt-40 lg:pt-44" style={{ ['--reveal-step' as string]: '45ms' }}>
          <div className="container-x pb-20 sm:pb-28">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
              {/* Copy */}
              <div>
                <p
                  className="reveal flex items-center gap-2.5"
                  style={{ ['--reveal-i' as string]: 0 }}
                >
                  <span className="signal-dot" aria-hidden="true" />
                  <span className="label text-forest-300">Open source laboratory</span>
                </p>

                <h1 className="display mt-7 text-bone-50">
                  {HEADLINE.map((line, i) => (
                    <span key={line.text} className="line-mask" style={{ ['--reveal-i' as string]: i + 1 }}>
                      <span className={line.accent ? 'text-forest-300' : undefined}>
                        {line.text}
                      </span>
                    </span>
                  ))}
                </h1>

                {/* Transform-only entrance: see .reveal-shift in index.css. */}
                <p
                  className="lede reveal-shift mt-8"
                  style={{ ['--reveal-i' as string]: 4 }}
                >
                  PizenLabs is a small, independent laboratory building open-source
                  technology with a point of view. We explore the idea first, then
                  build the system that embodies it.
                </p>

                <div
                  className="reveal mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                  style={{ ['--reveal-i' as string]: 5 }}
                >
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Read the source
                    <ArrowUpRight className="btn-arrow h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a href="#work" className="btn btn-ghost w-full sm:w-auto">
                    See the work
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <TerminalPanel />
            </div>
          </div>
        </section>

        {/* ── 02 / PHILOSOPHY ─────────────────────────────────────────────── */}
        <section id="philosophy" className="rule-t">
          <div className="container-x section-y">
            <SectionLabel index="02" title="Philosophy" className="mb-12 sm:mb-16" />

            <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
              <h2
                className="headline-2 reveal text-bone-50"
                style={{ ['--reveal-i' as string]: 1 }}
              >
                Technology should increase human capability{' '}
                <span className="text-bone-400">without</span> removing human
                agency.
              </h2>

              <div
                className="reveal space-y-6 border-l border-ink-400/60 pl-6 lg:pl-7"
                style={{ ['--reveal-i' as string]: 2 }}
              >
                <p className="text-pretty leading-relaxed text-bone-300">
                  We build systems that make complexity legible — not systems that
                  decide for you. The human stays the source of truth; the machine is
                  an assistant, never an authority.
                </p>
                <p className="text-pretty leading-relaxed text-bone-400">
                  The work is open source because understanding is part of the
                  product. You should be able to read exactly what runs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 / WORK ───────────────────────────────────────────────────── */}
        <section id="work" className="rule-t">
          <div className="container-x section-y">
            <SectionLabel index="03" title="Work" className="mb-12 sm:mb-16" />

            <div className="reveal mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-sans text-2xl font-medium tracking-tight text-bone-50 sm:text-3xl">
                Current projects
              </h2>
              <p className="text-sm text-bone-400 sm:text-right">
                Two things in flight. Both readable, both forkable.
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
              {PROJECTS.map((project, i) => (
                <ProjectCard key={project.name} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 / OPEN SOURCE ────────────────────────────────────────────── */}
        <section id="principles" className="rule-t">
          <div className="container-x section-y">
            <SectionLabel index="04" title="Open source" className="mb-12 sm:mb-16" />

            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {PRINCIPLES.map((item, i) => {
                const Icon = PRINCIPLE_ICONS[item.icon];
                return (
                  <div
                    key={item.index}
                    className="reveal pt-6"
                    style={{ ['--reveal-i' as string]: i }}
                  >
                    {/* Rule that draws itself in on reveal. */}
                    <span className="rule-grow block" aria-hidden="true" />
                    <div className="mt-5 flex items-center justify-between">
                      <Icon className="h-4 w-4 text-forest-300" aria-hidden="true" />
                      <span className="label text-bone-500">{item.index}</span>
                    </div>
                    <h3 className="mt-5 font-sans text-lg font-medium tracking-tight text-bone-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-bone-400">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────────────────────────── */}
        <section className="rule-t">
          <div className="container-x section-y !pb-24 sm:!pb-28">
            <div className="panel spotlight reveal flex flex-col items-start gap-8 !rounded-2xl px-7 py-10 sm:px-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
              <div className="max-w-2xl">
                <p className="label mb-5 text-forest-300">No black boxes</p>
                <h2 className="font-sans text-2xl font-medium leading-tight tracking-tight text-bone-50 sm:text-[2rem]">
                  Everything we publish is meant to be read, run, and improved by
                  someone else.
                </h2>
              </div>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary shrink-0"
              >
                <Blocks className="h-3.5 w-3.5" aria-hidden="true" />
                Browse the repositories
                <ArrowUpRight className="btn-arrow h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}