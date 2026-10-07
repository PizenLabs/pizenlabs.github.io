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
    reveal: `${q('.reveal.is-visible')}/${q('.reveal')}`,
    mask: `${q('.line-mask.is-visible')}/${q('.line-mask')}`,
    termOpacity: cs('.term-line', 'opacity'),
    termAnim: cs('.term-line', 'animation-name'),
    auroraAnim: cs('.aurora-a', 'animation-name'),
    signalAnim: cs('.signal-dot', 'animation-name'),
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
