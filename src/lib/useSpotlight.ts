import { useCallback, useRef, type PointerEvent } from 'react';

/**
 * Pointer-following highlight for a card, used by `.spotlight`.
 *
 * The pointer position is written straight to two CSS custom properties on the
 * element. It is deliberately NOT React state: a setState here would re-render
 * the card on every pointer event. Writes are rAF-coalesced and skipped when
 * the rounded value is unchanged, so a still mouse does no work at all.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const pending = useRef<{ x: number; y: number } | null>(null);

  const flush = useCallback(() => {
    frame.current = 0;
    const el = ref.current;
    const p = pending.current;
    if (!el || !p) return;
    const rect = el.getBoundingClientRect();
    const x = Math.round(((p.x - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((p.y - rect.top) / rect.height) * 1000) / 10;
    if (el.dataset.sx === `${x}` && el.dataset.sy === `${y}`) return;
    el.dataset.sx = `${x}`;
    el.dataset.sy = `${y}`;
    el.style.setProperty('--sx', `${x}%`);
    el.style.setProperty('--sy', `${y}%`);
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  return { ref, onPointerMove };
}