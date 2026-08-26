import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Content contract. MUST stay in sync with keystatic.config.ts —
// every field added/renamed there must be mirrored here, and vice versa.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    pubDate: z.coerce.date().nullable().optional(),
    draft: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
