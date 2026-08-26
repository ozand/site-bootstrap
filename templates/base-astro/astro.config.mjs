// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// Keystatic admin (/keystatic) requires on-demand rendering, so an adapter is
// always configured. Default: Node standalone (works on any VPS / container).
// For Vercel/Netlify/Cloudflare, swap the adapter — see hosting/ in the
// site-bootstrap repository.
export default defineConfig({
  site: 'https://__SITE_DOMAIN__',
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  adapter: node({ mode: 'standalone' }),
});
