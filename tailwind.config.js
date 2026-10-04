/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  /**
   * Theme selection is a class on <html>, not a media query.
   *
   * `media` would compile every `dark:` variant against the OS and make it
   * impossible for the header toggle to disagree with the visitor's system
   * setting. The class is set before first paint by the inline script in
   * index.html, then owned by src/lib/useTheme.ts.
   */
  darkMode: 'class',

  theme: {
    extend: {
      /**
       * Every step resolves through a custom property that src/index.css
       * defines once per theme, so `ink-600` means "the 600 step of the surface
       * ramp for whichever theme is active".
       *
       * A step's NUMBER never means "how light" — it means "how far from the
       * content". `ink` runs 900 (page base) → 400 (hairlines); `bone` runs 50
       * (strongest text) → 500 (smallest tertiary copy). The two themes invert
       * the ramps, which is what lets one class name serve both:
       * `text-bone-50` is near-black on light and near-white on dark, and
       * `bg-ink-600` is a dark chip on dark and a light chip on light. Read the
       * token block in index.css before changing a step.
       *
       * The values are `rgb(var(--token) / <alpha-value>)` rather than a bare
       * `var(--token)` on purpose: that form is what lets the opacity modifier
       * compose, so `bg-ink-600/60` compiles to `rgb(var(--ink-600) / 0.6)`.
       * With a plain `var()` Tailwind cannot parse the color and emits nothing
       * at all — the class fails silently rather than erroring.
       */
      colors: {
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
        },
        forest: {
          500: 'rgb(var(--forest-500) / <alpha-value>)',
          400: 'rgb(var(--forest-400) / <alpha-value>)',
          300: 'rgb(var(--forest-300) / <alpha-value>)',
          200: 'rgb(var(--forest-200) / <alpha-value>)',
        },
        bone: {
          50: 'rgb(var(--bone-50) / <alpha-value>)',
          100: 'rgb(var(--bone-100) / <alpha-value>)',
          200: 'rgb(var(--bone-200) / <alpha-value>)',
          300: 'rgb(var(--bone-300) / <alpha-value>)',
          // 400 and 500 carry the tertiary copy (section labels, project meta,
          // footer text) at 11–14px, so both must clear WCAG AA's 4.5:1 against
          // the page background AND against the .panel surface, which is one
          // step lighter in both themes. Ratios in the comments are against
          // #0a0e0c (dark) and #f7f9f8 (light) respectively.
          400: 'rgb(var(--bone-400) / <alpha-value>)', // 5.2:1 / 5.3:1
          500: 'rgb(var(--bone-500) / <alpha-value>)', // 5.1:1 — and 4.7:1 on .panel
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};