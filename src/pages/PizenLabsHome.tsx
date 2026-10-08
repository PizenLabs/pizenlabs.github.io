import { ArrowRight, ArrowUpRight, Blocks, Bluesky, Eye, GitBranch, Linkedin, Mail, Terminal } from '@/lib/icons';
import { ARTICLES, ARTICLES_PATH, BLUESKY_HANDLE, BLUESKY_URL, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, PRINCIPLES, PROJECTS } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';
import CopyEmail from '@/components/CopyEmail';
import PageShell from '@/components/PageShell';
import ProjectCard from '@/components/ProjectCard';
import SectionLabel from '@/components/SectionLabel';
import TerminalPanel from '@/components/TerminalPanel';

const PRINCIPLE_ICONS = {
  eye: Eye,
  terminal: Terminal,
  branch: GitBranch,
  arrow: ArrowUpRight,
} as const;


/** Newest first, capped: the home page shows a teaser, not the whole archive. */
const RECENT = [...ARTICLES]
  .sort((a, b) => b.published.localeCompare(a.published))
  .slice(0, 2);

/** Hero headline, split so each line can be masked and revealed on a stagger. */
const HEADLINE = [
  { text: 'Tools for clearer', accent: false },
  { text: 'human-computer', accent: false },
  { text: 'collaboration.', accent: true },
] as const;

/** Lab ledger: the dossier strip under the hero. Not marketing stats — the
    lab's current state, stated plainly. */
const LEDGER = [
  { k: 'Systems in flight', v: '02' },
  { k: 'Operating principles', v: '04' },
  { k: 'Source readable', v: '100%' },
] as const;

export default function PizenLabsHome() {
  return (
    <PageShell>
      {/* ── 01 / HERO ───────────────────────────────────────────────────── */}
      {/* Tighter stagger than the rest of the page: the hero is the first
          thing anyone sees, and a slow entrance reads as sluggish rather
          than considered. */}
      <section className="relative pt-32 sm:pt-40 lg:pt-44" style={{ ['--reveal-step' as string]: '45ms' }}>
        <div className="container-x pb-16 sm:pb-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
            {/* Copy */}
            <div>
              <p
                className="reveal flex items-center gap-2.5"
                style={{ ['--reveal-i' as string]: 0 }}
              >
                <span className="signal-dot" aria-hidden="true" />
                <span className="label text-forest-300">Open source laboratory — 01 / Index</span>
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
                build the system that embodies it — and publish the whole thing
                so you can check our work.
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

              <p
                className="reveal mt-6 font-mono text-[0.75rem] tracking-wide text-bone-500"
                style={{ ['--reveal-i' as string]: 6 }}
              >
                Prefer words?{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="link-underline text-bone-300 hover:text-forest-200"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>

            <TerminalPanel />
          </div>

          {/* Lab ledger — a dossier strip, not a stats band. Borders instead of
              cards: it should read as an instrument readout, not marketing. */}
          <dl
            className="reveal mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink-500/50 bg-ink-500/30 sm:mt-20 sm:grid-cols-3"
            style={{ ['--reveal-i' as string]: 7 }}
          >
            {LEDGER.map((row) => (
              <div
                key={row.k}
                className="flex items-baseline justify-between gap-4 bg-ink-800/80 px-5 py-4 sm:px-6"
              >
                <dt className="label text-bone-500">{row.k}</dt>
                <dd className="font-mono text-sm tabular-nums text-bone-50">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 02 / PHILOSOPHY ─────────────────────────────────────────────── */}
      <section id="philosophy" className="rule-t">
        <div className="container-x section-y">
          <SectionLabel index="02" title="Philosophy" className="mb-12 sm:mb-16" />

          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <div>
              <h2
                className="headline-2 reveal text-bone-50"
                style={{ ['--reveal-i' as string]: 1 }}
              >
                Technology should increase human capability{' '}
                <span className="text-bone-400">without</span> removing human
                agency.
              </h2>
              {/* The test — the lab's one-line constitution, set apart so it
                  reads as a rule rather than another paragraph. */}
              <figure
                className="reveal mt-10 border-l-2 border-forest-400/60 pl-6"
                style={{ ['--reveal-i' as string]: 2 }}
              >
                <blockquote className="font-mono text-[0.8125rem] leading-relaxed text-bone-200">
                  “Does this make the work more legible — or does it just move
                  the decision somewhere less visible?”
                </blockquote>
                <figcaption className="label mt-3 text-bone-500">
                  The test we apply to every project
                </figcaption>
              </figure>
            </div>

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
              <p className="font-mono text-[0.75rem] leading-relaxed text-bone-500">
                → Method: read the idea, build the system, publish everything.
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
            <p className="font-mono text-[0.75rem] tracking-wide text-bone-400 sm:text-right">
              P.01 — P.02 · Both readable, both forkable.
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

      {/* ── 05 / ARTICLES ───────────────────────────────────────────────── */}
      <section id="articles" className="rule-t">
        <div className="container-x section-y">
          <SectionLabel index="05" title="Articles" className="mb-12 sm:mb-16" />

          <div className="reveal mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-sans text-2xl font-medium tracking-tight text-bone-50 sm:text-3xl">
              Notes from the lab
            </h2>
            <a
              href={ARTICLES_PATH}
              className="btn btn-ghost h-9 self-start !px-3.5 sm:self-auto"
            >
              All articles
              <ArrowRight className="btn-arrow h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {RECENT.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 / CONTACT ────────────────────────────────────────────────── */}
      <section id="contact" className="rule-t">
        <div className="container-x section-y !pb-24 sm:!pb-28">
          <SectionLabel index="06" title="Contact" className="mb-12 sm:mb-14" />
          <div className="panel spotlight reveal flex flex-col items-start gap-10 !rounded-2xl px-7 py-10 sm:px-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
            <div className="max-w-2xl">
              <p className="label mb-5 text-forest-300">No black boxes — no closed doors</p>
              <h2 className="font-sans text-2xl font-medium leading-tight tracking-tight text-bone-50 sm:text-[2rem]">
                Everything we publish is meant to be read, run, and improved by
                someone else. Start with a message.
              </h2>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="contact-mail mt-7"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="mt-4 font-mono text-[0.75rem] leading-relaxed text-bone-500">
                Small and considered messages welcome — issues and patches too.
              </p>
              <div className="mt-5">
                <CopyEmail email={CONTACT_EMAIL} />
              </div>
              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.75rem] tracking-wide text-bone-500">
                <a
                  href={BLUESKY_URL}
                  target="_blank"
                  rel="noreferrer noopener me"
                  className="link-underline inline-flex items-center gap-1.5 text-bone-300 hover:text-forest-200"
                >
                  <Bluesky className="h-3.5 w-3.5" aria-hidden="true" />
                  {BLUESKY_HANDLE}
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline inline-flex items-center gap-1.5 text-bone-300 hover:text-forest-200"
                >
                  <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                  LinkedIn
                </a>
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-60">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="btn btn-primary w-full shrink-0 sm:w-auto"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                Write to the lab
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost w-full shrink-0 sm:w-auto"
              >
                <Blocks className="h-3.5 w-3.5" aria-hidden="true" />
                Browse the repositories
                <ArrowUpRight className="btn-arrow h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
