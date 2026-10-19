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
 * A depth of 0 disables the effect: the transform is cleared and no listener
 * is attached at all. Callers pass 0 whenever the site's motion mode is not
 * `full` — see lib/useMotion.ts — because scroll-linked movement is the one
 * piece of this site's motion that can cause real trouble, so it is the first
 * thing to go when the visitor asks for less.
 */
export function useParallax<T extends HTMLElement>(depth: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (depth === 0) {
      el.style.transform = '';
      return;
    }

    let frame = 0;
    let lastY = -1;

    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      const shift = Math.max(-72, Math.min(72, y * depth));
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
  }, [depth]);

  return ref;
}
