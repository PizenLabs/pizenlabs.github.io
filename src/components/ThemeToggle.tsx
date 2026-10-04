import { Moon, Sun } from '@/lib/icons';
import { useTheme } from '@/lib/useTheme';

/**
 * Header control that swaps the site's token set between light and dark.
 *
 * Exposed as a switch rather than a button with a changing label: with
 * `aria-checked` the state is readable without re-focusing the control, which
 * matters because a button whose accessible name mutates on activation is
 * awkward to announce. The visible icons are decorative — the switch carries
 * the semantics.
 *
 * Both icons stay mounted and cross-fade. Rendering one or the other would
 * remount the node on every toggle, and an icon that appears from nothing reads
 * as a glitch; the scale difference does the same job as a rotation without
 * paying for one. The whole pair collapses to its end state under
 * prefers-reduced-motion via the global override in index.css.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="Dark theme"
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
      className="btn btn-ghost h-9 !w-9 !px-0"
    >
      <span className="relative block h-3.5 w-3.5" aria-hidden="true">
        <Sun className="absolute inset-0 h-3.5 w-3.5 scale-100 transition duration-300 ease-out dark:scale-75 dark:opacity-0" />
        <Moon className="absolute inset-0 h-3.5 w-3.5 -scale-75 opacity-0 transition duration-300 ease-out dark:scale-100 dark:opacity-100" />
      </span>
    </button>
  );
}