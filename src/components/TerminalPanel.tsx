/**
 * Decorative terminal panel for the hero.
 *
 * The lines are static markup revealed by a staggered CSS animation rather than
 * a typing effect. A typing effect needs a JS timer that mutates text on every
 * tick, which keeps the main thread awake during the most performance-sensitive
 * moment on the page — the first paint.
 */
const ROWS: Array<[string, string]> = [
  ['mode', 'open source laboratory'],
  ['builds', 'tools for clearer hci'],
  ['method', 'read → build → publish'],
  ['stack', 'typescript · react · web'],
  ['status', 'open to contributions'],
];

export default function TerminalPanel() {
  return (
    <div className="panel spotlight reveal overflow-hidden !rounded-xl" style={{ ['--reveal-i' as string]: 3 }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-ink-400/50 bg-ink-700/40 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-bone-400/30" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-bone-400/30" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-bone-400/30" aria-hidden="true" />
        <span className="label ml-2 text-bone-500">~/pizenlabs</span>
      </div>

      {/* Output. aria-hidden: decorative restatement of the page copy. */}
      <div className="px-4 py-5 sm:px-5" aria-hidden="true">
        <p className="term-line font-mono text-[0.75rem] text-bone-300" style={{ ['--reveal-i' as string]: 0 }}>
          <span className="text-forest-300">$</span> pizenlabs about
        </p>

        <dl className="mt-3 space-y-1.5">
          {ROWS.map(([key, value], i) => (
            <div
              key={key}
              className="term-line flex gap-3 font-mono text-[0.75rem] leading-relaxed"
              style={{ ['--reveal-i' as string]: i + 1 }}
            >
              <dt className="w-16 shrink-0 text-bone-500">{key}</dt>
              <dd className="text-bone-200">{value}</dd>
            </div>
          ))}
        </dl>

        <p
          className="term-line mt-4 font-mono text-[0.75rem] text-bone-400"
          style={{ ['--reveal-i' as string]: ROWS.length + 1 }}
        >
          <span className="text-forest-300">→</span>{' '}
          <span className="caret" />
        </p>
      </div>
    </div>
  );
}