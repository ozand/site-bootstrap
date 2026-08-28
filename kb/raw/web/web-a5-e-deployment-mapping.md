---
raw_schema: raw-v1
capture_id: RAW-20260828-web-a5-e-deployment-mapping
status: raw_capture
source_type: web
source_url: "https://docs.astro.build/en/guides/integrations-guide/node/"
source_title: "Astro Node deployment and site-bootstrap hosting mapping"
author: null
organization: "Astro / site-bootstrap"
published_at: null
updated_at: null
captured_at: "2026-08-28T02:17:00Z"
source_version: "Astro docs main; baseline A4 evidence separately scoped"
retrieval:
  method: http
  tool: "Python urllib"
  tool_version: "3.x"
  http_status: 200
  media_type: text/markdown
  language: en
content:
  representation: markdown
  sha256: "sha256:0cc08d94e3afe8841a3da93224591b46cef4de87138fb205308e29d5611d5a1b"
  byte_count: 1079
  excerpted: true
  transform: "sanitized config-to-doc mapping"
provenance:
  captured_by: "site-bootstrap research"
  derived_from: null
quality:
  source_quality: high
  claim_status: corroborated
  limitations:
    - "Local hosting files are configuration evidence, not production verification."
    - "Provider-specific and auth behavior remain untested."
rights:
  license: unknown
  retention_note: "Short mapping; no secrets or deployment payloads."
tags: [astro, deployment, node, vps, docker]
web:
  canonical_url: "https://docs.astro.build/en/guides/integrations-guide/node/"
  publisher: "Astro"
  locator: "Node adapter standalone, middleware, entrypoint and HOST/PORT"
  response_validators:
    etag: null
    last_modified: null
---

# WEB-A5/E deployment mapping

Official Astro Node guidance documents standalone/middleware modes, `dist/server/entry.mjs`, runtime `HOST`/`PORT`, and Docker invocation. Generic deployment guidance distinguishes static `dist` publishing from server output.

Local mapping: `hosting/vps/Dockerfile` uses a Node 22 Alpine build/runtime and starts `node dist/server/entry.mjs`; compose binds loopback port 4321 and reads `.env`; systemd runs the entrypoint as a service; Nginx terminates TLS and proxies to loopback. `hosting/vercel/README.md` describes switching to a Vercel adapter for provider-specific deployment.

A4 baseline evidence resolved Astro 5.18.2 and Node 9.5.5 and passed its scratch checks; this record does not claim Docker, systemd, Nginx, Vercel, production, auth, or rollback success.

## Evidence

- [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/)
- [Astro deployment](https://docs.astro.build/en/guides/deploy/)
- [Local VPS README](../../../hosting/vps/README.md)
- [Local Vercel README](../../../hosting/vercel/README.md)
