/**
 * One scroll pipeline for the whole page.
 *
 * Why this is shared rather than a hook per consumer: parallax, the progress
 * bar, and the header's scrolled state each used to attach their own passive
 * listener and schedule their own `requestAnimationFrame`. Three listeners and
 * three independent rAF callbacks per frame meant three style-recalc triggers
 * per scroll tick and no guarantee they ran in the same frame. Now there is one
 * listener, one rAF, one style write batch, and every consumer sees the exact
 * same `ScrollState` for the frame it is drawing.
 *
 * The two properties that matter for smoothness:
 *
 * - **No layout read inside the scroll frame.** `scrollHeight` is cached and
 *   only re-measured from a ResizeObserver on <body> and the window `resize`
 *   event. Reading it per frame forces a synchronous layout on every scroll
 *   tick, which is the classic scroll-jank source: the browser must finish
 *   layout before it can apply the compositor transform you just asked for.
 * - **Layout-only writes.** Consumers write `transform` and nothing else, so
 *   the frame stays compositor-only.
 *
 * `ScrollState` is a single frozen object reused across frames when nothing
 * changed, so consumers can cheaply skip redundant writes.
 */

export type ScrollState = {
  /** Window scroll offset in px. */
  readonly y: number;
  /** Viewport height in px. */
  readonly viewport: number;
  /** Total scrollable distance in px (scrollHeight - viewport). */
  readonly scrollable: number;
  /** 0..1 through the document. */
  readonly progress: number;
};

type Subscriber = (state: ScrollState) => void;

const EMPTY: ScrollState = { y: 0, viewport: 0, scrollable: 0, progress: 0 };

const subscribers = new Set<Subscriber>();

let frame = 0;
let lastY = -1;
let viewport = 0;
let scrollable = 0;
let current: ScrollState = EMPTY;
let attached = false;

/**
 * Re-read the two layout-dependent numbers. Deliberately never called from the
 * scroll handler — only from resize/ResizeObserver, where one forced layout per
 * event is free.
 */
export function measureScroll() {
  viewport = window.innerHeight;
  const height = document.documentElement.scrollHeight;
  scrollable = Math.max(0, height - viewport);
  publish();
}

function publish() {
  current = Object.freeze({
    y: window.scrollY,
    viewport,
    scrollable,
    progress: scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0,
  });
  for (const fn of subscribers) fn(current);
}

function flush() {
  frame = 0;
  const y = window.scrollY;
  // Nothing moved: skip the write batch entirely. A scroll event that resolves
  // to the same offset (rubber-band overscroll, momentum settling) is free.
  if (y === lastY) return;
  lastY = y;
  publish();
}

function schedule() {
  wake();
  if (!frame) frame = requestAnimationFrame(flush);
}

let observer: ResizeObserver | null = null;

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  // A reader moving the mouse over a page that is not scrolling is just as
  // present as one who is scrolling.
  window.addEventListener('pointermove', wake, { passive: true });
  wake();

  // A route swap or a late webfont changes the document height without any
  // window resize firing. Observing <body> is what keeps `scrollable` (and
  // therefore the progress bar) correct on navigation and after font swap.
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => measureScroll());
    observer.observe(document.body);
  }

  measureScroll();
}

function onResize() {
  measureScroll();
  // The offset itself may have changed with the viewport (a collapsed address
  // bar, a rotated device), so publish even if the offsets match.
  lastY = -1;
  publish();
}

/**
 * Subscribe to the shared scroll pipeline. Returns an unsubscribe function.
 * The returned state is the live object and must not be mutated.
 */
export function subscribeScroll(fn: Subscriber): () => void {
  subscribers.add(fn);
  attach();
  // Hand the new subscriber the current frame immediately so it paints
  // correctly on mount instead of waiting for the first scroll event.
  fn(current);
  return () => {
    subscribers.delete(fn);
  };
}

/* ── Idle detection ─────────────────────────────────────────────────────────
   Owned here rather than in Backdrop so that "is the visitor still around?"
   rides the same listeners everything else already uses. Backdrop attaching its
   own scroll and pointermove handlers on top of these would have doubled the
   page's listener count for a single boolean.

   `onIdleChange` fires only on an actual transition, so a consumer can write an
   attribute without re-rendering anything. */

const IDLE_MS = 1500;

const idleListeners = new Set<(idle: boolean) => void>();
let idleTimer = 0;
let idle = false;

function setIdle(next: boolean) {
  if (next === idle) return;
  idle = next;
  for (const fn of idleListeners) fn(idle);
}

/** Any of these means the visitor is present and watching. */
function wake() {
  if (idle) setIdle(false);
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => setIdle(true), IDLE_MS);
}

export function subscribeIdle(fn: (idle: boolean) => void): () => void {
  idleListeners.add(fn);
  fn(idle);
  return () => {
    idleListeners.delete(fn);
  };
}

export function getIdle(): boolean {
  return idle;
}