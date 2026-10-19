/**
 * Numbered section marker, e.g. "02 / PHILOSOPHY".
 *
 * The rule is a plain element rather than a border-image or gradient so it can
 * be a hairline without adding a paint layer per section.
 *
 * The mark in front of the number is a small ring: the page's geometry is
 * round — medallions, orbits, the dial's arc — and the section index is
 * part of it.
 */
export default function SectionLabel({
  index,
  title,
  className = '',
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`reveal flex items-center gap-4 ${className}`}>
      <span className="mark-dot" aria-hidden="true" />
      <span className="label text-bone-500">{index}</span>
      <span className="h-px w-8 bg-bone-400/20" aria-hidden="true" />
      <span className="label text-bone-300">{title}</span>
    </div>
  );
}
