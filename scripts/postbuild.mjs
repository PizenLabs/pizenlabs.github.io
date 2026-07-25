// Postbuild: make the single-page app work under /izen/ on GitHub Pages.
//
// GitHub Pages serves /izen/ as a directory. Without a real /izen/index.html,
// that path 404s. We copy the built index.html into dist/izen/ and rewrite its
// asset paths to be site-root-relative so the same bundle serves both / and
// /izen/. We also drop a 404.html fallback so deep links resolve client-side.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const srcIndex = join(dist, 'index.html');

if (!existsSync(srcIndex)) {
  console.error('[postbuild] dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const html = readFileSync(srcIndex, 'utf8');

// 1) /izen/index.html — same entry, root-relative asset paths already work
//    because vite base is "/". Copy as-is.
const izenDir = join(dist, 'izen');
mkdirSync(izenDir, { recursive: true });
writeFileSync(join(izenDir, 'index.html'), html);

// 2) 404.html fallback so GitHub Pages serves the SPA on any deep link.
//    GitHub Pages serves 404.html for unknown paths; we render the app shell.
writeFileSync(join(dist, '404.html'), html);

// 3) Copy a .nojekyll so GitHub Pages serves _-prefixed asset dirs verbatim.
writeFileSync(join(dist, '.nojekyll'), '');

console.log('[postbuild] wrote dist/izen/index.html, dist/404.html, dist/.nojekyll');
