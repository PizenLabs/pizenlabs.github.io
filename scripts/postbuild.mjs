// Postbuild: prepare the dist/ directory for GitHub Pages deployment.
//
// GitHub Pages deploys `dist/` as the site root. We ensure:
// - 404.html serves the SPA shell so deep links resolve client-side.
// - A .nojekyll file is present so GitHub Pages serves _-prefixed dirs verbatim.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = join(fileURLToPath(import.meta.url), '..');
const dist = join(__dirname, '..', 'dist');
const srcIndex = join(dist, 'index.html');

if (!existsSync(srcIndex)) {
  console.error('[postbuild] dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const html = readFileSync(srcIndex, 'utf8');

// 404.html fallback so GitHub Pages serves the SPA on any deep link.
writeFileSync(join(dist, '404.html'), html);

// .nojekyll so GitHub Pages serves _-prefixed asset dirs verbatim.
writeFileSync(join(dist, '.nojekyll'), '');

console.log('[postbuild] wrote dist/404.html, dist/.nojekyll');
