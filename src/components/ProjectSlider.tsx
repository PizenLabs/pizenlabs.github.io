import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@/lib/icons';
import { PROJECTS, type Project } from '@/lib/content';
import { useMotion } from '@/lib/useMotion';

/**
 * The hero's current-projects wheel: a vertical cylinder of project cards that
 * spins continuously. The active card sits in the centre, larger and fully
 * opaque, while the ones above and below shrink and fade. Manual controls
 * pause the spin and snap to a chosen card; it resumes on its own afterwards.
 */
const ITEMS = PROJECTS.filter((project) => !project.hidden);

const SPEED = 0.00045; // track units per millisecond

export default function ProjectSlider() {
  const count = ITEMS.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { mode } = useMotion();

  // The spin is pure ambient motion: it must hold no CPU while it cannot be
  // seen (hidden tab, scrolled out of view) and must not run at all when the
  // visitor asked for less motion. Without this the rAF loop rewrote `--pos`
  // 60x/sec forever — including in a background tab on a phone.
  const [tabHidden, setTabHidden] = useState(() => document.hidden);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.02,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mod = useCallback((n: number) => ((n % count) + count) % count, [count]);

  const snapTo = useCallback(
    (targetIndex: number) => {
      pausedRef.current = true;
      setPaused(true);
      // choose the track copy nearest the current position
      const current = posRef.current;
      let best: number | null = null;
      for (let t = -1; t <= count; t += 1) {
        if (mod(t) !== targetIndex) continue;
        if (best === null || Math.abs(t - current) <= Math.abs(best - current)) best = t;
      }
      const target = best !== null ? best : targetIndex;
      posRef.current = target;
      if (containerRef.current) {
        containerRef.current.classList.add('is-snapping');
        containerRef.current.style.setProperty('--pos', String(target));
        window.setTimeout(() => containerRef.current?.classList.remove('is-snapping'), 600);
      }
      setActiveIndex(targetIndex);

      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = window.setTimeout(() => {
        if (!hoveredRef.current) {
          pausedRef.current = false;
          setPaused(false);
        }
      }, 3000);
    },
    [count, mod]
  );

  const stepBy = useCallback(
    (delta: number) => {
      snapTo(mod(activeIndex + delta));
    },
    [activeIndex, mod, snapTo]
  );

  // Continuous spin. Gated on visibility, on-screen presence, hover/manual
  // pause, and motion mode — any one of them stops the loop entirely, so an
  // idle or hidden wheel holds no rAF, no style recalc, no React work.
  useEffect(() => {
    if (count <= 1 || paused || tabHidden || !onScreen || mode !== 'full') return;
    lastTimeRef.current = null;
    const loop = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      posRef.current += SPEED * dt;
      if (containerRef.current) {
        containerRef.current.style.setProperty('--pos', String(posRef.current));
      }
      const nearest = mod(Math.round(posRef.current));
      setActiveIndex((prev) => (prev === nearest ? prev : nearest));

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [count, mod, paused, tabHidden, onScreen, mode]);

  // Pause/resume on hover.
  const handleEnter = () => {
    hoveredRef.current = true;
    pausedRef.current = true;
    setPaused(true);
  };
  const handleLeave = () => {
    hoveredRef.current = false;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      if (!hoveredRef.current) {
        pausedRef.current = false;
        setPaused(false);
      }
    }, 600);
  };

  // Swipe (horizontal) to avoid fighting vertical scroll.
  const startX = useRef<number | null>(null);
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const from = startX.current;
    startX.current = null;
    if (from === null) return;
    const delta = event.clientX - from;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) stepBy(1);
    else stepBy(-1);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      stepBy(1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      stepBy(-1);
    }
  };

  const instances = useMemo(() => {
    if (count === 0) return [];
    const out: Array<{ t: number; project: Project; index: number }> = [];
    for (let t = -2; t <= count + 1; t += 1) {
      const index = mod(t);
      out.push({ t, project: ITEMS[index], index });
    }
    return out;
  }, [count, mod]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div
      className="current-projects"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocusCapture={handleEnter}
      onBlurCapture={handleLeave}
    >
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="label text-bone-500">Current projects</h2>
        <p className="font-mono text-[0.6875rem] tabular-nums text-bone-500">
          {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
      </div>

      <div
        ref={containerRef}
        className="wheel focus:outline-none"
        style={{ ['--pos' as string]: 0 }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Current projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="wheel-track">
          {instances.map(({ t, project }) => (
            <a
              key={t}
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="wheel-card"
              aria-hidden={mod(t) !== activeIndex ? true : undefined}
              tabIndex={mod(t) === activeIndex ? 0 : -1}
              style={{ ['--t' as string]: t }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label text-bone-500">
                  {String(mod(t) + 1).padStart(2, '0')}
                </span>
                <span className="label text-forest-300">{project.kind}</span>
              </div>

              <span className="wheel-name">{project.name}</span>

              <span className="wheel-summary">{project.summary}</span>

              <span className="wheel-meta">{project.meta}</span>

              <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-widest text-bone-400 transition-colors group-hover:text-forest-200">
                Open
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="group" aria-label="Choose a project">
          {ITEMS.map((project, index) => (
            <button
              key={project.name}
              type="button"
              aria-current={index === activeIndex ? 'true' : undefined}
              aria-label={`Show ${project.name}`}
              onClick={() => snapTo(index)}
              className="dial-dot"
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => stepBy(-1)} className="dial-nav" aria-label="Previous project">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => stepBy(1)} className="dial-nav" aria-label="Next project">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
