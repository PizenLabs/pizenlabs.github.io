import { ArrowLeft, ArrowUpRight } from '@/lib/icons';
import {
  ARTICLES_PATH,
  DATE_FORMAT,
  GITHUB_URL,
  readingMinutes,
  type Article as ArticlePost,
} from '@/lib/content';
import ArticleBody from '@/components/ArticleBody';
import PageShell from '@/components/PageShell';
import { usePageMeta } from '@/lib/usePageMeta';

/**
 * One post. Receives its article from the router, so the page itself is a pure
 * render — the slug is never re-parsed here.
 *
 * Module scope: the empty override object keeps a stable identity so the head
 * effect below runs once per article, not once per render.
 */
const ARTICLE_LD = {};

export default function Article({ article }: { article: ArticlePost }) {
  usePageMeta({
    title: `${article.title} — PizenLabs`,
    description: article.standfirst,
    path: `${ARTICLES_PATH}/${article.slug}`,
    type: 'article',
    publishedTime: article.published,
    jsonLd: ARTICLE_LD,
  });

  return (
    <PageShell>
      <article className="container-x pt-28 pb-24 sm:pt-36 sm:pb-28">
        <div className="max-w-3xl">
          <a
            href={ARTICLES_PATH}
            className="label link-underline inline-flex items-center gap-2 text-bone-400 transition-colors duration-200 hover:text-bone-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All articles
          </a>

          <div
            className="reveal mt-9 flex items-center gap-3"
            style={{ ['--reveal-i' as string]: 0 }}
          >
            <span className="label text-forest-300">{article.category}</span>
            <span className="h-px w-6 bg-bone-400/20" aria-hidden="true" />
            <span className="label text-bone-500">
              <time dateTime={article.published}>
                {DATE_FORMAT.format(new Date(article.published))}
              </time>
              <span aria-hidden="true"> · </span>
              {readingMinutes(article)} min read
            </span>
          </div>

          {/* Transform-only entrance so the title stays reportable as the LCP
              candidate from first paint — see .reveal-shift in index.css. */}
          <h1
            className="headline-2 reveal-shift mt-6 text-bone-50"
            style={{ ['--reveal-i' as string]: 1 }}
          >
            {article.title}
          </h1>

          <p
            className="lede reveal-shift mt-6"
            style={{ ['--reveal-i' as string]: 2 }}
          >
            {article.standfirst}
          </p>
        </div>

        <div className="mt-14 max-w-3xl border-t border-ink-500/50 pt-12">
          <ArticleBody blocks={article.body} />
        </div>

        <div className="panel mt-16 flex max-w-3xl flex-col items-start gap-7 !rounded-xl px-7 py-9 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10">
          <div>
            <p className="label mb-4 text-forest-300">Check our work</p>
            <h2 className="font-sans text-xl font-medium tracking-tight text-bone-50">
              Nothing here is a black box. Read it, run it, tell us what is wrong.
            </h2>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary shrink-0"
          >
            Read the source
            <ArrowUpRight className="btn-arrow h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </article>
    </PageShell>
  );
}