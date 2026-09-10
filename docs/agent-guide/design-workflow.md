# Design Workflow — DESIGN.md for Generated Sites

## What is DESIGN.md

[DESIGN.md](https://github.com/google-labs-code/design.md) is an open format from Google Labs that describes a visual identity in a single file. It combines **YAML front matter** (machine-readable design tokens for colors, typography, spacing, rounding, and components) with **Markdown prose** (human-readable design rationale).

Agents read the file to get exact values for a site's visual system. The prose explains *why* those values exist and how to apply them.

## Where DESIGN.md lives

Every site scaffolded from `site-bootstrap` ships with `DESIGN.md` at the repository root. The template lives at `templates/base-astro/DESIGN.md` with `__SITE_NAME__` / `__SITE_DOMAIN__` placeholders, which the scaffolder replaces at creation time.

## When agents should read DESIGN.md

- **Before any UI or styling change.** Check `DESIGN.md` for the correct color, typography, and spacing tokens.
- **Before creating or modifying components.** The `components:` section in the front matter may specify token bindings (e.g. button `backgroundColor`, button `rounded`).
- **During design review.** Compare the implemented UI against the tokens and prose sections in `DESIGN.md`.
- **After design changes are agreed.** Update the tokens and prose in `DESIGN.md` to match the new decisions, then propagate values to Tailwind config / CSS variables.

## Required steps: design brief and visual review

### Design brief

When a design change is requested (new page, new component, visual refresh), agents must:

1. Read the current `DESIGN.md` for applicable tokens and rationale.
2. Confirm the change is within the existing design system, or flag that a design-system update is needed (`needs_decision`).
3. Use only declared tokens for color, font, spacing, and rounding values.

### Visual review

After implementing a visual change:

1. Confirm the implemented values match `DESIGN.md` tokens.
2. If contrast or accessibility is relevant, run the upstream linter (see below).
3. Record any token drift in the commit message or PR description.

## Using the upstream CLI (no runtime dependency)

The `@google/design.md` package provides a CLI for linting and exporting tokens. It is **not** a project dependency — use it via `npx` on demand:

```bash
# Lint the DESIGN.md for broken refs, contrast issues, missing tokens
npx @google/design.md lint DESIGN.md

# Compare two versions of a design system
npx @google/design.md diff DESIGN.md DESIGN-v2.md

# Export tokens for Tailwind v3 / v4 / DTCG
npx @google/design.md export --format json-tailwind DESIGN.md
npx @google/design.md export --format css-tailwind DESIGN.md
npx @google/design.md export --format dtcg DESIGN.md

# Output the spec for agent-prompt injection
npx @google/design.md spec
```

**Do not add `@google/design.md` to `package.json`.** It is an on-demand dev tool, not a build or runtime dependency. If `npx` access is unavailable (air-gapped, CI without network), record the lint step as `not-run` in the verification report rather than adding a dependency.

## DESIGN.md file format reference

### Structure

```
---
(YAML front matter: design tokens)
---

(Markdown body: design rationale)
```

### Token schema (condensed)

```yaml
version: alpha              # optional
name: <string>
description: <string>       # optional
omitted: <string[]>         # optional — sections intentionally skipped
colors:
  <token-name>: <CSS color>
typography:
  <token-name>:
    fontFamily: <string>
    fontSize: <Dimension>
    fontWeight: <number>     # optional
    lineHeight: <Dimension|number>  # optional
    letterSpacing: <Dimension>      # optional
rounded:
  <scale>: <Dimension>
spacing:
  <scale>: <Dimension|number>
components:
  <name>:
    <prop>: <value or {token.ref}>
```

### Section order (those present must follow this order)

1. Overview (alias: Brand & Style)
2. Colors
3. Typography
4. Layout (alias: Layout & Spacing)
5. Elevation & Depth
6. Shapes

## Adoption boundaries

The following boundaries are **non-negotiable** for this repository:

### Adopted

- `DESIGN.md` file format for describing a site's visual identity.
- YAML front matter token schema (colors, typography, spacing, rounded, components).
- Markdown prose sections for design rationale.
- On-demand use of `npx @google/design.md lint` for validation (not as a dependency).
- Agent workflow: read `DESIGN.md` before styling changes, confirm token adherence after changes.

### Not adopted — do not change without explicit maintainer decision

- **No automatic visual redesign.** The presence of `DESIGN.md` does not authorize agents to autonomously restyle a site. Design changes require a human-agreed brief or issue.
- **No database, hosting, or authentication changes.** `DESIGN.md` adoption is visual-identity documentation only. It does not affect the git-only content model, hosting configuration, or access controls.
- **No runtime dependency on `@google/design.md`.** The package is never added to `package.json` or `package-lock.json`. Use `npx` only.
- **No build-step integration.** Design token export is a manual/agent step; it is not wired into `npm run build` or `npm run verify`.
- **No replacement of existing Tailwind/CSS workflow.** Tokens in `DESIGN.md` are a source-of-truth reference. The site continues to use `tailwind.config.ts` and `src/styles/globals.css` as the active styling mechanism. Agents may use `export` to generate Tailwind config from tokens, but the generated output is reviewed and committed manually, not piped automatically.

## Source and version

- Upstream: <https://github.com/google-labs-code/design.md>
- Format version adopted: `alpha`
- Adoption recorded in issue: [#50](https://github.com/ozand/site-bootstrap/issues/50)
