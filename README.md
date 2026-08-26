# site-bootstrap

Bootstrap repository for deploying **agent-operated websites** from scratch.

Every site created from this repo follows the same architecture:

- **Stack:** Astro 5 + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **CMS:** Keystatic (git-based admin UI at `/keystatic`)
- **Data:** database-less. Git is the single source of truth — all content lives as Markdown/Markdoc files in the repo
- **Operation:** designed to be built, maintained, and content-managed by AI agents working alongside humans
- **Hosting:** Vercel, Netlify, Cloudflare, or a plain VPS (Node adapter + Docker configs included)

## Repository layout

| Path | Purpose |
| :--- | :--- |
| `templates/base-astro/` | The site template: full Astro skeleton with Keystatic, shadcn, content collections |
| `skills/` | Portable Agent Skills copied into every new site (`.agents/skills/`) |
| `scripts/create-site.mjs` | Scaffolder: template → new site folder with placeholders replaced |
| `docs/user-guide/` | For humans: getting started, editing content via Keystatic, hosting (Russian) |
| `docs/agent-guide/` | For agents: bootstrap workflow, conventions |
| `docs/architecture/` | Architecture Decision Records |
| `hosting/vercel/`, `hosting/vps/` | Deployment configs per platform |
| `kb/` | Knowledge base: portable lessons learned across sites |

## Quick start

```bash
# 1. Create a new site from the template
node scripts/create-site.mjs --name my-site --domain example.com --target ../my-site

# 2. Install and run
cd ../my-site
npm install
npm run dev
# Site: http://localhost:4321  |  CMS: http://localhost:4321/keystatic
```

See `docs/user-guide/getting-started.md` for the full walkthrough (in Russian) and `docs/agent-guide/bootstrap-workflow.md` if you are an agent.

## Principles

1. **Git is the database.** No external content store. Content edits are commits — reviewable, revertible, agent-friendly.
2. **One substrate for humans and agents.** Humans edit via Keystatic UI; agents edit files directly. Both produce the same commits.
3. **Contracts over conventions.** Content schemas (Zod), agent rules (`AGENTS.md`/`CLAUDE.md`), and verification commands (`npm run verify`) ship with every site.
4. **Hosting-agnostic.** The template defaults to the Node adapter; switching to Vercel/Netlify/Cloudflare is one command (see `hosting/`).
