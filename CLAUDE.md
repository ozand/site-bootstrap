# site-bootstrap — Agent Entry Point

**Read [AGENTS.md](./AGENTS.md) first** — full contract for this repo.

This repo is a **factory** for agent-operated Astro sites. The base template uses Astro 5 + React 19 + TypeScript + Tailwind + shadcn/ui, file-backed Git content, and Keystatic. Its default public profile is static; a separate Node-based Keystatic editor profile is included. The accepted [separated static-site architecture](docs/architecture/separated-static-site.md) defines the generated-site deployment contract: static public publication and a separate private editor, with provider-specific configuration kept in `hosting/`.

Critical rules:

1. Scaffold sites ONLY via `node scripts/create-site.mjs --name <n> --domain <d> --target <path>`.
2. Template change → mandatory end-to-end verify: scaffold throwaway site → `npm install` → `npm run verify` → `npm run build`.
3. `keystatic.config.ts` and `src/content.config.ts` in the template describe the same content — change both or neither.
4. The template has no database. Keep platform-specific configuration under `hosting/<platform>/`; the generated-site static-public/private-editor deployment contract is documented in [the architecture guide](docs/architecture/separated-static-site.md).
5. Placeholders `__SITE_NAME__` / `__SITE_DOMAIN__` are owned by `scripts/create-site.mjs`.
6. Generated sites ship with `DESIGN.md` at root (from `templates/base-astro/DESIGN.md`). Read it before UI/styling changes. Lint: `npx @google/design.md lint DESIGN.md`. Full protocol: `docs/agent-guide/design-workflow.md`.
7. Non-obvious problem solved → record lesson in `kb/lessons/`.
8. Before implementation or acceptance, normalize scope, owner, environment, acceptance criteria, and verification method. Unresolved product, architecture, access-model, provider, or data-scope choices are `needs_decision` and must not be silently assumed.
9. For protected routes/admin surfaces, declare whether the boundary is network/Tailscale, proxy ACL, application authentication, application authorization, storage/persistence, or a combination; test the selected enforcement point. HTTP reachability is not authentication, authorization, or persistence evidence.
10. Acceptance reports must distinguish observed evidence, inference, and unverified claims, and report development, test, rollout, and residual-risk status. Never include credentials, cookies, tokens, private payloads, PII, runtime checkpoints, or protected local-state details. See [requirements and verification](docs/agent-guide/requirements-and-verification.md).
