import { useEffect, useState } from 'react';
import { useParallax } from '@/lib/useParallax';
import { useMotion } from '@/lib/useMotion';

/**
 * The page's ambient background: a fixed stack of a base wash, a grid, and
 * two slow-drifting radial fields (one on phones — see the max-width rule in
 * index.css).
 *
 * Why fixed and shared rather than per-section: the previous version put a full
 * viewport gradient div inside three separate sections. Every scroll therefore
 * repainted up to six large gradient surfaces. One fixed layer paints once and
 * is then composited, so scrolling costs nothing.
 *
 * Every color arrives through a token, so this layer is the one that carries the
 * light theme's entire background — no per-theme markup.
 *
 * RAM: the drift animations pause while the tab is hidden, so an idle page
 * holds no compositor work. The `data-paused` selector lives in index.css.
 *
 * Depth: each layer rides inside a parallax wrapper at its own rate, so the
 * wash, grid, and glows shear apart slightly while scrolling — depth from
 * relative motion, not from blur or extra surfaces. Wrappers only, never the
 * animated elements themselves: a keyframed `transform` would override an
 * inline one on the same node.
 *
 * Motion mode: the drift itself always runs — it is the slowest and calmest
 * thing on the page, and a backdrop that does not move reads as a flat
 * background. Only the scroll-linked parallax follows the mode, because that
 * is the one layer whose movement is tied to the visitor's own scrolling.
 */
export default function Backdrop() {
  const [paused, setPaused] = useState(() => document.hidden);
  const { mode } = useMotion();

  // Parallax is scroll-linked movement: it follows the viewport, so it is the
  // first thing to go when the visitor asks for less motion.
  const depth = mode === 'full' ? 1 : 0;
  const gridRef = useParallax<HTMLDivElement>(depth * 0.03);
  const auroraARef = useParallax<HTMLDivElement>(depth * 0.06);
  const auroraBRef = useParallax<HTMLDivElement>(depth * 0.1);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div className="backdrop" aria-hidden="true" data-paused={paused}>
      {/* Page base wash */}
      <div className="absolute inset-0" style={{ background: 'var(--wash)' }} />
      <div className="plx" ref={auroraARef}>
        <div className="aurora aurora-a" />
      </div>
      <div className="plx" ref={auroraBRef}>
        <div className="aurora aurora-b" />
      </div>
      <div className="plx" ref={gridRef}>
        <div className="grid-bg absolute inset-0" />
      </div>
    </div>
  );
}
