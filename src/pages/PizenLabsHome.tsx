import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { ArrowUpRight, GitBranch, Terminal, Eye } from 'lucide-react';

export default function PizenLabsHome() {
  return (
    <div
      className="min-h-screen text-bone-100 relative"
      style={{
        background:
          'linear-gradient(180deg, #0a0e0c 0%, #0d1411 45%, #0a0e0c 100%)',
      }}
    >
      <SiteHeader />

      {/* ── IDENTITY ── */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" aria-hidden />
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full opacity-50 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(63,166,106,0.14) 0%, rgba(31,90,61,0.06) 45%, rgba(63,166,106,0) 65%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,14,12,0) 0%, rgba(13,26,19,0.35) 100%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-forest-300 mb-6 animate-fade-in">
            OPEN-SOURCE LABORATORY
          </p>
          <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] text-bone-50 text-balance max-w-4xl">
            Tools for clearer
            <br />
            human-computer
            <br />
            <span className="text-forest-300">collaboration.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-bone-300 leading-relaxed">
            PizenLabs is a small, independent laboratory building open-source
            technology with a point of view. We explore ideas, then we build the
            systems that embody them.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/PizenLabs"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 px-5 py-3 text-bone-300 hover:text-forest-300 transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              <span className="font-mono text-xs tracking-[0.15em]">READ THE SOURCE</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section
        className="relative py-24 sm:py-32 border-t border-ink-500/50"
        style={{
          background:
            'linear-gradient(180deg, rgba(13,26,19,0.18) 0%, rgba(10,14,12,0) 70%)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-bone-500 mb-10 reveal">
            02 / PHILOSOPHY
          </p>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
            <h2 className="font-sans text-3xl sm:text-5xl tracking-tightish leading-tight text-bone-50 text-balance reveal">
              Technology should increase human capability
              <span className="text-bone-400"> without </span>
              removing human agency.
            </h2>
            <div className="space-y-6 reveal">
              <p className="text-bone-300 leading-relaxed">
                We build systems that make complexity legible — not systems that
                decide for you. The human remains the source of truth; the
                machine is an assistant, never an authority.
              </p>
              <p className="text-bone-400 leading-relaxed">
                Our work is open source because understanding is part of the
                product. You should be able to read what runs.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* ── OPEN SOURCE ── */}
      <section className="relative py-24 sm:py-32 border-t border-ink-500/50">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-bone-500 mb-10 reveal">
            04 / OPEN SOURCE
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Eye, label: 'Explore', note: 'Read what runs.' },
              { icon: Terminal, label: 'Read', note: 'Understanding is part of the product.' },
              { icon: GitBranch, label: 'Build', note: 'Fork, extend, remix.' },
              { icon: ArrowUpRight, label: 'Contribute', note: 'The work is open.' },
            ].map((item) => (
              <div
                key={item.label}
                className="reveal rounded-xl border border-ink-500/60 p-6 hover:border-forest-400/30 transition-colors"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(20,28,25,0.7) 0%, rgba(10,14,12,0.5) 100%)',
                }}
              >
                <item.icon className="w-5 h-5 text-forest-300 mb-4" />
                <p className="font-sans text-lg text-bone-100 mb-1">{item.label}</p>
                <p className="text-sm text-bone-400 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
