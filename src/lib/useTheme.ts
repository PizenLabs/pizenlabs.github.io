import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

/** Must match the key in the bootstrap script in index.html. */
const STORAGE_KEY = 'pizenlabs-theme';

/**
 * Page base per theme, mirroring `--ink-900`. Duplicated here because
 * `<meta name="theme-color">` has to be set from JS to follow a manual
 * override — the media-query form of that tag can only ever follow the OS.
 */
const THEME_COLOR: Record<Theme, string> = {
  light: '#f7f9f8',
  dark: '#0a0e0c',
};

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** The visitor's explicit choice, or null while they are still following the OS. */
function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function writeStored(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage denied: the choice still applies for this visit, it just will not
    // survive a reload. Not worth surfacing to the visitor.
  }
}

function systemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

/**
 * Pushes a resolved theme onto the document: the `dark` class the Tailwind
 * `dark:` variants and the CSS tokens key off, plus the browser chrome color.
 */
function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document
    .getElementById('theme-color')
    ?.setAttribute('content', THEME_COLOR[theme]);
}

/**
 * Light/dark theme for the whole site.
 *
 * State lives in one place and is written to exactly three places: the class on
 * <html>, the `theme-color` meta, and localStorage.
 *
 * The initial value is read back off the document rather than re-derived: the
 * inline bootstrap script in index.html has already resolved the preference
 * before React mounts, so reading the class is what guarantees the first render
 * agrees with what is already on screen instead of briefly disagreeing with it.
 *
 * Until the visitor picks a theme, the OS preference stays live — switching the
 * system to dark at sunset switches the site, and the choice stops overriding
 * only once it is made.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [choice, setChoice] = useState<Theme | null>(readStored);

  // Re-assert on every change rather than only in the click handler: this also
  // covers the OS listener and cross-tab sync below, which change theme without
  // going through `toggle`.
  useEffect(() => {
    apply(theme);
  }, [theme]);

  // Follow the OS for as long as there is no stored choice.
  useEffect(() => {
    if (choice) return;

    const mq = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    mq.addEventListener('change', onChange);
    // The preference can change between the bootstrap script and mount.
    setTheme(mq.matches ? 'dark' : 'light');
    return () => mq.removeEventListener('change', onChange);
  }, [choice]);

  // A second tab changing the theme updates this one.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const next = readStored();
      setChoice(next);
      setTheme(next ?? systemTheme());
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setChoice(next);
    writeStored(next);
  }, [theme]);

  return { theme, toggle };
}