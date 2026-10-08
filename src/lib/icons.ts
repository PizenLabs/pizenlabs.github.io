/**
 * Single import surface for icons.
 *
 * lucide-react exposes ~3000 icon modules. Importing from the package root lets
 * Rollup tree-shake, but it still has to parse every one of them at build time.
 * Naming the icons we actually use in one place makes the dependency auditable:
 * add an icon here and it ships, delete it here and it cannot.
 */
import { createElement } from 'react';
import type { SVGProps } from 'react';

export {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Eye,
  Terminal,
  GitBranch,
  Github,
  Blocks,
  Linkedin,
  Mail,
  Moon,
  Sun,
} from 'lucide-react';

/**
 * Bluesky butterfly mark. lucide-react has no Bluesky icon, so this fills the
 * gap with the brand's butterfly path. Same contract as a lucide icon:
 * `currentColor` stroke/fill via className, accepts standard SVG props.
 */
export function Bluesky(props: SVGProps<SVGSVGElement>) {
  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 568 501',
      fill: 'currentColor',
      'aria-hidden': true,
      focusable: false,
      ...props,
    },
    createElement('path', {
      d: 'M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.812 284.017 372.431 284 375.306C283.983 372.431 282.831 375.812 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0528 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z',
    })
  );
}