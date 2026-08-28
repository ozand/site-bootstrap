---
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
