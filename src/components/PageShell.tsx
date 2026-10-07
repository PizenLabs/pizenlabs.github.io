import type { ReactNode } from 'react';
import Backdrop from '@/components/Backdrop';
import DiagOverlay from '@/components/DiagOverlay';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

/**
 * The frame every route renders inside: skip link, backdrop, scroll progress,
 * header, footer. Only the page body differs between routes, and `id="top"` is
 * here because the footer's back-to-top and the skip link both target it.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="relative flex min-h-screen flex-col text-bone-100">
      <a
        href="#main"
        className="label skip-link sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-4 focus:z-[70] focus:px-4 focus:py-3"
      >
        Skip to content
      </a>

      <Backdrop />
      {/* Scroll progress: compositor-only scaleX driven by useScrollProgress. */}
      <div className="progress-bar" aria-hidden="true" />

      <SiteHeader />

      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>

      <SiteFooter />
      <DiagOverlay />
    </div>
  );
}