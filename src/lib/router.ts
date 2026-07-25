import { useEffect, useState } from 'react';

/**
 * Resolve the absolute path of the current page relative to the site root,
 * accounting for GitHub Pages project-site subpaths (e.g. /izen/).
 * Returns a normalized path beginning with "/" and no trailing slash
 * (except for the root itself).
 */
function resolvePath(): string {
  const raw = window.location.pathname.replace(/\/+$/, '') || '/';
  return raw || '/';
}

export function usePath() {
  const [path, setPath] = useState<string>(() => resolvePath());

  useEffect(() => {
    const onChange = () => setPath(resolvePath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return path;
}

/**
 * Navigate to a site-relative path without a full reload.
 * `to` is an absolute path beginning with "/" (e.g. "/izen/").
 */
export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/** Prefix an asset/link path with the site base. */
export function sitePath(p: string): string {
  if (p.startsWith('/')) return p;
  return '/' + p;
}

/** External link helper that opens in a new tab safely. */
export function externalHref(url: string): string {
  return url;
}
