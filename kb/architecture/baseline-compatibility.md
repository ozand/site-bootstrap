---
canonical_schema: canonical-v1
id: KB-BASELINE-0001
title: "Observed baseline compatibility matrix"
category: architecture
tags: [baseline, compatibility, astro, keystatic, markdoc]
status: active
created: 2026-08-28
updated: 2026-08-28
environment:
  os: "observed scratch host"
  shell: any
  tools: ["npm", "Astro", "Node"]
version_scope:
  product: "site-bootstrap"
  versions: ["Astro 5.18.2", "Node 9.5.5", "Keystatic 5.2.0/0.5.51"]
  environments: ["generated consumer smoke"]
  as_of: 2026-08-28
  applicability: "One clean generated consumer, host and toolchain"
owner: "site-bootstrap maintainers"
claims:
  - claim_id: C-BASELINE-001
    text: "The factory baseline resolved to the listed package set and passed verify/build in one generated consumer."
    type: observed_behavior
    status: confirmed
    evidence_refs: [RAW-20260828-web-a4-baseline-smoke]
    verification_id: VR-BASELINE-001
    scope: "One generated consumer and observed host/toolchain"
  - claim_id: C-BASELINE-002
    text: "The resolved Keystatic Astro 5.2.0 peer metadata includes Astro 5 and React 19."
    type: api_contract
    status: confirmed
    evidence_refs: [RAW-20260828-web-cd-content-schema]
    verification_id: null
    scope: "Package metadata for @keystatic/astro 5.2.0"
evidence_refs:
  - evidence_id: RAW-20260828-web-a4-baseline-smoke
    source_type: web
    url: "https://github.com/ozand/site-bootstrap"
    captured_at: "2026-08-28T02:24:00Z"
    source_version: "WEB-A4 generated smoke identity; mutable repository URL"
    locator:
      kind: line_range
      value: "kb/raw/web/web-a4-baseline-smoke.md:L40-L47"
    notes: "Historical fixture summary; not production certification."
  - evidence_id: RAW-20260828-web-cd-content-schema
    source_type: web
    url: "https://docs.astro.build/en/guides/content-collections/"
    captured_at: "2026-08-28T01:57:00Z"
    source_version: "docs main; package metadata separately stated"
    locator:
      kind: line_range
      value: "kb/raw/web/web-cd-content-schema.md:L40-L49"
    notes: "Package metadata summary; not E2E proof."
verification:
  - verification_id: VR-BASELINE-001
    method: reproduction
    performed_at: "2026-08-28T02:24:00Z"
    result: pass
    scope: "WEB-A4 clean generated consumer"
    output_ref: "RAW-20260828-web-a4-baseline-smoke"
    notes: "One host/toolchain only."
alternatives: []
unresolved_conflicts:
  - "No lockfile is retained in the factory; future registry resolution may differ."
supersedes: []
superseded_by: null
provenance:
  derived_from: [RAW-20260828-web-a4-baseline-smoke, RAW-20260828-web-cd-content-schema]
  reviewed_by: "site-bootstrap maintainer"
error_signatures: []
---

# Observed baseline compatibility matrix

## Scope

This record describes one clean generated consumer and its resolved lockfile on the
observed host/toolchain. It is not a promise for every future registry resolution,
operating system, provider, or upgrade.

## Factory ranges and observed resolution

| Package | Factory range | Observed resolution |
| --- | --- | --- |
| Astro | `^5.5.0` | `5.18.2` |
| `@astrojs/node` | `^9.0.0` | `9.5.5` |
| `@astrojs/react` | `^4.2.0` | `4.4.2` |
| React / React DOM | `^19.0.0` | `19.2.8` |
| Tailwind CSS | `^3.4.17` | `3.4.19` |
| `@astrojs/tailwind` | `^6.0.0` | `6.0.2` |
| `@astrojs/markdoc` | `^0.15.0` | `0.15.0` |
| `@keystatic/astro` | `^5.0.0` | `5.2.0` |
| `@keystatic/core` | `^0.5.45` | `0.5.51` |
| TypeScript | `^5.8.0` | `5.9.3` |
| Zod | `^3.24.0` | `3.25.76` |

## Verified outcome

The generated consumer passed `npm run verify` and `npm run build`. The Node
entrypoint started and the baseline routes `/`, `/blog`, and `/keystatic` returned
HTTP 200 in the smoke. This is a scoped observation, not production certification.

## Interpretation and constraints

Package peer metadata is only a compatibility signal. The actual resolution and
smoke are stronger evidence for this fixture, but they do not certify GitHub-mode
Keystatic, provider deployment, authentication, or future upgrades. A lower-bound
`@keystatic/astro@5.0.0` peer declaration differs from the resolved 5.2.0 package;
these are different version claims and must not be merged.

## Evidence

- `RAW-20260828-web-a4-baseline-smoke` — [baseline raw capture](../raw/web/web-a4-baseline-smoke.md), commands, versions and bounded outcome.
- `RAW-20260828-web-cd-content-schema` — [content/schema capture](../raw/web/web-cd-content-schema.md), package anchors and schema boundary.
- [Factory manifest](../../templates/base-astro/package.json) — declared ranges.
