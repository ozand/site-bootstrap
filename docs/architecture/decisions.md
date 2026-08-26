# Architecture Decision Records

## ADR-001: Git as the only content store (no database)

**Date:** 2026-08-27 · **Status:** accepted

Sites built from this template store ALL content as files in git (Markdoc + JSON). No Supabase/Postgres/external CMS API.

**Why:**
- Agents operate best on files: diffs are reviewable in PRs, history and rollback are free, no API client or credentials needed.
- One substrate for humans (Keystatic UI) and agents (direct file edits) — both produce commits.
- Removes a whole class of failures observed in ai-business-catalyst: paused DB kills deploys, env prefix mismatches, seed fallbacks.

**Trade-off:** no user-generated runtime data (comments, form submissions). If a site needs that, it's a per-site architecture decision (external service or a DB added consciously), not a template default.

## ADR-002: Keystatic as CMS

**Date:** 2026-08-27 · **Status:** accepted

**Why over alternatives:**
- Git-based: edits are commits; source of truth stays in the repo (Sanity/Contentful move content out of git → breaks the agent model).
- Astro-first integration (`@keystatic/astro`), admin ships inside the site at `/keystatic`.
- TypeScript config (`keystatic.config.ts`) lives next to the Zod schema — one repo, one contract.
- Two storage modes cover all hosting: `local` (dev/VPS), `github` (serverless prod).

**Trade-off:** schema is defined twice (Keystatic fields + Zod). Mitigation: the sync rule is pinned in every AGENTS.md/CLAUDE.md, and both files carry a header comment pointing at each other.

## ADR-003: Node adapter as the default

**Date:** 2026-08-27 · **Status:** accepted

Template ships `@astrojs/node` (standalone). Keystatic requires server-rendered routes, so a pure static build is not an option while the CMS is embedded.

**Why Node:** runs anywhere (VPS, Docker, any PaaS) with zero vendor assumptions. Vercel/Netlify/Cloudflare are one `npx astro add <adapter>` away — documented in `hosting/`.

## ADR-004: Skills copied into each site, upstreamed here

**Date:** 2026-08-27 · **Status:** accepted

`create-site.mjs` copies `skills/` → `<site>/.agents/skills/` (snapshot, not submodule/symlink).

**Why:** each site repo stays self-contained (agents working in the site see skills without cloning the factory). Cost: drift. Mitigation: sync protocol in AGENTS.md §4 — generalizable improvements are upstreamed to site-bootstrap; bootstrap fixes propagate on maintenance passes.
