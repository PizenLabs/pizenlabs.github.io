/**
 * All page copy and links live here so presentation stays separate from
 * content. Editing this file is the only change needed to revise wording.
 */

export type Project = {
  name: string;
  href: string;
  summary: string;
  /** Shown as a small meta line under the summary. */
  meta: string;
  kind: string;
};

export const PROJECTS: Project[] = [
  {
    name: 'izen',
    href: 'https://pizenlabs.github.io/izen314/',
    summary:
      'AI amplifies human judgment. The operator stays in control of what the system is allowed to do.',
    meta: 'Live at pizenlabs.github.io/izen314',
    kind: 'Applied',
  },
  {
    name: 'lynx',
    href: 'https://github.com/PizenLabs/lynx',
    summary:
      'Symbol-first repository discovery engine for AI-native developer tooling.',
    meta: 'github.com/PizenLabs/lynx',
    kind: 'Open source',
  },
];


/**
 * Long-form posts. `body` is a small block union rather than Markdown: the site
 * ships no parser, and copy is authored in this file next to everything else.
 * Paragraph and list text may contain inline `code`, **strong**, and
 * [label](href) — rendered by ArticleBody, never injected as HTML.
 *
 * SEO note: publishing a new post means adding its URL to
 * public/sitemap.xml too, so crawlers discover it without rendering JS.
 */
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

export type Article = {
  /** URL segment: /articles/<slug>. Also the React key. */
  slug: string;
  title: string;
  /** Card summary, post intro, and meta description. */
  standfirst: string;
  /** Label as written, e.g. 'Company'. The index derives its chips from these. */
  category: string;
  /** ISO date (YYYY-MM-DD). Formatted in UTC so it never shifts a day. */
  published: string;
  body: ArticleBlock[];
};

export const ARTICLES: Article[] = [
  {
    slug: 'introducing-pizenlabs',
    title: 'Introducing Pizenlabs',
    standfirst:
      'Who we are, what we are building, and why every part of it is open source.',
    category: 'Company',
    published: '2026-10-05',
    body: [
      {
        type: 'paragraph',
        text:
          'PizenLabs is a small, independent laboratory. We start from an idea about how people should work with machines, build the system that embodies that idea, and then publish the whole thing.',
      },
      { type: 'heading', text: 'The idea we keep returning to' },
      {
        type: 'paragraph',
        text:
          'Technology should increase human capability without removing human agency. It is a test we can apply to any project: does this make the work more legible, or does it just move the decision somewhere less visible?',
      },
      {
        type: 'paragraph',
        text:
          'It is also why the work is open source. Understanding is part of the product, not a bonus feature shipped with it. If a system claims to help you think, you should be able to read exactly what it does.',
      },
      { type: 'heading', text: 'What is in flight' },
      {
        type: 'list',
        items: [
          '**izen** — an operator for AI-assisted work. AI amplifies human judgment; the operator stays in control of what the system is allowed to do. [Open it](https://pizenlabs.github.io/izen314/)',
          '**lynx** — symbol-first repository discovery for AI-native developer tooling. [Read the source](https://github.com/PizenLabs/lynx)',
        ],
      },
      { type: 'heading', text: 'How we work' },
      {
        type: 'paragraph',
        text:
          'Four habits, written the way we would like our own tools to behave:',
      },
      {
        type: 'list',
        items: [
          '**Inspect** — every claim is checkable against the code.',
          '**Understand** — understanding is part of the product, not a bonus.',
          '**Fork freely** — extend it, remix it, break it.',
          '**Contribute** — open an issue, send a patch. Small and considered changes are welcome.',
        ],
      },
      { type: 'heading', text: 'Why write this down' },
      {
        type: 'paragraph',
        text:
          'Reasoning belongs next to the code, not buried inside it. This section is where we write down what we tried, what broke, and what we would do differently — so a reader can check our work instead of taking it on trust.',
      },
      {
        type: 'paragraph',
        text:
          'Start with the [source](https://github.com/PizenLabs). It remains the most honest description of what we do.',
      },
    ],
  },
];

/**
 * Categories present in ARTICLES, in first-appearance order. Derived rather
 * than declared, so publishing a post under a new category is the only step
 * needed to make it a filter on the index.
 */
export const ARTICLE_CATEGORIES: string[] = [
  ...new Set(ARTICLES.map((article) => article.category)),
];

/** Route prefix, shared by the nav link and the router so the two cannot drift. */
export const ARTICLES_PATH = '/articles';

/** UTC, so an ISO date never renders as the day before west of Greenwich. */
export const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Computed from the body rather than stored, so it cannot drift from it. */
export function readingMinutes(article: Article): number {
  const words = article.body.reduce(
    (total, block) =>
      total +
      (block.type === 'list' ? block.items : [block.text])
        .join(' ')
        .trim()
        .split(/\s+/).length,
    0
  );
  return Math.max(1, Math.round(words / 220));
}

export type Principle = {
  index: string;
  icon: 'eye' | 'terminal' | 'branch' | 'arrow';
  title: string;
  body: string;
};

export const PRINCIPLES: Principle[] = [
  {
    index: '01',
    icon: 'eye',
    title: 'Inspect',
    body: 'Every claim is checkable against the code. You should never have to take our word for it.',
  },
  {
    index: '02',
    icon: 'terminal',
    title: 'Understand',
    body: 'Understanding is part of the product, not a bonus feature shipped with it.',
  },
  {
    index: '03',
    icon: 'branch',
    title: 'Fork freely',
    body: 'Extend it, remix it, break it. The work exists to be taken apart.',
  },
  {
    index: '04',
    icon: 'arrow',
    title: 'Contribute',
    body: 'Open an issue, send a patch. Small and considered changes are welcome.',
  },
];

// Section anchors are written site-absolute so the shared header keeps working
// on subpages: from /articles, `#work` would resolve to /articles#work.
export const NAV_LINKS = [
  { label: 'Philosophy', href: '/#philosophy' },
  { label: 'Work', href: '/#work' },
  { label: 'Principles', href: '/#principles' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Articles', href: ARTICLES_PATH },
];

/** Absolute origin, for canonical and og:url. Matches index.html. */
export const SITE_ORIGIN = 'https://pizenlabs.github.io';
export const GITHUB_URL = 'https://github.com/PizenLabs';
export const BLUESKY_URL = 'https://bsky.app/profile/pizenlabs.bsky.social';
export const BLUESKY_HANDLE = '@pizenlabs.bsky.social';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/pizenlabs/about/';

/** Direct line to the lab. Rendered as a mailto: in the footer and contact section. */
export const CONTACT_EMAIL = 'contact@pizenlabs.dev';