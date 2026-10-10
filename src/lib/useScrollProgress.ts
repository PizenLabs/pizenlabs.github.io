import { useEffect } from 'react';
import { subscribeScroll } from '@/lib/scrollPipeline';

/**
 * Drives a compositor-only scroll progress bar.
 *
 * A `scroll` listener fires far more often than the display can paint, so this
 * no longer schedules its own rAF: it subscribes to the shared scroll pipeline
 * (see scrollPipeline.ts) and is therefore called exactly once per frame that
 * actually moved, alongside parallax. The value arrives pre-clamped and
 * pre-rounded.
 *
 * The bar animates with `transform: scaleX()`, so the write is a compositor
 * commit — no layout, no paint.
 */
export function useScrollProgress(selector = '.progress-bar') {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(selector);
    if (!bar) return;

    let last = '';

    return subscribeScroll(({ progress }) => {
      // Three decimals is well below sub-pixel visibility at any realistic page
      // height, so skipping these writes is invisible.
      const rounded = Math.round(progress * 1000) / 1000;
      const key = String(rounded);
      if (key === last) return;
      last = key;
      bar.style.transform = `scaleX(${key})`;
    });
  }, [selector]);
}