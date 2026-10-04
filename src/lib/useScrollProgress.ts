import { useEffect } from 'react';

/**
 * Drives a compositor-only scroll progress bar.
 *
 * A `scroll` listener fires far more often than the display can paint. The
 * handler therefore (a) is passive so it never blocks the scroll, (b) only
 * schedules a rAF, and (c) writes nothing unless the value actually changed.
 * The bar itself animates with `transform: scaleX()`, so the write is a
 * compositor commit — no layout, no paint.
 */
export function useScrollProgress(selector = '.progress-bar') {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(selector);
    if (!bar) return;

    let last = -1;
    let frame = 0;

    const apply = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      // 3 decimal places is well below sub-pixel visibility at any realistic
      // page height, so skipping these writes is invisible.
      const rounded = Math.round(clamped * 1000) / 1000;
      if (rounded === last) return;
      last = rounded;
      bar.style.transform = `scaleX(${rounded})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [selector]);
}