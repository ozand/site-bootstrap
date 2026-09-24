# ADR-005: Implement the starter blue and Inter visual contract in generated sites

**Status:** Proposed
**Date:** 2026-09-24
**Authors:** site-bootstrap maintainers
**Supersedes:** None
**Related:** ADR-004 (portable skills), Issue #61 (token drift), Issue #63 (design gate)

## Context

Owner approved blue accent and Inter as the intended starter direction in Issue #61, then confirmed a minimal design-brief basis in Issue #63. The existing `templates/base-astro/DESIGN.md` names blue `#2563EB` and Inter, while `src/styles/globals.css` and Tailwind currently render neutral semantic colors and system sans. This mismatch is verified by source inspection; a new visual implementation has not been built or browser-tested. DESIGN.md tokens are normative design values, not proof that CSS applies them. Existing generated sites must not be silently redesigned.

## Decision (proposed, NOT accepted)

The factory's *future* starter scaffold should make deliberate primary actions and links use the selected blue direction and use Inter for sans text. Preserve neutral text/surfaces, current layout/spacing/radius, dark-mode support, component APIs and the public-static/private-editor split. Prefer a licensed self-hosted Inter asset with system-sans fallback and no runtime font CDN request. Do not implement before owner acceptance of this ADR and a separately governed implementation Issue.

### Unresolved decisions — block implementation

- **Semantic roles:** confirm exact light-mode action/link/hover/focus/disabled mappings; do not silently turn every surface or `--primary` consumer blue. Existing `#2563EB` is an intended token, but contrast with actual text and backgrounds is not yet independently recorded.
- **Dark mode:** select and measure separate action/link/focus pairs against actual dark surfaces; do not reuse light blue by default.
- **Font asset:** identify exact Inter release/WOFF2 asset and provenance, license and redistribution notice, Latin **and Cyrillic** glyph coverage, supported weights, measured size and fallback loading behavior. No asset is approved for download or bundling yet. **Provider:** no external font provider is selected or needed for the self-hosted direction; the font asset's source and license are still pending review.
- **Typography scope:** specify which heading, body and UI roles use Inter; existing typography sizes and non-sans roles stay unchanged unless separately approved.

### Explicit non-goals

No production deployment, external font service, automatic token exporter, new UI primitive, global recoloring, unrelated radius/spacing change, auth/hosting changes or retroactive update of existing generated sites. Issue #61 does not authorize this implementation.

## Consequences

**Easier:** future sites start with a documented visual identity that matches their rendered baseline. **Harder:** a font asset increases distribution and license obligations; blue and dark-mode interactions demand contrast review and visual-regression testing. **Unchanged:** Git-only content, static public artifact and separate private editor, site-specific branding after scaffolding.

## Alternatives Considered

- Rewrite DESIGN.md to match neutral/system output: rejected by the owner's approved blue/Inter target; it hides the documented intent rather than addressing drift.
- Recolor every semantic token or force all type sizes/radii from the brief: rejected as unbounded redesign and likely contrast/regression risk.
- Use an external font CDN: not selected; introduces runtime third-party network/privacy/CSP and offline dependency. Self-hosting still requires asset/license approval.
- Use an installed-font-only `Inter` CSS name: not selected as the target guarantee; it falls back for users without that font.
- Do nothing: leaves normative DESIGN.md and fresh scaffold visually inconsistent.

## Test Contract (future implementation only)

| Claim | Required test | Status |
| --- | --- | --- |
| Light/dark blue is legible in approved roles | Measure actual rendered foreground/background pairs, hover and focus contrast at fixed routes/themes | not run; roles/colors undecided |
| Inter is lawfully self-hosted and works for Russian and Latin | Verify release/license and bundled notice, Unicode coverage, weights, local font request and fallback | not run; asset undecided |
| No new third-party runtime font requests | Inspect generated public artifact and browser network activity offline/online | not run |
| Visual change is scoped and usable | Fresh scaffold: `npm install`, `npm run verify`, `npm run build`, `npm run build:editor`; browser compare at 360/390/1280, light/dark, link/button/focus, overflow | not run |
| Public/editor boundary remains isolated | Inspect static `dist/` for editor/provider material and verify editor profile separately | not run |

## Rollback

Before publishing, revert the implementation commit to restore current neutral/system styling. A published artifact or already-scaffolded downstream sites require their own reviewed release/rollback; this ADR does not authorize either.

## References

- [Owner brief and design gate](https://github.com/ozand/site-bootstrap/issues/63)
- [Target token decision and documented drift](https://github.com/ozand/site-bootstrap/issues/61)
- [`DESIGN.md` workflow](../agent-guide/design-workflow.md)
- [Inter upstream project (candidate only)](https://github.com/rsms/inter)
