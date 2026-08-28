---
raw_schema: raw-v1
capture_id: RAW-20260828-web-a10-generated-acceptance
status: raw_capture
source_type: web
source_url: "https://github.com/ozand/site-bootstrap"
source_title: "generated-site acceptance smoke"
author: null
organization: "ozand"
published_at: null
updated_at: null
captured_at: "2026-08-28T03:45:00Z"
source_version: "generated acceptance-smoke fixture"
retrieval:
  method: repository-read
  tool: "node/npm"
  tool_version: "observed scratch toolchain"
  http_status: null
  media_type: text/markdown
  language: en
content:
  representation: markdown
  sha256: "sha256:2ed17fc0524c5b2e87ce4493f5eeb2c3622ef1e6cb8af25eaa8a750403059662"
  byte_count: 933
  excerpted: true
  transform: "sanitized artifact matrix"
provenance:
  captured_by: "site-bootstrap research"
  derived_from: null
quality:
  source_quality: medium
  claim_status: corroborated
  limitations:
    - "One generated fixture and host/toolchain only."
    - "No accessibility, Lighthouse, CWV, production, or security certification."
rights:
  license: unknown
  retention_note: "Sanitized artifact observations only."
tags: [acceptance, seo, accessibility, performance, baseline]
web:
  canonical_url: "https://github.com/ozand/site-bootstrap"
  publisher: "ozand/site-bootstrap"
  locator: "WEB-A10 generated artifact matrix"
  response_validators:
    etag: null
    last_modified: null
---

# WEB-A10 generated-site acceptance smoke

Observed artifact matrix from one disposable `acceptance-smoke` consumer:

- `dist/client/sitemap-index.xml` and `sitemap-0.xml`: present.
- Home HTML: title, description, and `<link rel="sitemap">` present.
- Home HTML: canonical, Open Graph, JSON-LD, and `robots.txt` absent in the inspected fixture.
- No representative content image was present, so image alt/dimension behavior was not tested.
- Build produced static client output and `dist/server/entry.mjs`; routes were tested separately.

Absence of optional outputs is an observation, not a defect without a project requirement.

## Evidence locations

- Generated artifact checks: `dist/client` and parsed home `index.html` in the disposable fixture.
- Normative references: [Astro sitemap docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [Astro images docs](https://docs.astro.build/en/guides/images/).
