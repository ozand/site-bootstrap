---
name: site-reference-synthesizer
description: Use when synthesizing a website-reference brief from an existing saved evidence bundle. Requires traceable artifacts and separates observed interface evidence, publisher claims, and hypotheses; it never browses or captures sources.
license: MIT
metadata:
  audience: research
  workflow: website-reference-synthesis
---

# Site Reference Synthesizer

Synthesize only the saved, authorized artifacts provided as input. This skill does not perform browsing, capture, scraping, external research, or evidence repair.

## Inputs and trust boundary

- Require an explicit evidence-bundle path and a defined research question/output scope.
- Read only artifacts in that bundle and their referenced provenance records. Do not follow external URLs, launch browsers, or fetch missing sources.
- Treat raw artifacts as evidence, not canonical conclusions. Preserve their identifiers and source locators in every supported claim.
- Keep private source captures private. Do not quote or reproduce full third-party pages, DOM, screenshots, or transcripts. Follow existing raw-evidence and canonical-knowledge policies for minimal copying, sanitization, rights, and publication review.
- If an artifact is absent, provenance is incomplete, or the evidence conflicts, report the gap; never fabricate or silently repair metadata.

## Synthesis workflow

1. Inventory supplied files and provenance. Confirm source identity, route, captured time, viewport/state, representation, integrity metadata, and any declared transformations. Distinguish actual values from unknowns.
2. Build claims only from saved evidence. Preserve a source identifier and precise locator for every observation. Cross-source agreement is not proof of independent verification unless provenance supports independence.
3. Assign claim status:
   - `OBSERVED`: directly present in a saved artifact for the specified route, viewport, and state.
   - `SITE_CLAIM`: statement made by the publisher; do not imply it is independently true.
   - `INFERRED`: a reasoned interpretation explicitly linked to its supporting observations.
   - `HYPOTHESIS`: untested buyer/persona/JTBD/emotion, causality, or user-motive proposition absent direct research.
   - `NOT_VERIFIED`: a claim or state not established by the supplied bundle, including uncaptured routes, mobile behavior, access state, or incomplete source coverage.
4. Treat agent-run clicks and observed public interface flows as `agent_observed_flow`, not empirical user journeys, live user behavior, usability-test outcomes, or proof of user/persona identity.
5. Do not infer complete coverage from a list of captures. Compare requested routes/states/viewports with the bundle inventory and enumerate omissions.
6. Keep accessibility conclusions bounded to the tests and artifacts supplied. Screenshots or computed styles alone do not prove WCAG conformance or assistive-technology behavior.
7. Draft the requested brief using only supported statements. Retain evidence links and uncertainty labels at the statement level; include conflicts, omissions, and limitations.
8. Before sharing, apply the project's publication gate and remove only through an explicitly described, authorized sanitization transform. Never modify or overwrite raw evidence.

## Output contract

Return a Markdown synthesis containing: question/scope; bundle inventory; supported observations with artifact locators; attributed `SITE_CLAIM`s; `INFERRED` conclusions with reasoning; `HYPOTHESIS` items; `NOT_VERIFIED` coverage gaps; conflicts; privacy/publication status; and residual limitations. Reuse supplied project formats rather than introducing a data schema. Never represent the output as a live audit, user research, full accessibility audit, or verified mobile review unless qualifying evidence is actually present.

## Stop conditions

Return `BLOCKED` when the requested conclusion depends on unavailable evidence, provenance cannot be established, the supplied bundle contains sensitive/private material that cannot safely be excluded, or publication permission is unresolved. State what evidence or owner decision would resolve the blocker. Do not browse to fill gaps.
