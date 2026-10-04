import { ArrowUpRight, Github } from '@/lib/icons';
import { ARTICLES_PATH, GITHUB_URL, PROJECTS } from '@/lib/content';

/**
 * Minimal footer: brand, source link, project index, and a back-to-top control.
 *
 * The back-to-top is a plain `#top` anchor rather than a JS scrollIntoView call
 * — the smooth behaviour (and its reduced-motion override) already lives in
 * CSS on `html`, so there is no listener to attach.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-ink-500/50">
      <div className="container-x py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-400/70 bg-ink-600/60">
                <img
                  src="/pizenlabs.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="brand-mark h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </span>
              <p className="font-sans text-[0.9375rem] font-medium tracking-tight text-bone-50">
                PizenLabs
              </p>
            </div>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-bone-400">
              A small, independent laboratory building open-source tools for
              clearer human-computer collaboration.
            </p>
          </div>

          <nav aria-label="Source">
            <p className="label mb-4 text-bone-500">Source</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline inline-flex items-center gap-1.5 text-sm text-bone-300 hover:text-forest-200"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  github.com/PizenLabs
                  <ArrowUpRight className="h-3 w-3 opacity-50" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Projects">
            <p className="label mb-4 text-bone-500">Projects</p>
            <ul className="space-y-2.5">
              {PROJECTS.map((project) => (
                <li key={project.name}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline inline-flex items-center gap-1.5 text-sm text-bone-300 hover:text-forest-200"
                  >
                    {project.name}
                    <ArrowUpRight className="h-3 w-3 opacity-50" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-500/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-bone-500">
            © {year} PizenLabs — open source
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="label text-bone-500">Built quietly. Read the source.</p>
            <a
              href={ARTICLES_PATH}
              className="label link-underline text-bone-400 transition-colors duration-200 hover:text-bone-50"
            >
              Articles
            </a>
            <a
              href="#top"
              className="label text-bone-400 transition-colors duration-200 hover:text-bone-50"
            >
              Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}