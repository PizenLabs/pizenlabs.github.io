import { useEffect, useRef } from 'react';

/* The planet is a minimalist globe of small green dots joined by faint
   connecting lines, in which the ENTIRE Earth rotates: every point turns
   together around the vertical axis, and points that swing behind the
   sphere are culled, so the globe sweeps out of view around the limb and
   back in on the far side. Dots plus their links, nothing else.

   Full motion: one revolution every ~26 seconds. Calm motion (the visitor's
   system asked for less): the turn slows to a drift — still visibly turning,
   never a still image. The loop pauses off-screen and in a hidden tab (the
   same `data-motion` attribute index.css keys off). */

const GRID = 16; // 16x16 = 256 sparse dots on the sphere
const LINK_DISTANCE = 0.3; // max chord between linked dots (unit sphere)
const CULL_Z = -0.06; // hide points just behind the limb
const FULL_REV_SECONDS = 26;
const CALM_REV_SECONDS = 60;

const DOT_FILL = '#4ec88a';
const LINK_RGB = '63, 166, 106';

// Professional light/dark support: the globe resolves its greens from the
// design tokens (`--forest-*` in index.css), which are near-black greens in
// light mode and neon-soft greens in dark mode. Same code, correct contrast
// in both themes, and it follows a runtime theme toggle for free.
let dotFill = DOT_FILL;
let linkRgb = LINK_RGB;
let lightBoost = 1;

const refreshPalette = () => {
  const computed = getComputedStyle(document.documentElement);
  const triplet = (name: string, fallback: string) => {
    const value = computed.getPropertyValue(name).trim();
    return value || fallback;
  };
  dotFill = `rgb(${triplet('--forest-200', '111 206 148')})`;
  linkRgb = triplet('--forest-300', '63 166 106').split(/\s+/).join(', ');
  lightBoost = document.documentElement.classList.contains('dark') ? 1 : 1.3;
};

const isCalm = () => document.documentElement.dataset.motion === 'calm';

// requestAnimationFrame with a setTimeout fallback for browsers / webviews
// where rAF is missing or throttled (old embedded browsers, some in-app
// webviews, test harnesses). The fallback passes a timestamp so the tick
// math stays identical.
const nextFrame = (cb: (t: number) => void): number => {
  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame((t: number) =>
      cb(typeof t === 'number' ? t : performance.now()),
    );
  }
  return window.setTimeout(() => cb(performance.now()), 16);
};

const cancelFrame = (id: number) => {
  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(id);
  } else {
    window.clearTimeout(id);
  }
};

export default function GlobeRocket() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Geometry — flat Float32Array, golden-angle distribution so the dots
    // spread evenly. Deterministic: the same planet on every load.
    const total = GRID * GRID;
    const pts = new Float32Array(total * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts[i * 3] = Math.cos(theta) * r;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = Math.sin(theta) * r;
    }

    // Minimalist style: every dot is the same small mark, evenly spread so
    // the globe reads in any rotational phase. No accents, no glow.
    // Links join near neighbours once (fixed pairs on the rigid sphere);
    // they are drawn only while both ends face the viewer.
    const links: number[] = [];
    {
      const max2 = LINK_DISTANCE * LINK_DISTANCE;
      for (let i = 0; i < total; i++) {
        for (let j = i + 1; j < total; j++) {
          const dx = pts[i * 3] - pts[j * 3];
          const dy = pts[i * 3 + 1] - pts[j * 3 + 1];
          const dz = pts[i * 3 + 2] - pts[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < max2) links.push(i, j);
        }
      }
    }
    const projX = new Float32Array(total);
    const projY = new Float32Array(total);
    const projZ = new Float32Array(total);

    // Device-adaptive caps: throttle the frame rate on low-end / save-data
    // devices. The globe is cheap, but a background tab on a cheap phone
    // should still sip, not gulp. Evaluated on mount/resize only — the old
    // code re-read navigator + innerWidth on every frame (~30x/sec) for a
    // value that changes maybe once per session.
    const nav = navigator as unknown as {
      deviceMemory?: number;
      hardwareConcurrency?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    let lowEnd = false;
    const computeLowEnd = () => {
      const saveData = !!nav.connection?.saveData;
      const slowNet =
        nav.connection?.effectiveType === '2g' ||
        nav.connection?.effectiveType === 'slow-2g';
      const lowMem = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
      const lowCore =
        typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4;
      lowEnd = saveData || slowNet || lowMem || lowCore || window.innerWidth < 640;
    };
    computeLowEnd();

    // Batched link strokes: 708 individual beginPath/stroke pairs per frame
    // was the hottest cost here (~21k strokes/sec at 30fps, each with its own
    // rgba() string alloc via toFixed). Links are now quantized into 8 depth
    // buckets sharing one precomputed strokeStyle each: one beginPath + one
    // stroke per non-empty bucket (~6 strokes/frame), zero per-frame strings.
    // Depth shading is preserved — 8 steps over the visible range is below
    // what the eye resolves at 0.6px line width.
    const LINK_BUCKETS = 8;
    let linkStyles: string[] = [];
    const linkBucket = new Uint8Array(links.length >> 1);
    const rebuildLinkStyles = () => {
      linkStyles = new Array(LINK_BUCKETS);
      for (let b = 0; b < LINK_BUCKETS; b++) {
        const depthRep = (b + 0.5) / LINK_BUCKETS;
        const alpha = Math.min(0.5, (0.03 + 0.2 * depthRep * depthRep) * lightBoost);
        linkStyles[b] = `rgba(${linkRgb}, ${alpha.toFixed(3)})`;
      }
    };

    let size = 0; // css px
    let radius = 0;

    const resize = () => {
      computeLowEnd();
      // getBoundingClientRect can report 0 if the stylesheet hasn't applied
      // yet (slow CSS on old mobile browsers). Fall back to the scene box so
      // the planet still paints instead of staying an empty disc.
      let w = canvas.getBoundingClientRect().width;
      if (!w || !Number.isFinite(w)) {
        const host = canvas.parentElement?.getBoundingClientRect();
        w = host?.width ?? 0;
      }
      if (!w || !Number.isFinite(w)) return;
      // Low-end phones hold half the canvas backing store: at 390css-px wide
      // DPR 2 pins a 780x780 texture; 1.5 is visually identical for 1px dots.
      const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1.5 : 2);
      size = w;
      radius = size * 0.42;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let angle = 0;
    let last = 0;
    let raf = 0;
    let onScreen = true;

    const draw = () => {
      if (!size) return;
      const cx = size / 2;
      const cy = size / 2;
      const cosR = Math.cos(angle);
      const sinR = Math.sin(angle);

      ctx.clearRect(0, 0, size, size);

      // Rotate the whole rigid sphere, then project. Links and dots share
      // the same pass, so they can never drift apart.
      for (let i = 0; i < total; i++) {
        const i3 = i * 3;
        const x0 = pts[i3];
        const y0 = pts[i3 + 1];
        const z0 = pts[i3 + 2];
        const x = x0 * cosR + z0 * sinR;
        const z = -x0 * sinR + z0 * cosR;
        projX[i] = cx + x * radius;
        projY[i] = cy + y0 * radius;
        projZ[i] = z;
      }

      // Connecting lines first, so dots sit on top. A link draws only
      // while both ends face us — lines never cross the hidden far side.
      // Batched into LINK_BUCKETS strokes (see above): ~6 strokes/frame
      // instead of ~700, with no per-link string allocation.
      ctx.lineWidth = 0.6;
      const pairCount = links.length >> 1;
      for (let p = 0; p < pairCount; p++) {
        const a = links[p * 2];
        const b = links[p * 2 + 1];
        const za = projZ[a];
        const zb = projZ[b];
        if (za < CULL_Z || zb < CULL_Z) {
          linkBucket[p] = 255; // culled marker
          continue;
        }
        const depth = (za + zb + 1) * 0.25;
        const bucket = depth >= 1 ? LINK_BUCKETS - 1 : (depth * LINK_BUCKETS) | 0;
        linkBucket[p] = bucket;
      }
      for (let bucket = 0; bucket < LINK_BUCKETS; bucket++) {
        ctx.strokeStyle = linkStyles[bucket];
        ctx.beginPath();
        let empty = true;
        for (let p = 0; p < pairCount; p++) {
          if (linkBucket[p] !== bucket) continue;
          const a = links[p * 2];
          const b = links[p * 2 + 1];
          ctx.moveTo(projX[a], projY[a]);
          ctx.lineTo(projX[b], projY[b]);
          empty = false;
        }
        if (!empty) ctx.stroke();
      }

      // The dots, one small mark each — culled behind the limb, shaded by
      // depth. Quiet and uniform. fillStyle is constant per theme so it is
      // set once, not 256x; sqrt replaces hypot (single-arg, no rest-args).
      ctx.fillStyle = dotFill;
      for (let i = 0; i < total; i++) {
        const z = projZ[i];
        if (z < CULL_Z) continue;
        const depth = (z + 1) * 0.5;
        const dx = projX[i] - cx;
        const dy = projY[i] - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) / radius;
        const edge = 1 - (dist > 1 ? 1 : dist);
        const dotAlpha = Math.min(0.5, 0.22 + depth * 0.22 + edge * 0.04);
        ctx.globalAlpha = Math.min(0.7, dotAlpha * lightBoost);
        ctx.beginPath();
        ctx.arc(projX[i], projY[i], 1.1 + depth * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = nextFrame(tick);
      const t = typeof now === 'number' ? now : performance.now();
      if (!last) last = t;
      const dt = t - last;
      // Read once per tick: the old code called isCalm() twice and walked
      // navigator + innerWidth (isLowEnd) on every frame.
      const calm = isCalm();
      const interval = calm ? 1000 / 18 : 1000 / (lowEnd ? 24 : 30);
      if (dt < interval) return;
      last = t;
      // Incremental angle: pausing, throttling and mode switches never make
      // the planet jump.
      const step = Math.min(dt, 100);
      const period = calm ? CALM_REV_SECONDS : FULL_REV_SECONDS;
      angle += (step / 1000) * ((Math.PI * 2) / period);
      draw();
    };

    const stop = () => {
      cancelFrame(raf);
      raf = 0;
      last = 0;
    };

    const sync = () => {
      if (onScreen && !document.hidden && !raf) {
        raf = nextFrame(tick);
      } else if ((!onScreen || document.hidden) && raf) {
        stop();
      }
    };

    resize();
    refreshPalette();
    rebuildLinkStyles();
    draw(); // first paint must not wait for the first rAF callback
    sync();

    // ResizeObserver / IntersectionObserver are missing on very old
    // browsers. Fall back to window events / always-on so the planet still
    // turns instead of freezing.
    let resizeObserver: ResizeObserver | null = null;
    let intersection: IntersectionObserver | null = null;
    const onWindowResize = () => {
      resize();
      refreshPalette();
      rebuildLinkStyles();
      if (!raf) draw();
    };

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resize();
        refreshPalette();
        rebuildLinkStyles();
        if (!raf) draw();
      });
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', onWindowResize);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      intersection = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          sync();
        },
        { threshold: 0.02 },
      );
      intersection.observe(canvas);
    }

    // The theme toggle flips the `dark` class on <html>; the motion mode
    // flips `data-motion`. Either one re-resolves the palette and the loop.
    const onAttrs = () => {
      refreshPalette();
      rebuildLinkStyles();
      sync();
    };
    const mutation = new MutationObserver(onAttrs);
    mutation.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion', 'class'],
    });

    document.addEventListener('visibilitychange', sync);

    return () => {
      stop();
      resizeObserver?.disconnect();
      intersection?.disconnect();
      window.removeEventListener('resize', onWindowResize);
      mutation.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div className="globe-scene" aria-hidden="true">
      <span className="globe-shadow" />
      <div className="globe">
        <canvas ref={canvasRef} className="globe-net" />
      </div>
    </div>
  );
}
