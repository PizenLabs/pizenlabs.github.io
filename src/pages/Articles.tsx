import { useState } from 'react';
import { ARTICLE_CATEGORIES, ARTICLES, ARTICLES_PATH } from '@/lib/content';
import ArticleCard from '@/components/ArticleCard';
import PageShell from '@/components/PageShell';
import { usePageMeta } from '@/lib/usePageMeta';

/** Newest first. Module scope, so filtering never re-sorts on a render. */
const BY_DATE = [...ARTICLES].sort((a, b) => b.published.localeCompare(a.published));

const HEADLINE = [
  { text: 'Reasoning,', accent: false },
  { text: 'written down.', accent: true },
] as const;

export default function Articles() {
  const [category, setCategory] = useState<string | null>(null);
  const visible = category
    ? BY_DATE.filter((article) => article.category === category)
    : BY_DATE;

  usePageMeta({
    title: 'Articles — PizenLabs',
    description:
      'Working notes from the lab: what we tried, what broke, and what we would do again.',
    path: ARTICLES_PATH,
  });

  return (
    <PageShell>
      {/* Hero */}
      <section
        className="relative pt-32 sm:pt-40 lg:pt-44"
        style={{ ['--reveal-step' as string]: '45ms' }}
      >
        <div className="container-x pb-20 sm:pb-24">
          <p
            className="reveal flex items-center gap-2.5"
            style={{ ['--reveal-i' as string]: 0 }}
          >
            <span className="signal-dot" aria-hidden="true" />
            <span className="label text-forest-300">Articles</span>
          </p>

          <h1 className="display mt-7 max-w-4xl text-bone-50">
            {HEADLINE.map((line, i) => (
              <span
                key={line.text}
                className="line-mask"
                style={{ ['--reveal-i' as string]: i + 1 }}
              >
                <span className={line.accent ? 'text-forest-300' : undefined}>
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          {/* Transform-only entrance: see .reveal-shift in index.css. */}
          <p
            className="lede reveal-shift mt-8"
            style={{ ['--reveal-i' as string]: 3 }}
          >
            What we tried, what broke, and what we would do differently. Every post
            is open to correction — if something here is wrong, tell us.
          </p>
        </div>
      </section>

      {/* Category filter + posts. Categories come from the posts themselves, so
          publishing under a new one needs no change to this file. */}
      <section className="rule-t">
        <div className="container-x section-y !pb-24 sm:!pb-28">
          <div className="reveal mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter articles by category"
            >
              <button
                type="button"
                className="chip"
                aria-pressed={category === null}
                onClick={() => setCategory(null)}
              >
                All
              </button>
              {ARTICLE_CATEGORIES.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="chip"
                  aria-pressed={category === name}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Result count in a live region: filtering is the only interaction on
                this page that changes the list without navigating. */}
            <p className="label text-bone-500" aria-live="polite">
              {visible.length} {visible.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {visible.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}