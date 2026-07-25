import { useEffect, useRef } from 'react';

type PixelEarthProps = {
  className?: string;
  /** Size of the canvas in CSS pixels (square). */
  size?: number;
  /** Density of the pixel grid along one axis. */
  grid?: number;
  /** Render intensity 0..1 — used to gently modulate activity. */
  intensity?: number;
};

type Pt = { x: number; y: number; z: number };

/**
 * PixelEarth — a sphere of structured pixels.
 *
 * A dot-grid is projected onto a slowly rotating sphere. Points facing the
 * viewer are bright; points on the far side fade. A small number of "active"
 * nodes pulse to suggest quiet system activity. Everything is 2D canvas — no
 * WebGL, no particle explosion, no game. Reduced motion freezes the rotation.
 */
export default function PixelEarth({
  className = '',
  size = 420,
  grid = 22,
  intensity = 1,
}: PixelEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.42;

    // Build a set of points on a sphere via fibonacci-ish distribution.
    const total = grid * grid;
    const pts: Pt[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2; // 1..-1
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({
        x: Math.cos(theta) * r,
        y: y,
        z: Math.sin(theta) * r,
      });
    }

    // Choose a few "active" nodes that pulse.
    const active = new Set<number>();
    const activeCount = Math.max(4, Math.floor(total * 0.04));
    while (active.size < activeCount) active.add(Math.floor(Math.random() * total));

    let raf = 0;
    let t0 = performance.now();

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const rot = reduce ? 0.4 : t * 0.08;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      ctx.clearRect(0, 0, size, size);

      // Faint atmospheric ring.
      const ring = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.25);
      ring.addColorStop(0, 'rgba(63,166,106,0.05)');
      ring.addColorStop(1, 'rgba(63,166,106,0)');
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // Rotate around Y axis.
        const x = p.x * cosR + p.z * sinR;
        const z = -p.x * sinR + p.z * cosR;
        const y = p.y;

        // Only render the near hemisphere.
        if (z < -0.05) continue;

        // Project orthographically.
        const sx = cx + x * radius;
        const sy = cy + y * radius;

        // Depth-based brightness.
        const depth = (z + 1) / 2; // 0..1
        const edge = 1 - Math.min(1, Math.hypot(x, y)); // fade at silhouette
        const baseAlpha = 0.12 + depth * 0.55 + edge * 0.15;

        const isActive = active.has(i);
        const pulse = isActive
          ? 0.5 + 0.5 * Math.sin(t * 1.6 + i)
          : 0;

        const alpha = Math.min(1, baseAlpha * intensity + pulse * 0.35 * intensity);
        const dotSize = isActive ? 2.4 + pulse * 1.4 : 1.4 + depth * 0.8;

        if (isActive) {
          ctx.fillStyle = `rgba(182,232,90,${alpha})`;
        } else {
          // Subtle green shift with depth.
          const g = Math.floor(120 + depth * 90);
          ctx.fillStyle = `rgba(63,${g},106,${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparse connection lines between a few near-side active nodes.
      if (!reduce) {
        const near: { sx: number; sy: number; z: number }[] = [];
        for (const i of active) {
          const p = pts[i];
          const x = p.x * cosR + p.z * sinR;
          const z = -p.x * sinR + p.z * cosR;
          if (z < 0.2) continue;
          near.push({ sx: cx + x * radius, sy: cy + p.y * radius, z });
        }
        ctx.strokeStyle = 'rgba(63,166,106,0.18)';
        ctx.lineWidth = 1;
        for (let a = 0; a < near.length; a++) {
          for (let b = a + 1; b < near.length; b++) {
            const d = Math.hypot(near[a].sx - near[b].sx, near[a].sy - near[b].sy);
            if (d < radius * 0.7) {
              ctx.globalAlpha = (1 - d / (radius * 0.7)) * 0.5;
              ctx.beginPath();
              ctx.moveTo(near[a].sx, near[a].sy);
              ctx.lineTo(near[b].sx, near[b].sy);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size, grid, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Pixel Earth — a structured sphere of nodes representing a world made legible."
    />
  );
}
