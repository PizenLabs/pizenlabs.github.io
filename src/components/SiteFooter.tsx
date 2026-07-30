/**
 * Minimal footer. The lab name and GitHub link.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-ink-500/60 bg-ink-900">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="font-sans text-sm text-bone-100 mb-2">PizenLabs</p>
            <p className="text-xs text-bone-400 leading-relaxed max-w-xs">
              A small open-source laboratory building tools for clearer
              human-computer collaboration.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-bone-500 mb-3">
              SOURCE
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/PizenLabs"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-bone-200 hover:text-forest-300 transition-colors"
                >
                  github.com/PizenLabs
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ink-500/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-bone-500">
            © {new Date().getFullYear()} PIZENLABS — OPEN SOURCE
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-bone-500">
            BUILT QUIETLY. READ THE SOURCE.
          </p>
        </div>
      </div>
    </footer>
  );
}
