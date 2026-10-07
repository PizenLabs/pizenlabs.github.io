import { useEffect } from 'react';

/**
 * Scroll reveal for the whole page.
 *
 * Design notes:
 * - ONE IntersectionObserver for every observed element. A per-component
 *   observer would mean dozens of observers and dozens of callbacks per frame.
 * - `threshold: 0.1` with a small pixel rootMargin: percentage bottom margins
 *   are inconsistently resolved by WebKit (elements above the fold sometimes
 *   never intersected, leaving them stuck at opacity 0), while a pixel margin
 *   behaves identically everywhere.
 * - Each element is unobserved as soon as it reveals, so the observer's set
 *   drains to zero and the browser stops doing any work at all.
 * - Elements are written only on intersect (a class toggle), never read.
 *
 * Cross-browser hardening (Safari/Firefox on macOS):
 * - Above-the-fold elements reveal synchronously on mount via getBoundingClientRect,
 *   so the hero never waits for the observer's first callback.
 * - `isIntersecting || intersectionRatio > 0`: some WebKit builds deliver entries
 *   with isIntersecting=false but a positive ratio on the first tick.
 * - A 2.5s safety sweep reveals anything the observer never fired for, so no
 *   element can stay invisible forever. `prefers-reduced-motion` reveals
 *   everything immediately — the CSS already collapses the motion, this just
 *   skips waiting for it.
 */

/**
 * `.line-mask` and `.reveal-shift` are observed alongside `.reveal`. Neither
 * fades from opacity 0: a clipped mask and a transform both leave the element
 * painted, so the page's Largest Contentful Paint candidate is reportable from
 * first paint instead of only once an animation has finished.
 */
const REVEAL_SELECTOR = '.reveal, .reveal-shift, .line-mask';

function inViewport(el: HTMLElement, slack = 64): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight + slack && rect.bottom > -slack;
}

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (els.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // First paint: anything already on screen shows at once, no observer wait.
    const pending = new Set<HTMLElement>();
    for (const el of els) {
      if (inViewport(el)) el.classList.add('is-visible');
      else pending.add(el);
    }
    if (pending.size === 0) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.intersectionRatio <= 0) continue;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
          pending.delete(entry.target as HTMLElement);
        }
        if (pending.size === 0) {
          obs.disconnect();
          window.clearTimeout(safety);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    pending.forEach((el) => io.observe(el));

    // Safety net: if the observer never fires (background tab, WebKit quirk),
    // reveal whatever is left rather than leaving it invisible.
    const safety = window.setTimeout(() => {
      pending.forEach((el) => {
        if (inViewport(el, 400)) {
          el.classList.add('is-visible');
          io.unobserve(el);
          pending.delete(el);
        }
      });
      if (pending.size === 0) io.disconnect();
    }, 2500);

    return () => {
      window.clearTimeout(safety);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
