# __SITE_NAME__ — Agent Guide

Site built from the **site-bootstrap** template: Astro 5 + React 19 + TypeScript + Tailwind CSS + shadcn/ui + Keystatic CMS. Database-less — git is the single source of truth for all content.

## 1. Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Dev server at `http://localhost:4321` (CMS at `/keystatic`) |
| `npm run verify` | astro check + eslint. Run before every commit |
| `npm run build` | Production build. Run after structural changes |
| `npm run preview` | Preview production build |

## 2. Architecture rules

1. **Content = files in git.** Blog posts are Markdoc (`.mdoc`) files in `src/content/posts/`. Humans edit via Keystatic UI at `/keystatic`; agents edit files directly. Both produce commits — same substrate.
2. **Schema sync (CRITICAL):** `keystatic.config.ts` (CMS fields) and `src/content.config.ts` (Zod schema) describe the same files. Any field change goes to BOTH files in the same commit.
3. **No database.** Do not add Supabase/Postgres/ORM. If persistent state is genuinely needed, raise it with the owner first — it is an architecture change.
4. **Prefer static:** `.astro` for pages/layouts, React (`.tsx`) only for interactive islands. Use `client:load`/`client:visible`; avoid `client:only` unless the component cannot render on the server.
5. **Routing:** file-based only. No client-side routers. Links are plain `<a>`.
6. **UI:** reuse `src/components/ui/` (shadcn). Add new shadcn components via `npx shadcn@latest add <name>`, do not hand-roll primitives.
7. **Styling:** Tailwind utility classes + CSS variables from `src/styles/globals.css`. No new CSS files without reason.
8. **Drafts:** new posts default to `draft: true`. Pages filter `!data.draft`. Publishing = flipping the flag in a reviewed commit.

## 3. Verification protocol (MANDATORY)

"It should work" is unacceptable.

1. `npm run verify` before every commit.
2. `npm run build` after structural changes (new routes, config, dependencies).
3. New route → `curl -I http://localhost:4321/<path>` expecting 200.
4. Content change → confirm the page renders (dev server) and the entry passes schema validation (build fails loudly on schema violations).

## 4. Content workflow

1. Create post: add `src/content/posts/<slug>.mdoc` with valid frontmatter (see existing posts), or via Keystatic UI.
2. Slugs are kebab-case. The file name is the slug (`post.id`).
3. Keep `description` filled — it is the meta description.
4. Draft → review → set `draft: false` → commit.

## 5. Hosting

Default adapter: `@astrojs/node` (standalone) — runs on any VPS/container. Platform switch (Vercel/Netlify/Cloudflare): see `hosting/` in the site-bootstrap repository. Keystatic admin requires server rendering; in `github` storage mode it also needs the `KEYSTATIC_*` env vars (see `.env.example`).

## 6. Skills

Portable Agent Skills live in `.agents/skills/`. Prefer them over external guidance on conflict. Improvements that generalize should be upstreamed to the site-bootstrap repository.
