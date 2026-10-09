import { useEffect, useState } from 'react';
import { Github } from '@/lib/icons';
import { GITHUB_URL, NAV_LINKS } from '@/lib/content';
import { usePath } from '@/lib/router';
import { subscribeScroll } from '@/lib/scrollPipeline';
import ThemeToggle from '@/components/ThemeToggle';

/**
 * Scrollspy for the home page's section links.
 *
 * One IntersectionObserver watches the anchored sections and reports the one
 * crossing the viewport's middle band (rootMargin pinches the root to a thin
 * horizontal strip). Only site-absolute `/#id` links participate, and only
 * while the home route is mounted — everywhere else the links navigate away,
 * so there is nothing to highlight. The active link gets `aria-current` plus
 * full-strength text; the rest stay dimmed.
 */
function useScrollSpy(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') {
      setActive(null);
      return;
    }

    const sections = NAV_LINKS.filter((link) => link.href.startsWith('/#'))
      .map((link) => document.getElementById(link.href.slice(2)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActive((current) => (current === `/#${id}` ? current : `/#${id}`));
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);

  return active;
}

/**
 * Tracks whether the page has scrolled past a threshold.
 *
 * Reads the shared scroll pipeline instead of attaching a listener of its own.
 * The result is a boolean that flips a handful of times per session, so the only
 * React work is the two or three actual state changes — and the guard below
 * means the setter is not even called on the frames in between. The visual
 * result is opacity transitions on an already-composited header, with
 * `backdrop-filter` only enabled once scrolling has actually started.
 */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let current = window.scrollY > threshold;
    return subscribeScroll(({ y }) => {
      const next = y > threshold;
      if (next === current) return;
      current = next;
      setScrolled(next);
    });
  }, [threshold]);

  return scrolled;
}

export default function SiteHeader() {
  const scrolled = useScrolled();
  const path = usePath();
  const active = useScrollSpy(path === '/');

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        height: 'var(--header-h)',
        background: scrolled ? 'var(--header-bg)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
        // Only pay for the blur once the page has moved. At the top of the page
        // the header is transparent, so there is nothing to blur.
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : undefined,
      }}
    >
      <div className="container-x flex h-full items-center justify-between gap-6">
        <a
          href="/"
          className="group flex items-center gap-2.5 rounded"
          aria-label="PizenLabs — home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-400/70 bg-ink-600/60 transition-colors duration-300 group-hover:border-forest-400/50">
            <img
              src="/pizenlabs.svg"
              alt=""
              width={14}
              height={14}
              decoding="async"
              className="brand-mark h-3.5 w-3.5"
              aria-hidden="true"
            />
          </span>
          <span className="font-sans text-[0.9375rem] font-medium tracking-tight text-bone-50">
            PizenLabs
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-2">
          {/* Section links are secondary: they collapse before the GitHub
              action does, so the primary CTA is never pushed off-screen. */}
          <ul className="hidden items-center lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active !== null && active === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={`link-underline rounded px-3 py-2 text-[0.8125rem] transition-colors duration-200 hover:text-bone-50 ${
                      isActive ? 'text-bone-50' : 'text-bone-400'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <ThemeToggle />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-ghost h-9 !px-3.5"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}