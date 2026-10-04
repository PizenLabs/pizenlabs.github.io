import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  /**
   * Pre-bundle lucide-react for dev.
   *
   * The previous config had `exclude: ['lucide-react']`. That forced the browser
   * to walk lucide's ~1500 individual ES modules one request at a time: a cold
   * dev load of the home page issued 1465 requests / ~8.2 MB. Pre-bundling
   * collapses that to a single request — 27 requests / ~2.4 MB.
   */
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'lucide-react'],
  },

  build: {
    outDir: 'dist',
    target: 'es2020',
    cssTarget: 'chrome87',
    // Skip the gzip report; it re-compresses every chunk on every build for a
    // number nothing in CI reads.
    reportCompressedSize: false,
    // Every modern browser supports modulepreload natively, so the polyfill is
    // dead weight in the entry chunk.
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        // React changes far less often than page code. Splitting it keeps the
        // hashed entry chunk small, so repeat visits re-download only the app.
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'react-vendor';
        },
      },
    },
  },
});