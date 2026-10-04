/**
 * The page's ambient background: a fixed, GPU-promoted stack of a base wash, a
 * grid, and two slow-drifting radial fields.
 *
 * Why fixed and shared rather than per-section: the previous version put a full
 * viewport gradient div inside three separate sections. Every scroll therefore
 * repainted up to six large gradient surfaces. One fixed layer paints once and
 * is then composited, so scrolling costs nothing.
 *
 * Every color arrives through a token, so this layer is the one that carries the
 * light theme's entire background — no per-theme markup.
 */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      {/* Page base wash */}
      <div className="absolute inset-0" style={{ background: 'var(--wash)' }} />
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="grid-bg absolute inset-0" />
    </div>
  );
}