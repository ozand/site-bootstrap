# site-bootstrap — Agent Entry Point

**Read [AGENTS.md](./AGENTS.md) first** — full contract for this repo.

This repo is a **factory** for agent-operated Astro sites (Astro 5 + React 19 + TS + Tailwind + shadcn/ui + Keystatic, git-only, no database).

Critical rules:

1. Scaffold sites ONLY via `node scripts/create-site.mjs --name <n> --domain <d> --target <path>`.
2. Template change → mandatory end-to-end verify: scaffold throwaway site → `npm install` → `npm run verify` → `npm run build`.
3. `keystatic.config.ts` and `src/content.config.ts` in the template describe the same content — change both or neither.
4. No databases in the template. No platform-specific config outside `hosting/<platform>/`.
5. Placeholders `__SITE_NAME__` / `__SITE_DOMAIN__` are owned by `scripts/create-site.mjs`.
6. Non-obvious problem solved → record lesson in `kb/lessons/`.
