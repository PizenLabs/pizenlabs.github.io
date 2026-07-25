import { useEffect, useState } from 'react';
import { navigate } from '@/lib/router';
import PixelEarth from '@/components/PixelEarth';
import {
  ArrowLeft,
  ArrowUpRight,
  GitBranch,
  BookOpen,
  Layers,
  Eye,
  ShieldCheck,
  Undo2,
} from 'lucide-react';

const MODES = [
  { name: 'ASK', boundary: 'READ ONLY', desc: 'Questions without side effects. The system observes; it does not touch.' },
  { name: 'PLAN', boundary: 'STRUCTURE INTENT', desc: 'Propose a path before any change. Intent becomes a reviewable structure.' },
  { name: 'BUILD', boundary: 'MUTATION ENABLED · CHECKPOINT REQUIRED', desc: 'Changes are made inside a reversible checkpoint. Nothing is committed without consent.' },
  { name: 'INVESTIGATE', boundary: 'EVIDENCE FIRST', desc: 'Trace failure to its source. Conclusions follow evidence, not assumption.' },
  { name: 'REVIEW', boundary: 'AUDIT THE RESULT', desc: 'Verify the outcome against intent before accepting it.' },
];

export default function IzenExperience() {
  const [activeMode, setActiveMode] = useState<number>(0);
  const [earthSize, setEarthSize] = useState<number>(460);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setEarthSize(280);
      else if (w < 1024) setEarthSize(380);
      else setEarthSize(480);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      className="min-h-screen text-bone-100 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #070a09 0%, #0a0f0d 40%, #0d1a13 100%)',
      }}
    >
      {/* Ambient field */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at center top, rgba(31,90,61,0.32) 0%, rgba(63,166,106,0.06) 35%, rgba(10,14,12,0) 60%)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[40vh] opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center bottom, rgba(31,90,61,0.18) 0%, rgba(10,14,12,0) 65%)',
          }}
        />
        <div className="absolute inset-0 dot-bg opacity-[0.15]" />
      </div>

      {/* Izen-specific nav */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-ink-900/70 border-b border-forest-900/60">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
            aria-label="Back to PizenLabs"
          >
            <ArrowLeft className="w-4 h-4 text-bone-400 group-hover:text-forest-300 transition-colors" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone-400 group-hover:text-forest-300 transition-colors">
              PIZENLABS
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm tracking-tightish text-bone-50">IZEN</span>
            <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-forest-300 animate-pulse-slow" />
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#philosophy" className="font-mono text-[11px] tracking-[0.2em] text-bone-300 hover:text-forest-300 transition-colors">
              PHILOSOPHY
            </a>
            <a href="#architecture" className="font-mono text-[11px] tracking-[0.2em] text-bone-300 hover:text-forest-300 transition-colors">
              ARCHITECTURE
            </a>
            <a
              href="https://github.com/PizenLabs/izen"
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-[11px] tracking-[0.2em] text-bone-300 hover:text-forest-300 transition-colors"
            >
              SOURCE
            </a>
          </nav>
        </div>
      </header>

      {/* ── STATE 1: OBSERVE ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 w-full grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <p className="font-mono text-[11px] tracking-[0.3em] text-forest-300 mb-6 animate-fade-in">
              STATE 01 / OBSERVE
            </p>
            <h1 className="font-sans text-6xl sm:text-8xl lg:text-9xl font-medium tracking-tighter leading-[0.9] text-bone-50">
              IZEN
            </h1>
            <p className="mt-8 font-sans text-2xl sm:text-3xl tracking-tightish leading-snug text-bone-100 text-balance max-w-md">
              AI should strengthen human judgment,
              <span className="text-forest-300"> not replace it.</span>
            </p>
            <p className="mt-6 text-bone-400 leading-relaxed max-w-sm">
              Humans remain in control. The system observes, structures, and
              acts only within boundaries you define.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.2em] text-bone-500">
              <span>LOCAL-FIRST</span>
              <span className="text-bone-700">·</span>
              <span>BOUNDED</span>
              <span className="text-bone-700">·</span>
              <span>REVERSIBLE</span>
              <span className="text-bone-700">·</span>
              <span>OPEN SOURCE</span>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <PixelEarth size={earthSize} grid={24} intensity={1} />
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-bone-500 whitespace-nowrap"
              >
                THE WORLD, MADE LEGIBLE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATE 2: UNDERSTAND ── */}
      <section
        id="philosophy"
        className="relative py-28 sm:py-40 border-t border-forest-900/50"
        style={{
          background:
            'linear-gradient(180deg, rgba(13,26,19,0.25) 0%, rgba(10,15,13,0) 60%)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-forest-300 mb-10 reveal">
            STATE 02 / UNDERSTAND
          </p>
          <h2 className="font-sans text-3xl sm:text-5xl lg:text-6xl tracking-tighter leading-tight text-bone-50 text-balance max-w-3xl reveal">
            The system does not decide for you.
            <br />
            <span className="text-bone-400">It helps you see what you are deciding.</span>
          </h2>

          <div className="mt-16 grid gap-6 sm:grid-cols-3 reveal">
            {[
              { from: 'COMPLEXITY', to: 'STRUCTURE', note: 'Patterns surface. Noise settles.' },
              { from: 'STRUCTURE', to: 'CONTEXT', note: 'Structure becomes a decision space.' },
              { from: 'CONTEXT', to: 'ACTION', note: 'Understanding precedes action.' },
            ].map((s, i) => (
              <div
                key={s.from}
                className="rounded-xl border border-ink-500/60 p-6"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(15,21,19,0.85) 0%, rgba(10,14,12,0.6) 100%)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-bone-500">
                    0{i + 1}
                  </span>
                </div>
                <p className="font-mono text-sm text-bone-300 mb-1">{s.from}</p>
                <div className="text-forest-300 mb-1">↓</div>
                <p className="font-mono text-sm text-forest-200 mb-4">{s.to}</p>
                <p className="text-sm text-bone-400 leading-relaxed">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATE 3: CONTROL ── */}
      <section id="architecture" className="relative py-28 sm:py-40 border-t border-forest-900/50">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-forest-300 mb-10 reveal">
            STATE 03 / CONTROL
          </p>
          <h2 className="font-sans text-3xl sm:text-5xl tracking-tighter leading-tight text-bone-50 text-balance max-w-2xl reveal">
            Power without boundaries is liability.
          </h2>
          <p className="mt-6 text-bone-400 max-w-xl leading-relaxed reveal">
            Modes are not personalities. They are operational boundaries — the
            rules the system must obey while it works.
          </p>

          <div className="mt-14 grid gap-4 reveal">
            {MODES.map((m, i) => (
              <button
                key={m.name}
                onMouseEnter={() => setActiveMode(i)}
                onFocus={() => setActiveMode(i)}
                onClick={() => setActiveMode(i)}
                className={`group text-left grid gap-4 sm:grid-cols-[180px_1fr_auto] items-center px-5 sm:px-7 py-5 rounded-xl border transition-all ${
                  activeMode === i
                    ? 'border-forest-400/50'
                    : 'border-ink-500/60 hover:border-forest-400/30'
                }`}
                style={{
                  background:
                    activeMode === i
                      ? 'linear-gradient(135deg, rgba(31,90,61,0.22) 0%, rgba(15,21,19,0.7) 60%, rgba(10,14,12,0.5) 100%)'
                      : 'linear-gradient(135deg, rgba(15,21,19,0.6) 0%, rgba(10,14,12,0.4) 100%)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      activeMode === i ? 'bg-forest-300' : 'bg-bone-700'
                    }`}
                  />
                  <span className="font-mono text-base tracking-[0.15em] text-bone-50">
                    {m.name}
                  </span>
                </div>
                <span className="font-mono text-[11px] tracking-[0.2em] text-forest-300">
                  {m.boundary}
                </span>
                <p className="text-sm text-bone-400 leading-relaxed sm:text-right sm:max-w-md">
                  {m.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATE 4: RETURN ── */}
      <section className="relative py-28 sm:py-40 border-t border-forest-900/50">
        <div className="absolute inset-0 dot-bg opacity-20 pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-forest-300 mb-10 reveal">
            STATE 04 / RETURN
          </p>
          <h2 className="font-sans text-3xl sm:text-5xl lg:text-6xl tracking-tighter leading-tight text-bone-50 text-balance reveal">
            The system can act.
            <br />
            <span className="text-forest-300">The human decides when it should.</span>
          </h2>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-4 reveal">
            <a
              href="https://github.com/PizenLabs/izen"
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-forest-500/15 border border-forest-400/40 text-forest-200 hover:bg-forest-500/25 hover:border-forest-300/60 transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              <span className="font-mono text-xs tracking-[0.15em]">EXPLORE THE SOURCE</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#philosophy"
              className="inline-flex items-center gap-2 px-5 py-3 text-bone-300 hover:text-forest-300 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-mono text-xs tracking-[0.15em]">READ THE PHILOSOPHY</span>
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center gap-2 px-5 py-3 text-bone-300 hover:text-forest-300 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span className="font-mono text-xs tracking-[0.15em]">VIEW THE ARCHITECTURE</span>
            </a>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3 reveal">
            {[
              { icon: Eye, label: 'Observe', note: 'See the system as it is.' },
              { icon: ShieldCheck, label: 'Control', note: 'Boundaries hold the line.' },
              { icon: Undo2, label: 'Return', note: 'Every action is reversible.' },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-ink-500/50 p-5" style={{ background: 'linear-gradient(160deg, rgba(15,21,19,0.7) 0%, rgba(10,14,12,0.5) 100%)' }}>
                <c.icon className="w-5 h-5 text-forest-300 mb-3 mx-auto" />
                <p className="font-mono text-xs tracking-[0.2em] text-bone-200 mb-1">{c.label.toUpperCase()}</p>
                <p className="text-xs text-bone-400">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Izen footer (distinct, quieter) */}
      <footer
        className="border-t border-forest-900/60"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,14,12,0) 0%, #070a09 100%)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-bone-400 hover:text-forest-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] tracking-[0.25em]">PIZENLABS</span>
            </button>
            <span className="text-bone-700">/</span>
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone-200">IZEN</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/PizenLabs/izen"
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-[10px] tracking-[0.25em] text-bone-400 hover:text-forest-300 transition-colors"
            >
              SOURCE
            </a>
            <span className="font-mono text-[10px] tracking-[0.25em] text-bone-500">
              OPEN SOURCE · MIT
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
