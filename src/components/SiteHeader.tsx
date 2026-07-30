import { navigate } from '@/lib/router';

export default function SiteHeader() {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md border-b border-ink-500/60"
      style={{ background: 'linear-gradient(180deg, rgba(10,14,12,0.85) 0%, rgba(10,14,12,0.55) 100%)' }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group"
          aria-label="PizenLabs home"
        >
          <img
            src="/pizenlabs.svg"
            alt="PizenLabs"
            className="w-6 h-6"
            aria-hidden
          />
          <span className="font-sans text-sm tracking-tightish text-bone-50 group-hover:text-forest-200 transition-colors">
            PizenLabs
          </span>
        </button>

        <nav className="flex items-center gap-6 text-sm">
          <a
            href="https://github.com/PizenLabs"
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-xs tracking-[0.2em] text-bone-300 hover:text-forest-300 transition-colors"
          >
            GITHUB
          </a>
        </nav>
      </div>
    </header>
  );
}
