// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import sitemap from '@astrojs/sitemap';
// Public profile: static files for Nginx/CDN publication. Keystatic is an
// editor/build-host concern and is not part of the public static artifact.
// Use the separate private editor profile when /keystatic must run on-demand.
export default defineConfig({
  output: 'static',
  site: 'https://__SITE_DOMAIN__',
  vite: { css: { postcss: { plugins: [tailwindcss(), autoprefixer()] } } },
  integrations: [
    react(),
    markdoc(),
    sitemap(),
  ],
});
