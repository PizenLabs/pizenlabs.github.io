import { useEffect } from 'react';
import { SITE_ORIGIN } from '@/lib/content';

export type PageMeta = {
  title: string;
  description: string;
  /** Site-absolute path, e.g. '/articles/introducing-pizenlabs'. */
  path: string;
  /** og:type — a post is 'article', everything else 'website'. */
  type?: 'website' | 'article';
  /** ISO date. Sets article:published_time and feeds the Article JSON-LD. */
  publishedTime?: string;
  /**
   * Structured-data node merged into an Article graph (headline etc. come
   * from title/description/path). One script tag is kept in head and removed
   * when a route renders without it, so graphs never leak across pages.
   */
  jsonLd?: Record<string, unknown>;
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
  publishedTime,
  jsonLd,
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
    if (publishedTime) tags.push(['article:published_time', publishedTime]);

    for (const [key, content] of tags) {
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[name="${key}"], meta[property="${key}"]`
      );
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name', key);
        el.dataset.pageMeta = '1';
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }
    // A post's published_time must not linger after navigating home.
    // Only tags this hook created carry data-page-meta, so static head tags
    // are never touched.
    if (!publishedTime) {
      document.head
        .querySelector('meta[property="article:published_time"][data-page-meta]')
        ?.remove();
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = SITE_ORIGIN + path;

    const ORG_ID = `${SITE_ORIGIN}/#org`;
    const url = SITE_ORIGIN + path;
    let ld = document.head.querySelector<HTMLScriptElement>(
      'script[data-page-meta="ld+json"]'
    );
    if (jsonLd) {
      const graph = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        ...(publishedTime ? { datePublished: publishedTime } : {}),
        ...jsonLd,
      };
      if (!ld) {
        ld = document.createElement('script');
        ld.type = 'application/ld+json';
        ld.dataset.pageMeta = 'ld+json';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(graph);
    } else {
      ld?.remove();
    }
  }, [title, description, path, type, publishedTime, jsonLd]);
}
