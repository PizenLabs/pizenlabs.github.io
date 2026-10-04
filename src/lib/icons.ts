/**
 * Single import surface for icons.
 *
 * lucide-react exposes ~3000 icon modules. Importing from the package root lets
 * Rollup tree-shake, but it still has to parse every one of them at build time.
 * Naming the icons we actually use in one place makes the dependency auditable:
 * add an icon here and it ships, delete it here and it cannot.
 */
export {
  ArrowUpRight,
  ArrowRight,
  Eye,
  Terminal,
  GitBranch,
  Github,
  Blocks,
  Moon,
  Sun,
} from 'lucide-react';