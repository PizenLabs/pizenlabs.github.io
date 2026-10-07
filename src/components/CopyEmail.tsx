import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from '@/lib/icons';

/**
 * Copies the lab's address to the clipboard.
 *
 * A mailto: link opens a mail client; this is the faster path for someone who
 * lives in a different one. On success the label flips to a confirmation for
 * two seconds (announced via the polite live region); where the Clipboard API
 * is unavailable it falls back to opening the mailto: instead of failing
 * silently. Rendered as a compact ghost button so it sits beside the large
 * address link without competing with it.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    []
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={onCopy}
        className="btn btn-ghost h-8 !px-3 !text-[0.6875rem]"
        aria-live="polite"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-forest-300" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {copied ? 'Copied' : 'Copy email'}
      </button>
    </span>
  );
}
