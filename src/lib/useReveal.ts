import { useEffect } from 'react';

/**
 * Scroll reveal for the whole page.
 *
 * Design notes:
 * - ONE IntersectionObserver for every observed element. A per-component
 *   observer would mean dozens of observers and dozens of callbacks per frame.
 * - Each element is unobserved as soon as it reveals, so the observer's set
 *   drains to zero and the browser stops doing any work at all.
 * - Elements are written only on intersect (a class toggle), never read.
 *
 * Cross-browser hardening. The failure this exists to prevent is subtle: with
 * CSS transitions, whether an entrance animation is *seen* depended on the
 * browser having a prior computed style to interpolate from when the class
 * landed. Where it did not, the element snapped to its end state and the page
 * read as static — same CSS, different engine, different result. The CSS now
 * uses `@keyframes` (see index.css), which cannot be skipped this way, so this
 * hook only has to guarantee that every class arrives:
 * - No IntersectionObserver, or reduced motion: reveal everything immediately.
 * - Anything already on screen at mount: reveal synchronously, so the hero never
 *   waits on the observer's first callback.
 * - `isIntersecting || intersectionRatio > 0`: some engines deliver a first tick
 *   with isIntersecting=false but a positive ratio.
 * - A repeated safety sweep. The original single 2.5s timeout could not catch an
 *   element that was still off-screen at 2.5s but whose observer entry never
 *   fired; sweeping on an interval until the set drains closes that gap for
 *   elements scrolled into view later, and is bounded so it cannot run forever.
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

function revealAll(els: Iterable<HTMLElement>) {
  for (const el of els) el.classList.add('is-visible');
}

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (els.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') {
      revealAll(els);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll(els);
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
          window.clearInterval(safety);
        }
      },
      // A pixel rootMargin rather than a percentage: percentage margins are
      // resolved inconsistently across engines, a pixel margin is not.
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    pending.forEach((el) => io.observe(el));

    // Safety net: reveal anything the observer never fired for, repeatedly and
    // with a widening slack, so nothing can stay invisible. Sweeping on an
    // interval (rather than one timeout) is what covers elements scrolled into
    // view after the initial window. Cheap: it stops as soon as `pending` is
    // empty, and `inViewport` is one rect read per pending element per tick.
    let tick = 0;
    const safety = window.setInterval(() => {
      tick += 1;
      const slack = 400 + tick * 400;
      for (const el of Array.from(pending)) {
        if (!inViewport(el, slack)) continue;
        el.classList.add('is-visible');
        io.unobserve(el);
        pending.delete(el);
      }
      if (pending.size === 0) {
        io.disconnect();
        window.clearInterval(safety);
      }
    }, 900);

    return () => {
      window.clearInterval(safety);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}