---
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
