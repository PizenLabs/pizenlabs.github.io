import { useEffect, useState } from 'react';
import { Github } from '@/lib/icons';
import { GITHUB_URL, NAV_LINKS } from '@/lib/content';
import ThemeToggle from '@/components/ThemeToggle';

/**
 * Tracks whether the page has scrolled past a threshold.
 *
 * The listener is passive and rAF-coalesced, and the result is a boolean that
 * flips a handful of times per session — so the only React work is the two or
 * three actual state changes. The visual result is opacity transitions on an
 * already-composited header, with `backdrop-filter` only enabled once scrolling
 * has actually started.
 */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    let current = window.scrollY > threshold;

    const check = () => {
      frame = 0;
      const next = window.scrollY > threshold;
      if (next === current) return;
      current = next;
      setScrolled(next);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrolled;
}

export default function SiteHeader() {
  const scrolled = useScrolled();

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
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link-underline rounded px-3 py-2 text-[0.8125rem] text-bone-400 transition-colors duration-200 hover:text-bone-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
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