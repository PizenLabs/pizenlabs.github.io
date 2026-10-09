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
  lib/router.ts              pathname → route, kept in sync with History
  lib/scrollPipeline.ts      THE scroll listener + rAF + idle state (shared)
  lib/usePageMeta.ts         per-route title, description, canonical, og:*
  lib/useReveal.ts           one IntersectionObserver for the whole page
  lib/useScrollProgress.ts   progress bar, subscribed to the scroll pipeline
  lib/useParallax.ts         scroll-linked layer offset, same pipeline
  lib/useSpotlight.ts        pointer-following card highlight
  lib/useTheme.ts            light/dark state, persistence, OS preference
  index.css                 design tokens, components, animations
  styles/fonts.css          GENERATED — see Fonts below
scripts/fetch-fonts.mjs     regenerates fonts.css and public/fonts/
```

Copy lives in `src/lib/content.ts` so wording changes never require touching
markup or styles.

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
- **One scroll pipeline, not one listener per effect.** `lib/scrollPipeline.ts`
  owns the single passive `scroll` listener and the single `requestAnimationFrame`.
  Parallax (three layers), the progress bar, and the header's scrolled state
  subscribe to it. Before this they each attached their own listener and
  scheduled their own rAF, so one scroll frame meant three style-write batches
  that could land in different frames.
- **`scrollHeight` is never read in the scroll frame.** It is cached and refreshed
  from a `ResizeObserver` on `<body>` plus the window `resize` event. Reading it
  per frame forces a synchronous layout on every scroll tick — the classic
  scroll-jank cause, because the browser must finish layout before it can apply
  the compositor transform you just requested.
- **Ambient motion stops when the page does.** The drift layers cost a compositor
  pass per frame for as long as they run. After ~1.5s with no scroll or pointer
  movement they get `animation: none` (not `paused`), so their layers leave the
  layer tree and their textures are released. Any input restarts them. Idle
  detection lives in the scroll pipeline, so it costs no extra listeners.
- **The signal pulse is a scaled pseudo-element, not an animated `box-shadow`.**
  An animating shadow spread repaints the header on every frame of the loop and
  invalidates whatever paints behind it. Scale + opacity on `::after` is one
  compositor transform instead.
- **Icons are re-exported from `src/lib/icons.ts`** so the lucide dependency is
  explicit and auditable.

## Motion

All motion is `transform` / `opacity` only, and
`@media (prefers-reduced-motion: reduce)` resolves every animation to its end
state — nothing is left invisible or mid-transition. Scroll reveals use one
shared `IntersectionObserver` that unobserves each element once it has fired, so
the browser stops doing work as soon as the page settles.

### Entrances are `@keyframes`, not transitions

This is the one thing worth understanding before editing a reveal.

A **transition** only animates if the browser already holds a "before" computed
style to interpolate from. When the class that triggers it is applied before
that snapshot exists, the element jumps straight to its end state and the motion
is never seen — identical CSS, different engine, different result. That is how
this site came to read as a static page in some browsers while animating in
others.

A **keyframes animation** starts from its own `from` frame the moment the class
lands, so it cannot be skipped that way. Two rules follow from it:

- **The animation lives on `.is-visible`, never on the base class.** On the base
  class it would start at page load for every element — including those below the
  fold — so they would all finish animating into nothing before the visitor
  scrolled to them, and then appear with no motion at all.
- **Fill mode is `backwards`.** It holds the `from` frame through the stagger
  delay, then releases onto `.is-visible`'s own `opacity: 1` / `transform: none`
  (already the end state). `forwards`/`both` also pin the end frame, but keep the
  finished animation — and its compositor layer — alive for the life of the page.

Both directions matter. The reveal is the only thing standing between a visitor
and a page whose content is `opacity: 0`, so an entrance that silently fails is
worse than no entrance at all. `useReveal` therefore also guarantees every class
arrives: no `IntersectionObserver`, reduced motion, or elements already on screen
at mount all reveal immediately, and a repeating safety sweep with a widening
slack catches anything the observer misses.

To check a change without a browser: `getComputedStyle` on a `.reveal` further
down the page should report a non-`none` `animation-name`, and its final computed
`opacity` should be `1` after scrolling past it.

## Accessibility

Skip link, one `<h1>`, ordered headings, visible focus rings, labelled external
links with `rel="noreferrer noopener"`, and `alt`/`aria-hidden` set on every
image and icon. The theme toggle is a `role="switch"` with `aria-checked` rather
than a button whose accessible name changes on activation — a control that
renames itself is awkward to announce, and `aria-checked` is readable without
re-focusing it.

All body and label text clears WCAG AA (4.5:1) against both the page background
and the `.panel` surface **in both themes** — see the contrast notes in
`tailwind.config.js` and the token block in `index.css` before changing
`bone.400` or `bone.500`. The skip link was also corrected while theming: it was
near-black on the brand green (2.4:1) and is now `--accent-bright` with
`--accent-contrast`, 8.8:1 on light and 10:1 on dark.