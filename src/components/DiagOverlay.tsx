import { useEffect, useState } from 'react';

/**
 * Temporary field diagnostic, mounted only when the URL carries `?diag`.
 * It reports the exact facts needed to debug "animations don't display"
 * on a machine we cannot reproduce on: engine, IntersectionObserver
 * support, reduced-motion, reveal state, and whether the keyframe
 * animations actually resolved in this browser's CSS engine.
 *
 * Not a dev-only module: the failing machines test the deployed site,
 * so this must ship to production. It renders nothing without `?diag`.
 */
function snapshot() {
  const q = (s: string) => document.querySelectorAll(s).length;
  const cs = (sel: string, prop: string) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).getPropertyValue(prop).trim() : 'missing';
  };
  return {
    ua: navigator.userAgent,
    io: String(typeof IntersectionObserver),
    reducedMotion: String(matchMedia('(prefers-reduced-motion: reduce)').matches),
    motion: document.documentElement.getAttribute('data-motion') ?? 'unset',
    reveal: `${q('.reveal.is-visible')}/${q('.reveal')}`,
    mask: `${q('.line-mask.is-visible')}/${q('.line-mask')}`,
    auroraAnim: cs('.aurora-a', 'animation-name'),
    signalAnim: cs('.signal-dot', 'animation-name'),
    // The tape of digits is text, so "did it render" is a question about
    // the resolved animation and the row count, not about a request.
    piRows: `${q('.pi-row')} rows`,
    piAnim: cs('.pi-row', 'animation-name'),
    piDuration: cs('.pi-row', 'animation-duration'),
    // The dial rail is positioned by custom properties, so the question is
    // whether the track index and the position actually reached the element.
    dials: `${q('.dial')} dials`,
    dialTransform: cs('.dial', 'transform'),
    dialAnim: cs('.dial', 'animation-name'),
    fonts: document.fonts ? document.fonts.status : 'unsupported',
  };
}

export default function DiagOverlay() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!window.location.search.includes('diag')) return;
    setShow(true);
    setData(snapshot());
    const id = window.setInterval(() => setData(snapshot()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 8,
        bottom: 8,
        zIndex: 9999,
        maxWidth: 'min(92vw, 560px)',
        background: '#000',
        color: '#0f0',
        font: '11px/1.5 monospace',
        padding: '10px 12px',
        borderRadius: 8,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
      aria-hidden="true"
    >
      {JSON.stringify(data, null, 1)}
    </div>
  );
}
