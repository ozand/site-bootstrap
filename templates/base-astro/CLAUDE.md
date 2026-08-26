# __SITE_NAME__ — Agent Entry Point

**Read [AGENTS.md](./AGENTS.md) first** — full contract.

Pinned rules:

1. `npm run verify` before every commit; `npm run build` after structural changes.
2. `keystatic.config.ts` and `src/content.config.ts` describe the same content — change both or neither.
3. No databases. Content = `.mdoc` files in `src/content/posts/`, git is the source of truth.
4. File-based routing, plain `<a>` links, no client-side routers.
5. Reuse `src/components/ui/` (shadcn); `.astro` for pages, `.tsx` only for islands.
6. New posts start `draft: true`; publishing is a reviewed commit flipping the flag.
