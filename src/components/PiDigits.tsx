import { useEffect, useMemo, useState } from 'react';
import { PI_HEAD, piChunk } from '@/lib/pi';

/**
 * The ambient layer: the digits of pi, scrolling across the screen.
 *
 * It is the site's one continuous animation, and it is deliberately quiet —
 * five rows of monospaced digits at a few percent opacity, drifting at
 * different speeds behind the content. The point is not the number; it is
 * that the page is never completely still.
 *
 * Why CSS and not JavaScript
 * --------------------------
 * The rows are moved with a `transform` keyframe, so the whole layer costs
 * the compositor a texture and nothing else: no layout, no paint, no
 * JavaScript on a timer. The tape is written once into the DOM and never
 * touched again.
 *
 * The loop
 * --------
 * Each row holds two identical strips of digits and slides by exactly half
 * its own width, so the second strip lands where the first one was. The
 * seam is invisible, and the tape is effectively endless.
 *
 * The rows read from different offsets in the tape, so the layer never
 * looks like one line repeated, and they travel at different speeds, so
 * they cross rather than move as a block.
 *
 * Visibility
 * ----------
 * The animation is paused while the tab is hidden — an idle background tab
 * should hold no compositor work. It keeps drifting in the site's
 * `calm` motion mode, which is what a visitor with `prefers-reduced-motion`
 * gets: a full crossing takes minutes, so it stays ambient, not motion
 * that troubles. There is no toggle for it: the layer is part of the page,
 * in the same way the type is.
 */
const ROWS = [
  // top, length, offset into the tape, seconds per lap, direction, opacity
  { id: 'a', top: '2%', length: 320, offset: 0, seconds: 168, reverse: false, opacity: 0.09 },
  { id: 'b', top: '21%', length: 280, offset: 137, seconds: 132, reverse: true, opacity: 0.06 },
  { id: 'c', top: '39%', length: 360, offset: 419, seconds: 210, reverse: false, opacity: 0.045 },
  { id: 'd', top: '57%', length: 300, offset: 61, seconds: 144, reverse: true, opacity: 0.05 },
  { id: 'e', top: '76%', length: 340, offset: 733, seconds: 192, reverse: false, opacity: 0.07 },
] as const;

export default function PiDigits() {
  const [paused, setPaused] = useState(() => document.hidden);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Built once: toggling `paused` re-renders, and without this every toggle
  // would rebuild ~3.2k chars of tape via piChunk for no reason.
  const texts = useMemo(
    () =>
      ROWS.map((row) =>
        row.id === 'a' ? `${PI_HEAD}${piChunk(row.offset, row.length)}` : piChunk(row.offset, row.length),
      ),
    []
  );

  return (
    <div className="pi-layer" aria-hidden="true" data-paused={paused}>
      {ROWS.map((row, i) => {
        // The first row starts at the decimal point; the rest are pure
        // digits, so the tape reads as a number that continues.
        const text = texts[i];

        return (
          <div
            key={row.id}
            className="pi-row"
            style={{
              top: row.top,
              opacity: row.opacity,
              animationDuration: `${row.seconds}s`,
              animationDirection: row.reverse ? 'reverse' : 'normal',
            }}
          >
            <span className="pi-strip">{text}</span>
            <span className="pi-strip">{text}</span>
          </div>
        );
      })}
    </div>
  );
}
