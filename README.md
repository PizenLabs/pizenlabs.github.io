# PizenLabs

Marketing site for PizenLabs. React + TypeScript + Tailwind, built with Vite and
deployed to GitHub Pages.

```bash
npm install
npm run dev        # local dev server
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

`npm run build` also runs `scripts/postbuild.mjs`, which writes `dist/404.html`
(a copy of the SPA shell, so deep links resolve client-side) and `dist/.nojekyll`.

## Where things live

```
src/
  pages/                     PizenLabsHome, Articles, Article — route bodies
  components/                PageShell (the frame), Backdrop, cards, ArticleBody
  lib/content.ts             all copy, links, projects and articles — edit here
  lib/icons.ts               the only lucide-react import surface
  lib/pi.ts                  the digits of pi, for the ambient tape
  lib/router.ts              pathname → route, kept in sync with History
  lib/usePageMeta.ts         per-route title, description, canonical, og:*
  lib/useMotion.ts           the site's motion mode (full / calm)
  lib/useReveal.ts           one IntersectionObserver for the whole page
  lib/useScrollProgress.ts   rAF-coalesced scroll progress bar
  lib/useSpotlight.ts        pointer-following card highlight
  lib/useTheme.ts            light/dark state, persistence, OS preference
  index.css                 design tokens, components, animations
  styles/fonts.css          GENERATED — see Fonts below
scripts/fetch-fonts.mjs     regenerates fonts.css and public/fonts/
```

Copy lives in `src/lib/content.ts` so wording changes never require touching
markup or styles.

## The dial rail

The hero's current-projects slider: circular medallions on a horizontal rail.
The rail is a ring — each project appears once per lap, and the active
medallion sits at the front, in the centre of the viewport, with the next one
just off the right edge.

```
.dial-rail   the whole block: the label, the rail, the caption
.rail        the viewport the medallions travel through
.rail-track  the strip the medallions are placed on
.dial        one medallion
.dial-face   its lit face
.dial-sweep  the arc that runs round its rim
.dial-orbit  the dashed ring behind it
.dial-nav    the round navigation buttons
.dial-dot    the round position markers
```

### The geometry

A medallion's position is `(--t - --pos) * --step`, where `--t` is its track
index and `--pos` the track index of the one at the front. The track is
periodic — the content of a track index is `index % count` — so the rail has no
end, and the arrangement in front of the visitor at one end of it is the
arrangement at the other.

That periodicity is also how the wrap works. When the rail reaches the end of
its content, the position is snapped back **without** a transition: the
medallions in front of the visitor do not move, only the bookkeeping does. A
transition there would make the rail jump a whole lap.

The size of a medallion and the distance between them are CSS values, sized
against the viewport height as well as its width, because the hero has to fit
the screen it is on.

### A ring with two medallions

With only two projects, the ring puts the same project on both sides of the
front one — there are only two positions there. So one copy of each project is
dropped: the copy nearest the front wins, and a tie goes to the copy on the
right, which is the one that peeks in at the edge. The dropped copy is dimmed
to nothing rather than deleted, because it is the one that slides in from the
left when the rail turns back, and it fades up as it arrives.

## The pi tape

The ambient layer: the digits of pi, scrolling across the screen behind the
content. Five rows, a few percent opacity, travelling at different speeds so
they cross rather than move as a block.

Each row holds two identical strips of digits and slides by exactly half its
own width, so the second strip lands where the first one was: the tape is
endless and the seam is invisible. It is a `transform` keyframe, so the whole
layer costs the compositor a texture and nothing else — no layout, no paint,
and no JavaScript on a timer.

The digits live in `lib/pi.ts` as a literal, a thousand of them, written in
blocks of sixty-four so the source stays readable.

## The hero's composition

The hero is the whole first screen. Nothing below it is in view: the
sub-projects, the philosophy, the articles and the footer all arrive on the
scroll, which is what makes the page read as a landing page rather than as a
document.

It is deliberately off-centre, and it is the only place the layout breaks its
own rules:

- a narrow **rail** in the left margin carries the page's index, vertically,
  and runs a hairline down the height of the copy;
- the copy sits hard against it;
- the **dial rail** carries the current projects on the right, with the
  medallion centred in its column and the next project peeking in at the
  edge, so the composition reads as a spread rather than a symmetrical
  template.

The hero is `min-h-[100svh]`, so it fills the screen it is on and grows only
when the content genuinely will not fit. Everything in it is sized against the
viewport height as well as its width: a tall window gets a large medallion, a
short laptop a small one, and neither pushes the copy off the bottom.

The headline's `.display` size is set so its longest masked line
("human-computer") fits on one line *in the hero's copy column* at every
breakpoint. The column is narrower than the page because the dial rail sits
beside it, and a wrapped mask line defeats the effect.

## Routes and articles

| Path | Page |
| --- | --- |
| `/` | `pages/PizenLabsHome.tsx` |
| `/articles` | `pages/Articles.tsx` — index, filtered by category |
| `/articles/<slug>` | `pages/Article.tsx` — one post |
| anything else | the 404 in `App.tsx` |

`App.tsx` matches on `window.location.pathname`. Links are plain `<a href>`, so
each route is a fresh document and scroll restoration, the back button, and the
browser's own fragment handling stay native. GitHub Pages serves `dist/404.html`
— the SPA shell — for any deep link, so no rewrite rule is needed.

Header anchors are therefore written site-absolute (`/#philosophy`): from
`/articles`, a bare `#philosophy` would resolve to `/articles#philosophy`. That
cross-page fragment is resolved before React mounts the target, so `App.tsx`
re-issues the scroll after the route renders — `html`'s `scroll-padding-top`
already keeps the section clear of the fixed header.

### Adding a post

Add an entry to `ARTICLES` in `src/lib/content.ts`. Nothing else has to change:
the slug becomes the URL, the category becomes a filter chip, the date drives
the ordering, and the reading time is counted from the body rather than stored.

```ts
{
  slug: 'why-we-publish-everything',
  title: 'Why we publish everything',
  standfirst: 'One sentence — the card, the post intro, and the meta description.',
  category: 'Company',
  published: '2026-11-02',
  body: [
    { type: 'paragraph', text: 'Prose with `code`, **strong**, and [a link](https://example.com).' },
    { type: 'heading', text: 'A section' },
    { type: 'list', items: ['First point', 'Second point'] },
  ],
}
```

`body` is a block union, not Markdown: `components/ArticleBody.tsx` renders it
with no parser and no `dangerouslySetInnerHTML`, so inline syntax that does not
match — an unbalanced `**`, a stray backtick — renders as the text the author
wrote instead of breaking the post. Categories are derived from the posts
(`ARTICLE_CATEGORIES`), so a post under a new category becomes its own chip
without editing the page.

Per-route `<title>`, description, canonical, and og tags are set by
`usePageMeta`. That is client-side: a crawler fetching a deep link still sees
the home page's tags from the static shell, which only real prerendering could
fix.

## Theming

Light and dark are two token sets behind one class. `:root` is light, `.dark` on
`<html>` is dark, and both are declared in the token block at the top of
`src/index.css`. Nothing below that block hardcodes a color — that is what makes
a theme change a one-class flip instead of a sweep through every component.

A scale's number never means "how light"; it means "how far from the content".
`ink` runs 900 (page base) → 400 (hairlines), `bone` runs 50 (strongest text) →
500 (smallest tertiary copy), and the ramps invert between themes. So
`text-bone-50` is near-black on light and near-white on dark, and no component
needed a `dark:` variant. `darkMode: 'class'` exists only for the two
`dark:` utilities in the theme toggle.

Three rules to keep it working:

- **Palette steps are RGB channel triplets, not colors.** They are declared
  `247 249 248` so `tailwind.config.js` can emit
  `rgb(var(--ink-900) / <alpha-value>)`, which is what makes `bg-ink-600/60`
  compose. Anywhere CSS needs one as a value it must be wrapped — `rgb(var(--x))`.
  A bare `var(--x)` there is invalid at computed-value time, which throws
  nothing and looks fine in the cascade: the declaration is simply dropped and
  the property falls back to inherited or transparent.
- **Effect tokens (`--wash`, panel fills, grid, auroras, glows) are ordinary
  colors.** They are only used from that stylesheet, never by a utility class, so
  they stay hex/rgba and are used bare.
- **Both themes must clear WCAG AA.** Every text step is checked against the page
  background *and* the `.panel` surface, which is one step lighter in both
  themes. Ratios are recorded beside `bone.400`/`bone.500` and `forest.*` in
  `index.css` — re-check them when changing a step.

### How the theme is resolved

1. A short inline script in `<head>` (see `index.html`) reads
   `localStorage['pizenlabs-theme']`, falls back to `prefers-color-scheme`, and
   puts the class on `<html>` **before the first paint**. It has to be inline and
   synchronous: a hashed external file would be a second render-blocking request,
   and the alternative is a white flash for dark-theme visitors.
2. `useTheme()` reads that class back rather than re-deriving the preference, so
   the first React render cannot disagree with what is already painted.
3. With no stored choice the OS preference stays **live** — it keeps following
   the system until the visitor uses the toggle, which writes the choice to
   localStorage. A `storage` listener keeps other tabs in sync.
4. `<meta name="theme-color">` is rewritten on every change, because the
   media-query form of that tag can only follow the OS and would ignore a manual
   override.

## Fonts

`src/styles/fonts.css` is **generated**. Do not edit it by hand. To refresh the
fonts (e.g. after changing weights), edit the Google Fonts query in
`scripts/fetch-fonts.mjs` and run:

```bash
node scripts/fetch-fonts.mjs public/fonts src/styles/fonts.css
```

This pulls only the `latin` subset as a variable woff2 — one file per family
instead of one per weight — and writes matching `@font-face` rules. The files are
committed, so a normal build needs no network access.

Self-hosting replaced a render-blocking stylesheet request to
`fonts.googleapis.com` plus the font requests it triggered. All three faces are
preloaded from `index.html` and finish downloading before first paint.

## Performance notes

Decisions here are deliberate; several look unusual until you know why.

- **The theme bootstrap is inline, not a module.** It is the one script that must
  beat first paint; see Theming above.
- **Switching themes is instant, with no cross-fade.** Animating it means
  transitioning color on every element, and the usual implementation injects a
  `!important` transition onto `<html>` for ~200 ms — which replaces the
  `transition` property outright and so breaks the hover and reveal motion for
  that window. Instant is also the reduced-motion-safe default.
- **`optimizeDeps.include: ['lucide-react']`.** The previous config *excluded*
  lucide-react, which made the browser walk its ~1500 ES modules one request at a
  time: a cold dev load of the home page issued 1465 requests / ~8.2 MB. Now 42.
- **One fixed `Backdrop`.** The grid and the two aurora fields live in a single
  `position: fixed` layer. They used to be a set of full-viewport gradient divs
  inside each section, so every scroll repainted several large surfaces.
- **Auroras use `transform` keyframes only**, no `filter: blur()`. Blur is a
  per-frame paint cost; a radial gradient is already soft and composites free.
- **No permanent `will-change`.** It was previously set on every `.reveal`
  element, pinning each into its own GPU layer for the life of the page. Opacity
  and transform transitions already promote to the compositor.
- **Never fade the LCP candidate from `opacity: 0`.** Chrome will not report an
  element whose computed opacity is still 0, so animating the hero's intro
  paragraph delayed the measured LCP from 552 ms to 1436 ms. The hero uses
  `.reveal-shift` (transform only) and `.line-mask` (clipped transform) for its
  primary text, and reserves opacity fades for secondary elements.
- **`content-visibility: auto` was tried and reverted.** It removes the deferred
  subtree from Chromium's accessibility tree until it is rendered, which hid the
  closing section's heading and link from assistive tech. On a page this small
  the saving is not worth it.
- **Scroll and pointer handlers never call `setState` directly.** They are
  passive, coalesce into one `requestAnimationFrame`, and skip the write when the
  rounded value has not changed. Card highlights write CSS custom properties
  instead of re-rendering.
- **Icons are re-exported from `src/lib/icons.ts`** so the lucide dependency is
  explicit and auditable.
- **The tape of digits is text, not an image.** A thousand digits would be a
  few kilobytes as a font-rendered string and a request otherwise, and it
  costs the compositor one texture. It moves with `transform` alone, so
  scrolling costs nothing.
- **The medallions are positioned with custom properties, not React state per
  frame.** The rail's position is one number; the medallions read it through
  `--t` and `--pos`, and CSS does the arithmetic. Turning the rail is a state
  write and a style write, not a re-render per medallion.

## Motion

All motion is `transform` / `opacity` only, and every animation ends in a
defined state — nothing is left invisible or mid-transition. Scroll reveals
use one shared `IntersectionObserver` that unobserves each element once it has
fired, so the browser stops doing work as soon as the page settles.

### Motion modes

`<html data-motion>` is the single switch for everything that moves:

| Mode | What moves |
| --- | --- |
| `full` | Everything: the tape of digits scrolls, the backdrop drifts, the dial's arc turns, sections reveal as they scroll into view, the layers parallax. |
| `calm` | The slow, harmless layer only — the drifting backdrop, the blinking caret, the pulsing signal dot, hover feedback. The entrance motion is skipped, and the two large continuous movements (the tape, the arc) are frozen. |

The mode is written by the bootstrap script in `index.html` before the first
paint, so the page never starts in one mode and settles into another, and
`lib/useMotion.ts` reads the attribute back rather than re-deriving it.

- **The OS preference decides the mode, and there is no toggle.** The page's
  motion is part of the page, the way the type is: the digits of pi scroll
  from the first paint, because that is what the site is. The one control a
  visitor has over it is the one their operating system already offers them.
- **The OS preference only softens the motion.** With
  `prefers-reduced-motion: reduce`, the site runs in `calm`. It used to
  answer that preference with a blanket
  `animation-duration: 0.01ms !important` on every element, which froze the
  whole page: measured in WebKit, the rendered page changed by **zero pixels
  over six seconds**. A page with no motion at all reads as broken rather than
  as "reduced", and the OS switch is blunt — it silences the harmless ambient
  layer along with the movement that actually causes trouble. So `calm`
  freezes the two movements that are large and endless, and leaves the rest.
- **The drift has to be visible to count as animation.** The backdrop used to
  travel 2% over 36s, which measured as a **1.6px shift over twelve
  seconds** — technically animated, visually a still image. It now crosses a
  visible distance in a quarter of the time.

### Cross-browser hardening

- **No custom property inside a shorthand.** WebKit builds that drop a
  declaration containing a `var()` from `animation` drop it from `transition`
  too, silently and without an error. Transitions are therefore declared as
  `transition-property` / `transition-duration` / `transition-timing-function`,
  which accept `var()` in every engine. Where two properties need different
  durations, the longhand takes a matching list.
- **The reveal cannot be stranded.** A scroll watchdog reveals anything the
  observer has not handled, so a broken `IntersectionObserver` — the shape of
  the bug in several embedded WebViews — no longer leaves whole sections
  invisible. Measured against a stub observer that never reports: six
  elements used to stay invisible, none do now.
- **`?diag` reports the truth from the field.** The overlay prints the user
  agent, the motion mode, the reduced-motion state, the reveal counts and the
  resolved animation names — including the tape's row count and duration, and
  the dial rail's resolved transform, since the rail is positioned by custom
  properties and "did it move" is a question about computed styles.

## Accessibility

Skip link, one `<h1>`, ordered headings, visible focus rings, labelled external
links with `rel="noreferrer noopener"`, and `alt`/`aria-hidden` set on every
image and icon. The theme toggle is a `role="switch"` with `aria-checked` rather
than a button whose accessible name changes on activation — a control that
renames itself is awkward to announce, and `aria-checked` is readable without
re-focusing it.

The dial rail is a carousel: the group carries `aria-roledescription`, it takes
the arrow keys, and only the medallion at the front is exposed to assistive
technology — the others are `aria-hidden` and out of the tab order, so a
screen reader is told which project is at the front rather than being left to
read four of them at once. A polite status region announces the change.

All body and label text clears WCAG AA (4.5:1) against both the page background
and the `.panel` surface **in both themes** — see the contrast notes in
`tailwind.config.js` and the token block in `index.css` before changing
`bone.400` or `bone.500`. The skip link was also corrected while theming: it was
near-black on the brand green (2.4:1) and is now `--accent-bright` with
`--accent-contrast`, 8.8:1 on light and 10:1 on dark.