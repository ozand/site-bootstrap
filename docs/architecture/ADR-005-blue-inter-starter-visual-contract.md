# ADR-005: Implement the starter blue and Inter visual contract in generated sites

**Status:** Accepted
**Date:** 2026-09-24
**Accepted:** 2026-09-29
**Authors:** site-bootstrap maintainers
**Supersedes:** None
**Related:** ADR-004 (portable skills), Issue #61 (token drift), Issue #63 (design gate), Issue #70 (implementation)

**Implementation status (2026-10-01):** Delivered for newly scaffolded sites via [Issue #70](https://github.com/ozand/site-bootstrap/issues/70) and [PR #71](https://github.com/ozand/site-bootstrap/pull/71) (merge commit `c11a2cb`). Context, Decision, and Test Contract below preserve their original pre-implementation snapshot; see the addendum for delivery evidence and limits.

## Context

Owner approved blue accent and Inter as the intended starter direction in Issue #61, then confirmed a minimal design-brief basis in Issue #63. The existing `templates/base-astro/DESIGN.md` names blue `#2563EB` and Inter, while `src/styles/globals.css` and Tailwind currently render neutral semantic colors and system sans. This mismatch is verified by source inspection; a new visual implementation has not been built or browser-tested. DESIGN.md tokens are normative design values, not proof that CSS applies them. Existing generated sites must not be silently redesigned.

## Decision

For **newly scaffolded sites only**, the target design uses `#2563EB` for primary filled actions and deliberate text links on light surfaces, with white text on blue; a solid `#1D4ED8` primary-action hover avoids the existing translucent `/90` contrast drop. In dark mode, use `#60A5FA` for those roles with dark foreground on filled blue buttons. Keep neutral body text, surfaces, navigation, destructive colors, component APIs and existing spacing/radius. Use locally served, version-pinned Inter v4.1 for sans text with a system-sans fallback, while preserving serif/mono roles, current type sizes and no third-party font request. **This decision is Accepted, not implemented.** No CSS, font bundling, downstream-site changes or deployment until a separately authorized implementation Issue; the unrun tests below are implementation acceptance gates.

### Selected mapping; validation still blocks implementation

- **Light:** map `--primary` to `#2563EB` and `--primary-foreground` to white for existing Button default/link roles. Use solid `#1D4ED8` on primary-button hover instead of `hover:bg-primary/90`; do not color unrelated navigation, body, neutral surfaces or destructive variants. The existing `--ring` is a separate focus token: use blue on light neutral surfaces, subject to rendered adjacency and focus-visibility checks during implementation. Calculated sRGB `#2563EB`/white is 5.17:1; this is not a browser result.
- **Dark:** use `--primary` `#60A5FA` for blue actions/links and a dark button foreground from the existing near-black neutral token, not white. Calculated `#60A5FA`/`#0A0A0A` is 7.79:1 and against `#262626` about 5.95:1; white text on that blue is only 2.54:1. Preserve neutral dark surfaces and destructive roles. Dark hover/focus/disabled states, focus ring adjacency and exact selected foreground must be checked in the actual generated UI; do not claim WCAG conformance from arithmetic alone.
- **Font asset (selected source; not yet bundled):** upstream Inter v4.1 `docs/font-files/InterVariable.woff2` (352,240 bytes; Git object `5a8d3e72ad7ffb62af3b146e1b1f54ab5813a212`) and matching `LICENSE.txt` (OFL 1.1; `9b2ca37b3ffc77391d8b2ebef4a974ef32bf46ea`) were copied to disposable scratch for inspection. Git object IDs matched upstream. FontTools read 2,852 cmap entries (248 in U+0400–U+04FF), sampled Russian including Ё/ё and Latin ASCII, and variable `wght` 100–900 plus `opsz` 14–32. This is binary metadata evidence, **not** proof of rendered glyphs or every downstream language. Before distribution, preserve the exact copyright/license notice and test actual browser loading, Cyrillic rendering, fallback and asset cost. **Provider:** none external for self-hosting. Bundling the pinned asset with its matching notice is in scope for a separate implementation Issue and subject to the stated distribution and rendering tests.
- **Typography scope:** apply Inter to the existing sans stack used by body, headings and ordinary UI text; retain current type sizes/weights, serif/mono and a system-sans fallback. Do not assume a font-family declaration alone proves the WOFF2 loaded. Check Cyrillic/Latin rendering, fallback under intentional font failure, font requests and layout shift on a fresh generated site. In a disposable local HTML test, Chrome loaded the pinned WOFF2 as one custom `Inter Variable` font for the sampled 29-character Latin/Russian line (including Ё/ё), with no fallback font reported for that sample; this does not test the actual generated site, all glyphs, CLS or font network behavior.

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
| Light/dark blue is legible in selected roles | Measure actual rendered foreground/background pairs, solid hover, disabled and keyboard focus at fixed routes/themes; confirm no neutral/destructive role drift | decision accepted; arithmetic only; rendered implementation test not run |
| Inter is lawfully self-hosted and works for Russian and Latin | Verify release/license and bundled notice, Unicode coverage, weights, local font request and fallback | pinned binary/license and sampled cmap inspected; one scratch Chromium sample rendered using only custom Inter; generated-site bundling/loading/fallback still not run |
| No new third-party runtime font requests | Inspect generated public artifact and browser network activity offline/online | not run |
| Visual change is scoped and usable | Fresh scaffold: `npm install`, `npm run verify`, `npm run build`, `npm run build:editor`; browser compare at 360/390/1280, light/dark, link/button/focus, overflow | not run |
| Public/editor boundary remains isolated | Inspect static `dist/` for editor/provider material and verify editor profile separately | not run |

## Rollback

Before publishing, revert the implementation commit to restore current neutral/system styling. A published artifact or already-scaffolded downstream sites require their own reviewed release/rollback; this ADR does not authorize either.

## Addendum (2026-10-01)

The decision above records the approved target and its original pre-implementation
status. Its statements that the implementation was pending and that the following
tests were unrun are historical snapshots, not current status. The approved
implementation for **newly scaffolded sites only** was delivered by Issue [#70](https://github.com/ozand/site-bootstrap/issues/70)
and merged as [PR #71](https://github.com/ozand/site-bootstrap/pull/71)
(commit `c11a2cb1ef3c207b81d8af92fbd2a91ad348b8c4`). No decision or scope in this
ADR is changed by this addendum.

Issue #70's completion record reports a fresh disposable scaffold passing locked
dependency installation, `npm run verify`, public build, and editor build; public
artifact inspection found the local font and license while excluding editor/server
artifacts; and local Chromium checks covered selected button/link states, font
loading, focus/hover/disabled behavior, and overflow at 360/390/1280 in light and
dark themes. The issue also records independent review. These are the implementation
receipt's bounded local results, not production or existing-site rollout, physical
device/assistive-technology coverage, or WCAG certification. It records unresolved
npm audit findings as residuals, not remediated by this work.

For the documentation-only reconciliation, Issue [#61](https://github.com/ozand/site-bootstrap/issues/61)
was completed by [PR #72](https://github.com/ozand/site-bootstrap/pull/72), merged
as merge commit `087df202f8dcd4a90622413d87042c727de3cdd0`. Its
completion record reports DESIGN.md lint with zero errors and warnings, and a
same-input 11-file public artifact with identical per-file hashes before and after
the documentation-only change. These results support that this DESIGN.md
reconciliation did not change the tested public output; they are not deployment
or rollout evidence.

No production deployment or mutation of existing generated sites is authorized or
claimed here. Any future site-specific adoption or rollout remains separately
scoped and verified.

## References

- [Owner brief and design gate](https://github.com/ozand/site-bootstrap/issues/63)
- [Target token decision and documented drift](https://github.com/ozand/site-bootstrap/issues/61)
- [`DESIGN.md` workflow](../agent-guide/design-workflow.md)
- [Inter v4.1 release and candidate binary](https://github.com/rsms/inter/releases/tag/v4.1)
- [Bounded binary/license inspection receipt](https://github.com/ozand/site-bootstrap/issues/63#issuecomment-5862183540)
- [Scratch Chromium glyph-rendering receipt](https://github.com/ozand/site-bootstrap/issues/63#issuecomment-5862357151)
- [Inter v4.1 OFL license text](https://github.com/rsms/inter/blob/v4.1/LICENSE.txt)
- [Upstream Cyrillic metadata (source claim, binary unverified)](https://github.com/rsms/inter/tree/v4.1/docs/_data)
