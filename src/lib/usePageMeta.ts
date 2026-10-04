import { useEffect } from 'react';
import { SITE_ORIGIN } from '@/lib/content';

export type PageMeta = {
  title: string;
  description: string;
  /** Site-absolute path, e.g. '/articles/introducing-pizenlabs'. */
  path: string;
  /** og:type — a post is 'article', everything else 'website'. */
  type?: 'website' | 'article';
};

/**
 * Per-route document head.
 *
 * index.html carries the home page's title and tags, and GitHub Pages serves
 * that same shell as 404.html for any deep link — so without this, opening
 * /articles/<slug> would announce itself as the home page. Tags are updated in
 * place when they already exist, so a tag added to index.html is rewritten
 * rather than duplicated, and the og: prefix keeps them on `property`.
 */
export function usePageMeta({
  title,
  description,
  path,
  type = 'website',
}: PageMeta) {
  useEffect(() => {
    document.title = title;

    const tags: [string, string][] = [
      ['description', description],
      ['og:title', title],
      ['og:description', description],
      ['og:url', SITE_ORIGIN + path],
      ['og:type', type],
    ];

    for (const [key, content] of tags) {
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[name="${key}"], meta[property="${key}"]`
      );
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(key.startsWith('og:') ? 'property' : 'name', key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = SITE_ORIGIN + path;
  }, [title, description, path, type]);
}