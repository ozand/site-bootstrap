---
raw_schema: raw-v1
capture_id: RAW-20260828-web-cd-content-schema
status: raw_capture
source_type: web
source_url: "https://docs.astro.build/en/guides/content-collections/"
source_title: "Astro content collections and Markdoc schema boundary"
author: null
organization: "Astro"
published_at: null
updated_at: null
captured_at: "2026-08-28T01:57:00Z"
source_version: "docs main; package anchors below"
retrieval:
  method: http
  tool: "Python urllib"
  tool_version: "3.x"
  http_status: 200
  media_type: text/markdown
  language: en
content:
  representation: markdown
  sha256: "sha256:03d48e4f58d2b606e6f7dd426b8dec9f95d339d57f2334786bcfa10162aa6ed8"
  byte_count: 1140
  excerpted: true
  transform: "sanitized contract summary"
provenance:
  captured_by: "site-bootstrap research"
  derived_from: null
quality:
  source_quality: high
  claim_status: confirmed
  limitations:
    - "Astro docs main is mutable; package metadata is separately versioned."
rights:
  license: unknown
  retention_note: "Short contract summary; no wholesale source text."
tags: [astro, markdoc, content-collections, schema]
web:
  canonical_url: "https://docs.astro.build/en/guides/content-collections/"
  publisher: "Astro"
  locator: "Content collections and Markdoc schema summary"
  response_validators:
    etag: null
    last_modified: null
---

# WEB-C/D content and schema boundary

Astro content collections use a loader and optional schema for predictable data shape, type safety, editor support, and validation. Local build-time loaders support Markdown, MDX, Markdoc, YAML, TOML, and JSON. Markdoc entries use `.mdoc` and can be queried/rendered through content APIs.

Exact package anchors:

- `@astrojs/markdoc@0.15.0`: peer `astro: ^5.0.0`; Node engines `18.20.8 || ^20.3.0 || >=22.0.0`; tarball [integrity anchor](https://registry.npmjs.org/@astrojs/markdoc/-/markdoc-0.15.0.tgz).
- `@keystatic/astro@5.2.0`: peers Astro `2 || 3 || 4 || 5 || 6 || 7`, React/DOM 18 or 19; tarball [integrity anchor](https://registry.npmjs.org/@keystatic/astro/-/astro-5.2.0.tgz).
- `@keystatic/core@0.5.51`: peers React/DOM 18 or 19; tarball [integrity anchor](https://registry.npmjs.org/@keystatic/core/-/core-0.5.51.tgz).

The template uses a `.mdoc` glob loader and a Zod schema; Keystatic maps the same post path with `contentField: 'content'` and `entryLayout: 'content'`. This synchronization is a local project rule. Package peers are compatibility signals, not complete certification.
