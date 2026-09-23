# site-bootstrap

Bootstrap repository for creating **agent-operated Astro websites** from a reusable template.

The base template provides Astro 5, React 19, TypeScript, Tailwind CSS, shadcn/ui, file-backed content, and optional Keystatic editing. Its default public profile is static (`astro.config.mjs`); a separate Node-based editor profile is available when a site chooses to run Keystatic. Sites may adapt these choices to their own requirements—this factory does not require every generated site to use one deployment topology.

For the accepted separated static-public/private-editor architecture, see [Separated static-site architecture](docs/architecture/separated-static-site.md). That contract applies to sites that adopt this profile; it is not a universal deployment requirement.

- **Content:** the template has no database; Git-backed files are the content source of truth.
- **Operation:** designed for agents and humans to maintain together.
- **Hosting:** choose and configure a provider per site; platform-specific guidance lives under `hosting/`.

## Repository layout

| Path | Purpose |
| :--- | :--- |
| `templates/base-astro/` | The site template: full Astro skeleton with Keystatic, shadcn, content collections |
| `skills/` | Portable Agent Skills copied into every new site (`.agents/skills/`) |
| `scripts/create-site.mjs` | Scaffolder: template → new site folder with placeholders replaced |
| `docs/user-guide/` | For humans: getting started, editing content via Keystatic, hosting (Russian) |
| `templates/base-astro/DESIGN.md` | Template design-system tokens (DESIGN.md format) copied into every new site |
| `docs/agent-guide/design-workflow.md` | Agent workflow: how to read and update DESIGN.md |
| `docs/architecture/` | Architecture Decision Records |
| `hosting/vercel/`, `hosting/vps/` | Deployment configs per platform |
| `kb/` | Knowledge base: portable lessons learned across sites |

## Quick start

```bash
# 1. Create a new site from the template
node scripts/create-site.mjs --name my-site --domain example.com --target ../my-site

# 2. Install and run the default public static profile
cd ../my-site
npm ci
npm run dev
# Site: http://localhost:4321

# Optional, separate Node-based Keystatic editor profile:
# npm run dev:editor  # http://localhost:4321/keystatic
```

See `docs/user-guide/getting-started.md` for the full walkthrough (in Russian), `docs/agent-guide/bootstrap-workflow.md` for the agent workflow, and `docs/agent-guide/generated-site-handover.md` for the separated static-release handover.

## Principles

1. **Git is the database.** No external content store. Content edits are commits — reviewable, revertible, agent-friendly.
2. **One substrate for humans and agents.** Humans edit via Keystatic UI; agents edit files directly. Both produce the same commits.
3. **Contracts over conventions.** Content schemas (Zod), agent rules (`AGENTS.md`/`CLAUDE.md`), and verification commands (`npm run verify`) ship with every site.
4. **Hosting-agnostic.** The default public profile builds static output; an optional Node-based editor profile is separate. Provider setup is site-specific—see `hosting/` guidance and the [separated static-site architecture](docs/architecture/separated-static-site.md) when that contract applies.
