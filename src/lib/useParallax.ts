import { useEffect, useRef } from 'react';

/**
 * Scroll-linked parallax for one backdrop layer.
 *
 * The element rides `scrollY * depth` pixels via `translate3d` — compositor
 * only, no layout or paint. The listener is passive and rAF-coalesced, writes
 * nothing when scrollY is unchanged, and clamps the shift so a long page
 * cannot drag a layer out of its frame. Layers using keyframed `transform`
 * animations sit INSIDE the wrapper, so the two transforms compose instead
 * of fighting over the same property.
 *
 * Disabled callers pass depth 0 or unmount under prefers-reduced-motion:
 * parallax is decorative depth, and still air is the correct reduced-motion
 * answer.
 */
export function useParallax<T extends HTMLElement>(depth: number) {
  const ref = useRef<T>(null);
  const depthRef = useRef(depth);
  depthRef.current = depth;

  useEffect(() => {
    const el = ref.current;
    if (!el || depthRef.current === 0) return;

    let frame = 0;
    let lastY = -1;

    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      const shift = Math.max(-72, Math.min(72, y * depthRef.current));
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return ref;
}
