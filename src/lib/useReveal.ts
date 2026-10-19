import { useEffect } from 'react';
import { useMotion } from '@/lib/useMotion';

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
 * - A scroll watchdog reveals anything the observer never fired for, so no
 *   element can stay invisible forever. In the `calm` and `off` motion modes
 *   the CSS already collapses the entrance motion, so this just skips waiting
 *   for it.
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
  const { mode } = useMotion();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (els.length === 0) return;

    // Without an observer there is nothing to observe: every element goes
    // straight to its end state.
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // In `calm` and `off` there is no entrance motion to wait for — the CSS
    // puts every element in its end state. Only the elements already on screen
    // are marked, so that switching back to `full` still animates the rest as
    // they scroll into view.
    if (mode !== 'full') {
      for (const el of els) {
        if (inViewport(el)) el.classList.add('is-visible');
      }
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
          reveal(entry.target as HTMLElement, obs);
        }
        if (pending.size === 0) {
          obs.disconnect();
          window.clearTimeout(safety);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    function reveal(el: HTMLElement, obs?: IntersectionObserver) {
      el.classList.add('is-visible');
      pending.delete(el);
      obs?.unobserve(el);
    }

    pending.forEach((el) => io.observe(el));

    // Watchdog: some embedded WebViews ship an IntersectionObserver that
    // never fires. Without this, every section below the fold would stay at
    // opacity 0 in those browsers. The sweep is rAF-coalesced and reads every
    // rect before writing any class, so it never thrashes layout.
    let frame = 0;
    const sweep = () => {
      frame = 0;
      if (pending.size === 0) return;
      const visible: HTMLElement[] = [];
      for (const el of pending) {
        if (inViewport(el)) visible.push(el);
      }
      for (const el of visible) reveal(el, io);
      if (pending.size === 0) {
        io.disconnect();
        window.clearTimeout(safety);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sweep);
    };

    // Safety net: if the observer never fires (background tab, WebKit quirk),
    // reveal whatever is left rather than leaving it invisible.
    const safety = window.setTimeout(() => {
      pending.forEach((el) => {
        if (inViewport(el, 400)) reveal(el, io);
      });
      if (pending.size === 0) io.disconnect();
    }, 2500);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.clearTimeout(safety);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, mode]);
}
