import { navigate } from '@/lib/router';

type Props = {
  variant?: 'pizen' | 'izen';
};

/**
 * Minimal site header. On the PizenLabs root it shows the lab identity and a
 * quiet link to Izen. On the Izen page it is not used (Izen has its own nav).
 */
export default function SiteHeader({ variant = 'pizen' }: Props) {
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
          {variant === 'izen' && (
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone-400 ml-1">
              / IZEN
            </span>
          )}
        </button>

        <nav className="flex items-center gap-6 text-sm">
          <button
            onClick={() => navigate('/izen/')}
            className="font-mono text-xs tracking-[0.2em] text-bone-300 hover:text-forest-300 transition-colors"
          >
            IZEN
          </button>
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
