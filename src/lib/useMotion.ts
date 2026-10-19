import { useEffect, useState } from 'react';

/**
 * Motion modes for the whole site.
 *
 * `full`  — everything moves: the tape of digits scrolls, the backdrop
 *            drifts, the dial's arc turns, sections reveal as they scroll
 *            into view, and the page parallaxes.
 * `calm`  — the visitor's system asked for less motion. The entrance
 *            motion is skipped: nothing slides, fades or parallaxes into
 *            place, and the two large continuous movements — the tape and
 *            the arc — are frozen.
 *
 * Why this exists at all
 * ----------------------
 * The site used to answer `prefers-reduced-motion: reduce` with a blanket
 * `animation-duration: 0.01ms !important` on every element. That froze the
 * WHOLE page: with the OS setting on, the site rendered as a still image —
 * verified in WebKit, zero pixels changed over six seconds. A page with no
 * motion at all reads as broken rather than as "reduced", and the OS switch
 * is a blunt instrument: it silences the harmless ambient layer along with
 * the movement that actually causes trouble.
 *
 * So the OS preference now decides the mode, and the mode decides what
 * moves. There is no toggle: the motion is part of the page, the way the
 * type is, and the one control a visitor has over it is the one the
 * operating system already offers them. The page's own animation — the
 * digits of pi crossing the screen — therefore runs by default, from the
 * first paint.
 *
 * The mode lives on <html data-motion> rather than in a media query so that
 * CSS, JavaScript and the pre-paint bootstrap all read the same single
 * source of truth. The bootstrap script in index.html writes the attribute
 * before the first paint; this module reads it back rather than
 * re-deriving it, exactly like useTheme does with the `dark` class.
 */
export type MotionMode = 'full' | 'calm';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function isMode(value: string | null): value is MotionMode {
  return value === 'full' || value === 'calm';
}

/**
 * Module-level state with a tiny subscriber set, so every component sees the
 * same mode. The theme hook does not need this (it has one consumer); motion
 * has two — the backdrop and the scroll reveal — and two copies of the same
 * state would eventually disagree.
 */
let current: MotionMode = isMode(document.documentElement.getAttribute('data-motion'))
  ? (document.documentElement.getAttribute('data-motion') as MotionMode)
  : 'full';
const listeners = new Set<(mode: MotionMode) => void>();

function apply(mode: MotionMode) {
  current = mode;
  document.documentElement.setAttribute('data-motion', mode);
  listeners.forEach((listener) => listener(mode));
}

/** Human-readable name for the current mode, used by the diagnostics. */
export function motionLabel(mode: MotionMode): string {
  return mode === 'calm' ? 'ambient only' : 'full';
}

/**
 * The site's motion mode.
 *
 * It follows the operating system for as long as the visitor is on the
 * page: switching the system setting switches the page's mode, live.
 */
export function useMotion() {
  const [mode, setMode] = useState<MotionMode>(current);

  useEffect(() => {
    listeners.add(setMode);
    // The mode can change between module load and mount (the OS).
    setMode(current);
    return () => {
      listeners.delete(setMode);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => apply(mq.matches ? 'calm' : 'full');

    mq.addEventListener('change', onChange);
    onChange();
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return { mode };
}
