import { Fragment } from 'react';
import type { ArticleBlock } from '@/lib/content';

/**
 * Inline `code`, **strong**, and [label](href) inside body copy.
 *
 * Deliberately neither Markdown nor dangerouslySetInnerHTML: one split on a
 * single alternation regex, with React escaping every literal piece. Syntax
 * that does not match renders as the text the author wrote, which is the right
 * failure mode for prose.
 */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(INLINE).map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        const link = LINK.exec(part);
        if (link) {
          // External links open in a new tab; site links stay in the document.
          const external = link[2].startsWith('http');
          return (
            <a
              key={i}
              href={link[2]}
              {...(external
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : null)}
            >
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/**
 * Renders an article's `body`. Rhythm and typography come from `.article-body`
 * in index.css, so this file only decides which element each block becomes.
 */
export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={`${block.type}-${i}`}>
                <Inline text={block.text} />
              </h2>
            );
          case 'list':
            return (
              <ul key={`${block.type}-${i}`}>
                {block.items.map((item) => (
                  <li key={item}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={`${block.type}-${i}`}>
                <Inline text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}