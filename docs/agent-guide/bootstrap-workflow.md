# Agent workflow: bootstrapping a new site

Protocol for an AI agent deploying a site from this repository. Follow in order; verify each step.

## Phase 1 — Scaffold

```bash
node scripts/create-site.mjs --name <kebab-name> --domain <domain> --target <path>
cd <path>
npm ci            # requires the committed template package-lock.json
```

Checks:
- scaffolder exited 0, target contains `package.json`, `.agents/skills/`, `.gitignore`
- `git log` shows the initial scaffold commit

## Phase 2 — Verify baseline

```bash
npm run verify   # astro check + eslint — must pass clean
npm run build    # must produce dist/ without errors
npm run dev      # then:
curl -I http://localhost:4321/          # 200
curl -I http://localhost:4321/blog      # 200
curl -I http://localhost:4321/keystatic # 200
```

Do not proceed to customization on a red baseline. A broken scaffold is a bug in site-bootstrap — fix it in the template, re-scaffold, and record the lesson in `kb/lessons/`.

## Phase 3 — Customize

Typical order:
1. `src/content/settings.json` + Layout branding (name already substituted, adjust tagline/nav)
2. Design tokens: `src/styles/globals.css` CSS variables (colors, radius)
3. Content model: extend `keystatic.config.ts` AND `src/content.config.ts` together (one commit)
4. Pages: add `.astro` pages; interactive parts as React islands with shadcn components
5. Replace the `hello-world` sample post with real content (posts start `draft: true`)

Rules: the generated site's `AGENTS.md` is the contract. Verify after every structural change.

## Phase 4 — Remote + hosting

1. Create the GitHub repo and push (ask the owner for org/visibility if unknown).
2. Pick hosting with the owner: Vercel (`hosting/vercel/README.md`) or VPS (`hosting/vps/README.md`).
3. If CMS editing on production is required → switch Keystatic to `github` storage, set `KEYSTATIC_*` env vars.
4. Smoke-test production: `curl -I https://<domain>/` → 200, open `/keystatic` if enabled.

## Phase 5 — Handover

Report to the owner:
- repo URL, hosting URL, admin URL
- what was customized (files list)
- verification evidence (verify/build output, route statuses)
- next-step suggestions (content plan, analytics, SEO)

## Feedback loop

Any non-obvious failure you solved → one lesson file in `kb/lessons/` of site-bootstrap. Template defect → fix `templates/base-astro/` and re-run the AGENTS.md §6 verification cycle.
