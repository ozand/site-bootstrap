# Portable Astro lessons (imported from ai-business-catalyst)

**Date:** 2026-08-27 · **Area:** astro

Lessons proven in production on ai-business-catalyst, applicable to any site from this template.

## Slug normalization

**Symptom:** links to content 404 although the file exists.
**Cause:** Astro normalizes slugs (removes dots: `2.5-72b` → `25-72b`); constructing URLs from filenames breaks.
**Fix:** always use the `id`/`slug` returned by `getCollection`, never build slugs from filenames manually.

## SSR props crash in dynamic routes

**Symptom:** `Astro.props.post` is undefined in `[...slug].astro` under on-demand rendering.
**Cause:** `getStaticPaths` props don't exist when the route renders on demand.
**Fix:** check props; if absent, fetch manually via `getEntry('collection', slug)`.

## External LLM/API calls from the browser

**Symptom:** CORS errors in `client:*` components calling external APIs.
**Fix:** server-side proxy route in `src/pages/api/[...path].ts`; point the client SDK `baseURL` at it.

## Large collections (>100 items) freeze the browser

**Fix:** (1) virtualize lists (`react-virtuoso`), (2) fetch in `.astro` frontmatter and pass as props with `client:load` (not `client:only`), (3) pass a trimmed DTO, not full entries.

## Vite dev 504 on heavy deps

**Symptom:** 504 Gateway Timeout in dev for pages importing heavy libs (`react-virtuoso`, `yjs`).
**Fix:** add them to `vite.optimizeDeps.exclude` in `astro.config.mjs`.

## Deploy fails but local build passes

**Symptom:** platform build: "Could not resolve <component>"; local build fine.
**Cause:** new files never staged (untracked) — local resolves from disk, CI from git.
**Fix:** `git status` before every push; stage all new components.

## Static builds >1000 pages

**Symptom:** `getStaticPaths` times out or exhausts memory.
**Fix:** render those routes on demand (adapter already present in this template) and fetch with `getEntry` in the page.
