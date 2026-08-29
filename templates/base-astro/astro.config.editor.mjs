// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// Private editor profile. Keep this config off the public static build path.
// Run it only on a private/local editor host when /keystatic is required.
export default defineConfig({
  output: 'server',
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
