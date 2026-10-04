import { useEffect } from 'react';
import { usePath } from '@/lib/router';
import { useReveal } from '@/lib/useReveal';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { ARTICLES, ARTICLES_PATH } from '@/lib/content';
import PageShell from '@/components/PageShell';
import Article from '@/pages/Article';
import Articles from '@/pages/Articles';
import PizenLabsHome from '@/pages/PizenLabsHome';

/** /articles/<slug>. Anything else under /articles is the index or a 404. */
const ARTICLE_ROUTE = new RegExp(`^${ARTICLES_PATH}/([^/]+)$`);

function NotFound() {
  return (
    <PageShell>
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <p className="label mb-6 text-forest-300">404 / Not found</p>
        <h1 className="font-sans text-3xl font-medium tracking-tight text-bone-50 sm:text-[2.5rem]">
          This path is not part of the system.
        </h1>
        <p className="mt-5 max-w-md text-pretty leading-relaxed text-bone-400">
          The page you asked for does not exist — or it never did.
        </p>
        <a href="/" className="btn btn-primary mt-10">
          Return to PizenLabs
        </a>
      </div>
    </PageShell>
  );
}

function App() {
  const path = usePath();
  // Both hooks use passive, rAF-coalesced listeners and a single shared
  // IntersectionObserver, so mounting them for every route stays cheap. The
  // reveals re-observe per path because a route swaps the whole document body.
  useReveal([path]);
  useScrollProgress();

  // A header anchor opened from another page (`/#philosophy` from /articles)
  // resolves its fragment before React has mounted the target, so the browser
  // finds nothing to scroll to. Re-issue it once the route is up; html's
  // scroll-padding-top keeps the section clear of the fixed header.
  useEffect(() => {
    if (!window.location.hash) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, [path]);

  if (path === '/') return <PizenLabsHome />;
  if (path === ARTICLES_PATH) return <Articles />;

  const match = ARTICLE_ROUTE.exec(path);
  if (match) {
    const article = ARTICLES.find((entry) => entry.slug === match[1]);
    if (article) return <Article article={article} />;
  }

  return <NotFound />;
}

export default App;