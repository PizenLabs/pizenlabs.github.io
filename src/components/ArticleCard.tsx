import { ArrowUpRight } from '@/lib/icons';
import { useSpotlight } from '@/lib/useSpotlight';
import {
  ARTICLES_PATH,
  DATE_FORMAT,
  readingMinutes,
  type Article,
} from '@/lib/content';

/**
 * An article row on /articles. A plain `<a>` rather than a router push: each
 * route is a fresh document, which keeps scroll restoration and the back button
 * native instead of something this site has to reimplement.
 */
export default function ArticleCard({
  article,
  index,
}: {
  article: Article;
  index: number;
}) {
  const { ref, onPointerMove } = useSpotlight<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={`${ARTICLES_PATH}/${article.slug}`}
      onPointerMove={onPointerMove}
      className="panel spotlight group reveal flex flex-col gap-6 p-7 !rounded-xl sm:flex-row sm:items-center sm:gap-10 sm:p-8"
      style={{ ['--reveal-i' as string]: index }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="label text-forest-300">{article.category}</span>
          <span className="h-px w-6 bg-bone-400/20" aria-hidden="true" />
          <span className="label text-bone-500">
            <time dateTime={article.published}>
              {DATE_FORMAT.format(new Date(article.published))}
            </time>
          </span>
        </div>

        <h3 className="mt-4 font-sans text-2xl font-medium tracking-tight text-bone-50 transition-colors duration-300 group-hover:text-forest-200">
          {article.title}
        </h3>

        <p className="mt-3 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-bone-300">
          {article.standfirst}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
        <span className="label text-bone-500">
          {readingMinutes(article)} min read
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-bone-500 transition-colors duration-300 group-hover:text-forest-300"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}