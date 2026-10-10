import { useEffect, useRef } from 'react';
import { subscribeScroll } from '@/lib/scrollPipeline';

/**
 * Scroll-linked parallax for one backdrop layer.
 *
 * The element rides `scrollY * depth` pixels via `translate3d` — compositor
 * only, no layout or paint. It reads from the shared scroll pipeline rather than
 * attaching its own listener, so all parallax layers plus the progress bar are
 * written once per frame instead of once per layer. The shift is clamped so a
 * long page cannot drag a layer out of its frame.
 *
 * Layers using keyframed `transform` animations sit INSIDE the wrapper, so the
 * two transforms compose instead of fighting over the same property — that is
 * why the wrapper is never the animated element itself.
 *
 * Disabled callers pass depth 0: parallax is decorative depth, and still air is
 * the correct reduced-motion answer.
 */
export function useParallax<T extends HTMLElement>(depth: number) {
  const ref = useRef<T>(null);
  const depthRef = useRef(depth);
  depthRef.current = depth;

  useEffect(() => {
    const el = ref.current;
    if (!el || depthRef.current === 0) return;

    let last = '';

    return subscribeScroll(({ y }) => {
      const shift = Math.max(-72, Math.min(72, y * depthRef.current));
      const key = shift.toFixed(1);
      if (key === last) return;
      last = key;
      el.style.transform = `translate3d(0, ${key}px, 0)`;
    });
  }, []);

  return ref;
}