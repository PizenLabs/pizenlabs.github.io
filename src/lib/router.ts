import { useEffect, useState } from 'react';

/**
 * Resolve the current pathname, normalized (leading slash, no trailing slash).
 */
function resolvePath(): string {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

/**
 * Current path, kept in sync with the History API.
 *
 * Only `popstate` is listened for, and the state is a single string compared by
 * React — so a history navigation costs one render, not a re-render of the tree.
 */
export function usePath() {
  const [path, setPath] = useState<string>(resolvePath);

  useEffect(() => {
    const onChange = () => setPath(resolvePath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return path;
}