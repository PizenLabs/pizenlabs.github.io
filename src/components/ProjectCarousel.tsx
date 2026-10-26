import { useEffect, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@/lib/icons';
import { PROJECTS } from '@/lib/content';

/**
 * The project carousel.
 *
 * Three cards are on stage at once, in a fixed left / centre / right
 * arrangement. The centre card is full size and fully opaque; its neighbours
 * are scaled down and dimmed, so the row reads as a lens on one project
 * rather than as a strip of equal tiles.
 *
 * There is no autoplay. Nothing moves until the visitor presses an arrow, a
 * dot, or swipes, and every step is a single transform transition — no
 * per-frame JavaScript, no endlessly animating layer.
 *
 * The track is three copies of the catalogue laid side by side. A step slides
 * it exactly one card and then reindexes the list (and the slot) by one copy
 * while transitions are off. Because the copies are identical, the reset
 * frame is pixel-identical to the frame before it, so the sequence can rotate
 * in either direction forever with only three copies in the DOM.
 */

const ITEMS = PROJECTS.filter((project) => !project.hidden);

/** Identical passes across the track. The middle pass is the visible buffer. */
const COPIES = 3;

/** First card index of the middle pass. A step always returns here. */
const MIDDLE = ITEMS.length;

/** Matches --pc-dur; the reindex must wait for both track + card transitions to land. */
const STEP_MS = 720;

/** Horizontal travel, in pixels, that counts as a swipe rather than a click. */
const SWIPE_PX = 44;

function wrap(value: number, size: number) {
  return ((value % size) + size) % size;
}

export default function ProjectCarousel() {
  const count = ITEMS.length;

  const stepTimer = useRef<number | null>(null);
  const lock = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const [slot, setSlot] = useState(MIDDLE);
  const [sliding, setSliding] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    return () => {
      if (stepTimer.current) window.clearTimeout(stepTimer.current);
    };
  }, []);

  if (count === 0) return null;

  const activeIndex = wrap(slot, count);
  const activeProject = ITEMS[activeIndex];

  const moveTo = (nextSlot: number) => {
    if (count < 2 || lock.current || nextSlot === slot) return;

    lock.current = true;
    setSliding(true);
    setSlot(nextSlot);

    stepTimer.current = window.setTimeout(() => {
      setResetting(true);
      setSlot((current) => {
        // The middle pass is the home position. Step off either edge and the
        // identical pass next to it lands in exactly the same pixels.
        if (current < MIDDLE) return current + count;
        if (current >= MIDDLE + count) return current - count;
        return current;
      });

      // Two frames: paint the reset with transitions off, then re-enable the
      // slide for the next press.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setResetting(false);
          setSliding(false);
          lock.current = false;
        });
      });
    }, STEP_MS);
  };

  const stepBy = (delta: 1 | -1) => {
    if (lock.current) return;
    moveTo(slot + delta);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    stepBy(event.key === 'ArrowRight' ? 1 : -1);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, y: event.clientY };
    dragged.current = false;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const from = dragStart.current;
    dragStart.current = null;
    if (!from) return;

    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;

    // Vertical travel belongs to the page, not to the carousel.
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;

    dragged.current = true;
    stepBy(dx < 0 ? 1 : -1);
  };

  // A swipe ends over a card, so the browser would follow its link. The drag
  // is a gesture, not a click; swallow the one click that follows it.
  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragged.current) return;
    dragged.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const cards = Array.from({ length: count * COPIES }, (_, index) => {
    const project = ITEMS[wrap(index, count)];
    const distance = index - slot;
    const visible = Math.abs(distance) <= 1;

    return {
      index,
      project,
      active: distance === 0,
      visible,
    };
  });

  return (
    <div
      className={`project-carousel${sliding ? ' is-sliding' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      aria-keyshortcuts="ArrowLeft ArrowRight"
      onKeyDown={onKeyDown}
    >
      <div
        className="project-carousel-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <div
          className={`project-carousel-track${resetting ? ' is-resetting' : ''}`}
          style={{ ['--pc-slot' as string]: slot }}
        >
          {cards.map(({ index, project, active, visible }) => (
            <a
              key={index}
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="project-carousel-card panel group"
              data-active={active ? 'true' : undefined}
              data-visible={visible ? 'true' : undefined}
              aria-hidden={active ? undefined : true}
              tabIndex={active ? undefined : -1}
              style={{
                ['--pc-scale' as string]: active ? 1 : 0.82,
                ['--pc-fade' as string]: active ? 1 : visible ? 0.52 : 0,
                ['--pc-z' as string]: active ? 3 : 2,
                ['--pc-shift' as string]: active ? '0rem' : '0.25rem',
              }}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="label tabular-nums text-bone-500">
                  {String(index % count + 1).padStart(2, '0')}
                </span>
                <span className="label text-forest-300">{project.kind}</span>
              </span>

              <span className="project-carousel-name">{project.name}</span>

              <span className="project-carousel-summary">{project.summary}</span>

              <span className="project-carousel-meta">{project.meta}</span>

              <span className="project-carousel-open">
                Open
                <ArrowUpRight
                  className="btn-arrow h-3 w-3 text-bone-500 transition-colors duration-300 group-hover:text-forest-300"
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => stepBy(-1)}
          disabled={sliding || count < 2}
          aria-label="Previous project"
          className="dial-nav project-carousel-arrow"
          data-dir="prev"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => stepBy(1)}
          disabled={sliding || count < 2}
          aria-label="Next project"
          className="dial-nav project-carousel-arrow"
          data-dir="next"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* The controls sit below the stage and never move with the cards. */}
      <div className="project-carousel-controls">
        <p className="font-mono text-[0.6875rem] tracking-wide text-bone-500">
          <span className="tabular-nums text-bone-300">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-bone-500"> / {String(count).padStart(2, '0')}</span>
          <span className="ml-2 hidden sm:inline">— {activeProject.name}</span>
        </p>

        <div className="flex items-center gap-2" role="group" aria-label="Choose a project">
          {ITEMS.map((project, index) => (
            <button
              key={project.name}
              type="button"
              aria-current={index === activeIndex ? 'true' : undefined}
              aria-label={`Show ${project.name}`}
              disabled={sliding}
              onClick={() => moveTo(MIDDLE + index)}
              className="dial-dot"
            />
          ))}
        </div>

        <p className="hidden font-mono text-[0.6875rem] tracking-wide text-bone-500 md:block">
          Use ← → to rotate
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {activeProject.name}, project {activeIndex + 1} of {count}
      </p>
    </div>
  );
}
