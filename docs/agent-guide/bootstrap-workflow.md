# Agent workflow: bootstrapping a new site

Protocol for an AI agent deploying a site from this repository. Follow in order; verify each step.

## Phase 0 — Requirements and access preflight

Before scaffold, customization, deployment, or acceptance, complete the
[requirements and verification preflight](./requirements-and-verification.md).
Record the outcome, target, scope/exclusions, owner, environment, dependencies,
acceptance criteria, verification method, rollout intent, access model, storage
mode, and enforcement point. Resolve material ambiguity as `needs_decision`; do
not silently assume whether a control belongs to the network, reverse proxy,
application auth/authz, or storage layer. Keep observed evidence, inference,
unverified checks, blockers, and non-claims separate in the final report.

## Phase 1 — Scaffold

```bash
node scripts/create-site.mjs --name <kebab-name> --domain <domain> --target <path>
cd <path>
npm ci            # requires the committed template package-lock.json
```

Checks:
- scaffolder exited 0, target contains `package.json`, `.agents/skills/`, `.gitignore`
- target does not contain the bootstrap workspace's `qmd.json`, `qmd/collections/`, `.qmd/`, or `kb/`
- `git log` shows the initial scaffold commit

## Phase 2 — Verify baseline

```bash
npm run verify   # astro check + eslint — must pass clean
npm run build    # must produce dist/ without errors
npm run dev      # then:
curl -I http://localhost:4321/          # 200
curl -I http://localhost:4321/blog      # 200
# Public static profile: inspect dist/ with a static server; do not expect /keystatic.
# Private editor profile (separate host): npm run dev:editor, then:
curl -I http://localhost:4321/keystatic # 200 (editor profile only)
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
4. Smoke-test production: serve the public `dist/` artifact and verify `/` and representative static routes return 200. Do not open `/keystatic` on the public artifact; test it only on the separate private editor profile if enabled.

## Phase 5 — Handover

Follow the [generated-site handover procedure](./generated-site-handover.md). Keep
content-only edits separate from code/design changes and report the source
revision, locked build checks, static artifact/release identity, publication and
health result, rollback state, unverified checks, owner, and residual risks.

The public VPS serves only the accepted static artifact through Nginx. It does not
serve `/keystatic` or run public Node/SSR; Keystatic belongs on the private editor
host. Do not include credentials, tokens, cookies, private URLs, customer data, or
runtime payloads in the handoff.

Report to the owner:
- repo URL and public static hosting URL;
- private editor-host URL/status only when authorized (never publish credentials);
- what was customized (content versus code/design files);
- verification evidence (`npm ci`, verify/build output, artifact digest, route/health statuses);
- publication/current pointer and rollback status;
- next-step suggestions and explicitly unverified checks.

## Feedback loop

Any non-obvious failure you solved → one lesson file in `kb/lessons/` of site-bootstrap. Template defect → fix `templates/base-astro/` and re-run the AGENTS.md §6 verification cycle.

The generated site does not inherit this repository's QMD registry or knowledge base. QMD/KB adoption in a generated site is an explicit, independent repository decision.
