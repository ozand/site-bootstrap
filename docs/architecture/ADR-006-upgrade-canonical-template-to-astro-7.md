# ADR-006: Upgrade the canonical template to Astro 7.3.5

**Status**: Accepted
**Date**: 2026-10-03
**Authors**: site-bootstrap maintainers
**Supersedes**: None
**Related**: ADR-001 (Git-only content), ADR-002 (Keystatic), ADR-003 (public static/private editor), ADR-005 (blue/Inter visual contract)

## Context

Issue #81 authorizes an upgrade-first migration of the canonical template from Astro 5 to the latest stable Astro release, with only demonstrated compatibility changes. Source baseline is merged commit `1dd7900bb79b4828b2f70f9a42064ce57ed810a5`. The current template already implements the blue/Inter visual contract under accepted ADR-005: `src/styles/globals.css` loads local Inter and blue primary/hover tokens, and Tailwind config sets Inter as sans. This migration must preserve that implemented contract and is not a new visual redesign. On 2026-10-03, read-only npm registry queries returned Astro `7.3.5` as latest stable; `7.4.0-beta.1` is a prerelease and excluded. Astro 7.3.5 declares Node `>=22.12.0`, npm `>=9.6.5`, pnpm `>=7.1.0`; the observed local Node 24.14.0/npm 11.19.0 satisfies those declared floors. The minimum version itself has not been tested.

Astro 7.3.5 and its release-line integrations cross major boundaries: `@astrojs/node@11.1.6` peers on Astro `^7.2.1`; `@astrojs/markdoc@2.0.9` peers on Astro `^7.0.0`; `@keystatic/astro@6.0.0` declares Astro 5/6/7 and React 18/19. The current `@astrojs/tailwind@6.0.2` peers on Astro 3/4/5 and Tailwind 3. The Astro integration README marks the integration deprecated; Astro's styling guide documents Tailwind 3 as legacy and requires both Tailwind 3 and `@astrojs/tailwind`, so the official guide does not provide an Astro-7-compatible Tailwind-3 recipe. A direct PostCSS/Vite composition is an unproven compatibility hypothesis (Tailwind's PostCSS plugin plus Vite CSS processing), not an official Astro recipe or established solution. One bounded candidate may test this composition; no peer bypass is allowed. If standard resolution/build/render checks fail or require Tailwind 4, layout/auth/data/provider changes, stop for owner decision.

Official migration guides: [Astro 5→6](https://docs.astro.build/en/guides/upgrade-to/v6/) and [Astro 6→7](https://docs.astro.build/en/guides/upgrade-to/v7/). Astro 6 moves to Vite 7; Astro 7 moves to Vite 8, makes the Rust compiler the only compiler, changes default HTML whitespace compression, changes default Markdown processing to Sätteri, and reserves `src/fetch.ts`. These are review risks, not claims of failure in this template. Historical Issue #55 remains an as-of research snapshot and is not rewritten; this owner-authorized decision supersedes its recommendation to retain Astro 5 for now.

## Decision

Upgrade the canonical template first to Astro `7.3.5` and diagnose concrete compatibility failures in a disposable scaffold. Apply only the smallest evidenced package/config changes required for a working build. Preserve public static output and the distinct private Node editor profile, git/local content storage, schema parity, visual layout/blue-Inter contract, and Tailwind 3 where a supported compatibility path can be proven.

### What this IS

- A dependency/runtime migration to Astro 7.3.5 with related adapter and Markdoc versions chosen from compatible metadata.
- One bounded test of a nonstandard direct Tailwind 3 PostCSS/Vite composition only if normal peer resolution, verification, and rendered CSS checks succeed; record it as tested candidate evidence, not official Astro-supported configuration.

### What this IS NOT

- A bulk dependency refresh, automatic audit fix, peer-dependency override, Tailwind 4 adoption by default, redesign, schema/content migration, auth/provider/storage change, database, or deployment.
- Authorization to alter existing generated sites or probe live editor authentication.

### Success criteria

A fresh supported scaffold installs with `npm install` and reproducible `npm ci`; verify passes; public static and editor builds pass; public output excludes editor/server artifacts; expected content routes and Keystatic/Zod field parity remain; rendered public comparison preserves layout and blue/Inter styling. Candidate and baseline audits are recorded with residual findings. If Tailwind 3 cannot be retained without bypassing peers or changing visual behavior, stop for an owner decision rather than silently switching to Tailwind 4.

## Registry and migration evidence receipts

Read-only npm registry query facts and official source locators are summarized in [`ADR-006-registry-evidence.json`](./ADR-006-registry-evidence.json), retrieved 2026-10-03. The receipt records Astro `7.3.5` as the stable target, prerelease exclusion, engine/peer metadata, source URLs, and snapshot hashes. Raw npm/docs response bodies remain local; this sanitized receipt is the portable fact summary, not a complete wire capture. Registry and docs are mutable. These metadata do not establish successful factory migration.

## Consequences

### What gets easier

- After compatibility verification, the factory baseline can follow the selected stable Astro release and compatible integration lines; this ADR does not itself establish that the migration resolves any advisory.
- Node/npm minimums are explicit for new scaffold consumers.

### What gets harder

- Node runtime floor rises to Node 22.12; dependent build hosts must satisfy it.
- Migration crosses Vite 8, compiler, markdown, and integration-major changes; rendered HTML/CSS/content output must be compared rather than inferred from compilation.
- Tailwind 3 is at a compatibility boundary because the official Astro integration's peer range ends at Astro 5. A nonstandard PostCSS/Vite configuration may require maintenance or may fail; Tailwind 4 is not an implicit fallback.

### What does not change

- Git remains the only content store; no DB or provider lock-in.
- Public output remains static and separate from the private Node/Keystatic editor profile.
- Keystatic local storage default, content paths, schemas, and blue/Inter visual intent remain unless separate owner approval is obtained.

## Alternatives Considered

### Astro 6 intermediate target

Not selected as the final target because owner direction is latest stable and the current critical AVIF advisory affects Astro versions below 7.2.8. An intermediate Astro 6 hop may be used only as a diagnostic step in an isolated candidate; it is not acceptance of an Astro 6 final baseline.

### Remain on Astro 5

Rejected for this authorized increment because owner requested migration to latest stable after the previous assessment. Historical #55's contrary recommendation remains preserved as context.

### Upgrade Tailwind to 4 immediately

Not selected by default because the owner prefers preserving Tailwind 3 and the existing visual contract. Consider only if the bounded Tailwind 3 compatibility experiment fails and after explicit owner decision.

## Test Contract

| Claim | Test | Currently |
|---|---|---|
| Exact target is stable and runtime-supported | Committed [`ADR-006-registry-evidence.json`](./ADR-006-registry-evidence.json); compare registry target, engines and peers | Retrieved 2026-10-03; metadata only; minimum Node floor not exercised |
| Lockfile update retains intended versions and install reproducibility | Fresh scaffold `npm install`, then `npm ci`; compare generated lock to template input | Not yet run |
| Public routes/schema/content remain usable | `npm run verify`, build; route and schema assertions | Not yet run |
| Public artifact excludes editor/server files | Inspect/hash public `dist/` before editor build | Not yet run |
| Tailwind 3 PostCSS/Vite candidate preserves baseline styling without peer bypass | Same-content baseline/candidate generated CSS and rendered-page comparison; normal `npm install`, verify and build | Not yet run; compatibility hypothesis only |
| Separate editor profile builds | `npm run build:editor` in separate fresh fixture | Not yet run; does not test auth or live runtime |
| Residual audit findings are stated honestly | Baseline/candidate `npm audit --json` receipts on same source/toolchain | Not yet run |

## Rollback

Revert the migration PR to restore the previous Astro 5 template lock and dependency declarations. Existing generated sites are not modified by this factory change; future scaffolds alone receive the new baseline.

## References

- Issue #81 — owner-authorized Astro latest-stable migration.
- Historical Issue #55 assessment — retain unchanged as prior research snapshot.
- [Astro upgrade to v6](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Astro upgrade to v7](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Astro styling / Tailwind guide](https://docs.astro.build/en/guides/styling/#tailwind)
- [Astro Tailwind integration deprecation notice](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/README.md)
