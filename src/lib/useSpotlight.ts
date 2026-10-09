import { useCallback, useEffect, useRef, type PointerEvent } from 'react';

/**
 * Pointer-following highlight for a card, used by `.spotlight`.
 *
 * The pointer position is written straight to two CSS custom properties on the
 * element. It is deliberately NOT React state: a setState here would re-render
 * the card on every pointer event. Writes are rAF-coalesced and skipped when the
 * rounded value is unchanged, so a still mouse does no work at all.
 *
 * The same written value doubles as the change guard, so the `dataset` mirror
 * the previous version kept — two extra attribute writes per moved pixel, purely
 * to remember what was already written — is gone.
 *
 * Disabled entirely on touch / no-hover devices: there is no cursor to follow,
 * so the listener would only cost scroll performance and wake the main thread.
 */
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const last = useRef('');
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current = window.matchMedia(FINE_POINTER_QUERY).matches;
  }, []);

  const flush = useCallback(() => {
    frame.current = 0;
    const el = ref.current;
    const p = pending.current;
    if (!el || !p) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = Math.round(((p.x - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((p.y - rect.top) / rect.height) * 1000) / 10;
    const key = `${x},${y}`;
    if (key === last.current) return;
    last.current = key;
    el.style.setProperty('--sx', `${x}%`);
    el.style.setProperty('--sy', `${y}%`);
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      if (!enabled.current && e.pointerType !== 'mouse') return;
      pending.current = { x: e.clientX, y: e.clientY };
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    []
  );

  return { ref, onPointerMove };
}