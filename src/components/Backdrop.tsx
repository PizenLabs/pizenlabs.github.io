import { useEffect, useState } from 'react';
import { useParallax } from '@/lib/useParallax';

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
 */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export default function Backdrop() {
  const [paused, setPaused] = useState(() => document.hidden);
  const [reducedMotion] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );

  const gridRef = useParallax<HTMLDivElement>(reducedMotion ? 0 : 0.03);
  const auroraARef = useParallax<HTMLDivElement>(reducedMotion ? 0 : 0.06);
  const auroraBRef = useParallax<HTMLDivElement>(reducedMotion ? 0 : 0.1);

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
