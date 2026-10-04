import { useEffect } from 'react';

/**
 * Scroll reveal for the whole page.
 *
 * Design notes:
 * - ONE IntersectionObserver for every observed element. A per-component
 *   observer would mean dozens of observers and dozens of callbacks per frame.
 * - `threshold: 0` plus a negative bottom rootMargin fires the moment ~10% of
 *   the element is visible, which is earlier (and cheaper) than waiting for a
 *   ratio-based threshold to be satisfied.
 * - Each element is unobserved as soon as it reveals, so the observer's set
 *   drains to zero and the browser stops doing any work at all.
 * - Elements are written only on intersect (a class toggle), never read.
 */

/**
 * `.line-mask` and `.reveal-shift` are observed alongside `.reveal`. Neither
 * fades from opacity 0: a clipped mask and a transform both leave the element
 * painted, so the page's Largest Contentful Paint candidate is reportable from
 * first paint instead of only once an animation has finished.
 */
const REVEAL_SELECTOR = '.reveal, .reveal-shift, .line-mask';

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (els.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}