# __SITE_NAME__

Built from the [site-bootstrap](https://github.com/ozand/site-bootstrap) template.

- **Stack:** Astro 5, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **CMS:** Keystatic private editor profile — edits content files in git; not part of the public static artifact
- **Data:** no database; all content is Markdoc in `src/content/`

## Develop

```bash
npm ci            # requires the committed package-lock.json
npm run dev       # http://localhost:4321
npm run verify    # type check + lint
npm run build     # static production artifact under dist/ for Nginx/CDN
```

The template commits an npm lockfile (lockfile v3) and supports Node.js 18+
with npm 9+. Use `npm ci` for clean, reproducible installs; it fails when the
lockfile and `package.json` drift. If dependencies are intentionally changed,
regenerate the lockfile with npm and commit both files together.

## Editor profile

The default `astro.config.mjs` is the public static profile and deliberately
omits the Keystatic integration. When a private Keystatic editor host is needed,
use the separate `astro.config.editor.mjs` with `npm run dev:editor` or
`npm run build:editor`. Before using GitHub mode, change `keystatic.config.ts`
from local storage to the documented GitHub storage block and provide the
`KEYSTATIC_*` values through the private host environment. This on-demand Node
profile is not a public deployment artifact and must remain on the private
editor/build host.

## Content

- Posts: `src/content/posts/*.mdoc` — edit via Keystatic or any editor
- Schemas: `src/content.config.ts` (Zod) + `keystatic.config.ts` (CMS) — keep in sync
- New posts default to `draft: true`

## For agents

Read `AGENTS.md`. Entry point for Claude Code: `CLAUDE.md`. Skills: `.agents/skills/`.
