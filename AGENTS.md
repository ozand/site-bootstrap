# site-bootstrap — Agent Guide

This repository is a **factory**, not a website. It produces agent-operated Astro sites. Read this before modifying the bootstrap repo or scaffolding a new site.

## 1. What lives here

- `templates/base-astro/` — canonical site template. Changes here affect every future site.
- `skills/` — portable Agent Skills. `create-site.mjs` copies them into `<new-site>/.agents/skills/`.
- `scripts/create-site.mjs` — the only supported way to scaffold a site. Do not hand-copy the template.
- `kb/` — cross-site lessons. When you hit a non-obvious problem in ANY site built from this repo, record the lesson here (not only in that site).
- `docs/` — user guide (Russian), agent guide, ADRs.

## 2. Scaffolding a new site (agent workflow)

```bash
node scripts/create-site.mjs --name <site-name> --domain <domain> --target <path>
cd <path>
npm install
npm run verify        # must pass before first commit is pushed
npm run dev           # manual smoke: / and /keystatic respond
```

Full protocol: `docs/agent-guide/bootstrap-workflow.md`.

## 3. Rules for modifying the template

1. **Template must always scaffold to a working site.** After any template change: scaffold a throwaway site, `npm install`, `npm run verify`, `npm run build`. "Should work" is unacceptable.
2. **Placeholders:** `__SITE_NAME__` and `__SITE_DOMAIN__` are replaced by the scaffolder. Never rename them without updating `scripts/create-site.mjs`.
3. **Keep Keystatic and Zod schemas in sync.** `keystatic.config.ts` (CMS fields) and `src/content.config.ts` (Astro collection schema) describe the same files. A field added to one MUST be added to the other.
4. **No databases.** Sites are git-only. Do not add Supabase/Postgres/etc. to the template. If a specific site needs a DB, that is a per-site decision made outside this repo.
5. **No provider lock-in.** Default adapter is `@astrojs/node`. Platform-specific config belongs in `hosting/<platform>/`, not in the template.
6. **Versions:** dependency versions in `templates/base-astro/package.json` are ranges. When bumping majors, re-verify the scaffold end-to-end.

## 4. Rules for skills

- Skills in `skills/` must be **portable**: no references to a specific site's paths, data, or brand.
- Sync direction: site-specific skill improvements that generalize → upstream them here; bootstrap skill fixes → propagate to active sites on their next maintenance pass.
- Each skill keeps the standard layout: `skills/<name>/SKILL.md` (+ optional resources).

## 5. Knowledge base protocol

- One lesson = one file in `kb/lessons/`, kebab-case, with a dated header and the symptom → cause → fix structure.
- Before debugging an Astro/Keystatic/Tailwind issue in any generated site, grep `kb/lessons/` first.

## 6. Verification protocol (this repo)

- `node scripts/create-site.mjs --name smoke-test --domain example.com --target <scratch-dir>` must complete without errors.
- Generated site must pass `npm install && npm run verify && npm run build`.
- Never commit a template change without running this cycle.
