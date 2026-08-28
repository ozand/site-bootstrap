---
raw_schema: raw-v1
capture_id: RAW-20260828-github-a12-keystatic-boundary
status: raw_capture
source_type: web
source_url: "https://github.com/ozand/site-bootstrap"
source_title: "Keystatic anonymous route boundary smoke"
author: null
organization: "ozand"
published_at: null
updated_at: null
captured_at: "2026-08-28T03:56:00Z"
source_version: "Astro 5.18.2 / Node 9.5.5 / Keystatic Astro 5.2.0 / Core 0.5.51"
retrieval:
  method: repository-read
  tool: "node/npm/curl"
  tool_version: "observed scratch toolchain"
  http_status: null
  media_type: text/markdown
  language: en
content:
  representation: markdown
  sha256: "sha256:d4d6ec43f3cc23642fb3350227329e2a543bf7cda284f2429ee569b12222c7c6"
  byte_count: 863
  excerpted: true
  transform: "sanitized anonymous route matrix"
provenance:
  captured_by: "site-bootstrap research"
  derived_from: null
quality:
  source_quality: medium
  claim_status: corroborated
  limitations:
    - "Anonymous route reachability only; no auth/security or write test."
    - "Guessed API paths do not enumerate the full route map."
rights:
  license: unknown
  retention_note: "Statuses, content types, and sizes only; no bodies or headers retained."
tags: [keystatic, admin, route, baseline]
web:
  canonical_url: "https://github.com/ozand/site-bootstrap"
  publisher: "ozand/site-bootstrap"
  locator: "WEB-A12 generated fixture route matrix"
  response_validators:
    etag: null
    last_modified: null
---

# WEB-A12 anonymous Keystatic boundary smoke

Resolved fixture packages: Astro 5.18.2, `@astrojs/node` 9.5.5, `@keystatic/astro` 5.2.0, `@keystatic/core` 0.5.51.

Anonymous status matrix:

| Route | Status | Redirects | Content type |
| --- | ---: | ---: | --- |
| `/keystatic` | 200 | 0 | `text/html` |
| `/keystatic/` | 200 | 0 | `text/html` |
| `/api/keystatic/config` | 404 | 0 | `text/plain;charset=UTF-8` |
| `/api/keystatic/` | 404 | 0 | `text/plain;charset=UTF-8` |

HTTP 200 is route reachability, not authentication/security proof. No login, token, cookie, write, GitHub mode, authorization, persistence, production, or provider test was performed. The capture is bounded to a generated-fixture runtime observation from a public repository reference; no immutable source-code object was captured. It must not be promoted as a GitHub source-code claim.
