---
canonical_schema: canonical-v1
id: KB-CONTENT-0001
title: "Markdoc content and Keystatic schema boundary"
category: architecture
tags: [markdoc, keystatic, zod, content, schema]
status: active
created: 2026-08-28
updated: 2026-08-28
environment:
  os: any
  shell: any
  tools: ["Astro 5", "Keystatic 5", "Zod"]
version_scope:
  product: "site-bootstrap content model"
  versions: ["Astro 5", "@astrojs/markdoc 0.15.0", "@keystatic/astro 5.2.0", "@keystatic/core 0.5.51"]
  environments: ["generated site"]
  as_of: 2026-08-28
  applicability: "Template posts and settings contract"
owner: "site-bootstrap maintainers"
claims:
  - claim_id: C-CONTENT-001
    text: "The template uses a .mdoc glob loader with Zod fields and a matching Keystatic content collection."
    type: api_contract
    status: confirmed
    evidence_refs: [RAW-20260828-web-cd-content-schema]
    verification_id: VR-CONTENT-001
    scope: "Current template source configuration"
evidence_refs:
  - evidence_id: RAW-20260828-web-cd-content-schema
    source_type: web
    url: "https://docs.astro.build/en/guides/content-collections/"
    captured_at: "2026-08-28T01:57:00Z"
    source_version: "docs main; package anchors in raw capture"
    locator:
      kind: line_range
      value: "kb/raw/web/web-cd-content-schema.md:L40-L49"
    notes: "Official contract summary plus local mapping."
verification:
  - verification_id: VR-CONTENT-001
    method: comparison
    performed_at: "2026-08-28T01:57:00Z"
    result: pass
    scope: "Compared template Astro and Keystatic schema declarations"
    output_ref: "RAW-20260828-web-cd-content-schema"
    notes: "No schema mutation performed."
alternatives: []
unresolved_conflicts: []
supersedes: []
superseded_by: null
provenance:
  derived_from: [RAW-20260828-web-cd-content-schema]
  reviewed_by: "site-bootstrap maintainer"
error_signatures: []
---

# Markdoc content and Keystatic schema boundary

## Scope

The baseline content contract uses `.mdoc` posts and two declarations that must
remain synchronized: Keystatic defines editing/storage semantics, while Astro/Zod
defines loading and validation semantics.

## Contract

- Astro loads `src/content/posts/**/*.mdoc` through its glob loader and validates
  entry data with Zod.
- The template’s fields are `title`, `description`, `pubDate`, `draft`, and `tags`;
  new posts default to draft.
- Keystatic targets `src/content/posts/*`, uses `entryLayout: content` and
  `contentField: content`, and exposes a Markdoc editor for the body.
- The settings singleton is JSON under `src/content/settings`.
- Default storage is local; GitHub storage is an explicit per-site configuration.

## Schema-sync checklist

1. Change `keystatic.config.ts` and `src/content.config.ts` together.
2. Match required/optional/default/nullability/date/array semantics.
3. Keep path, `.mdoc` extension, `contentField`, and `entryLayout` aligned.
4. Add a sanitized fixture, then run `npm run verify` and `npm run build`.
5. Render a public fixture route and check draft filtering and slug behavior.
6. Review diffs for divergence, secrets or private data.

## Evidence and limitations

- `RAW-20260828-web-cd-content-schema` — [source/package summary](../raw/web/web-cd-content-schema.md).
- [Canonical synthesis contract](../../docs/agent-guide/canonical-knowledge.md) — claim and evidence rules.

The package metadata and WEB-A4 smoke support the stated baseline, but do not certify
all Keystatic editing modes, date/time behavior, or future dependency resolutions.
