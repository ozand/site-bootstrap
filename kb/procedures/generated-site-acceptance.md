---
canonical_schema: canonical-v1
record_schema: record-v1
id: PROC-0002
title: "Generated-site acceptance and handover"
category: procedure
tags: [acceptance, verification, deployment, seo, accessibility, performance]
status: active
created: 2026-08-28
updated: 2026-08-28
environment:
  os: any
  shell: any
  tools: ["node", "npm", "curl"]
version_scope:
  product: "site-bootstrap baseline"
  versions: ["Astro 5.18.2", "@astrojs/node 9.5.5", "Keystatic 5.2.0/0.5.51"]
  environments: ["generated consumer"]
  as_of: 2026-08-28
  applicability: "Pre-release acceptance; not production certification"
owner: "site-bootstrap maintainers"
claims:
  - claim_id: C-ACCEPT-001
    text: "A generated site must pass the project's verify and build commands before handover."
    type: api_contract
    status: confirmed
    evidence_refs: [RAW-20260828-web-a4-baseline-smoke]
    verification_id: VR-ACCEPT-001
    scope: "Project baseline workflow"
  - claim_id: C-ACCEPT-002
    text: "A reachable /keystatic route does not prove authentication or authorization."
    type: observed_behavior
    status: confirmed
    evidence_refs: [RAW-20260828-github-a12-keystatic-boundary]
    verification_id: VR-ACCEPT-002
    scope: "Anonymous baseline route smoke"
evidence_refs:
  - evidence_id: RAW-20260828-web-a4-baseline-smoke
    source_type: web
    url: "https://github.com/ozand/site-bootstrap"
    captured_at: "2026-08-28T02:24:00Z"
    source_version: "WEB-A4 generated smoke identity; mutable repository URL"
    locator:
      kind: line_range
      value: "kb/raw/web/web-a4-baseline-smoke.md:L40-L47"
    notes: "One fixture/host/toolchain."
  - evidence_id: RAW-20260828-github-a12-keystatic-boundary
    source_type: github
    url: "https://github.com/ozand/site-bootstrap"
    captured_at: "2026-08-28T03:56:00Z"
    source_version: "repository-read fixture; no immutable object anchor"
    locator:
      kind: github_path
      value: "repository_read:WEB-A12-generated-fixture-route-matrix"
    notes: "Runtime observation, not source-code claim."
verification:
  - verification_id: VR-ACCEPT-001
    method: reproduction
    performed_at: "2026-08-28T02:24:00Z"
    result: pass
    scope: "WEB-A4 generated consumer"
    output_ref: "RAW-20260828-web-a4-baseline-smoke"
    notes: "One fixture/host/toolchain."
  - verification_id: VR-ACCEPT-002
    method: reproduction
    performed_at: "2026-08-28T03:56:00Z"
    result: pass
    scope: "WEB-A12 anonymous route checks"
    output_ref: "RAW-20260828-github-a12-keystatic-boundary"
    notes: "Reachability only; auth not tested."
alternatives: []
unresolved_conflicts: []
supersedes: []
superseded_by: null
provenance:
  derived_from: [RAW-20260828-web-a4-baseline-smoke, RAW-20260828-github-a12-keystatic-boundary]
  reviewed_by: "site-bootstrap maintainer"
error_signatures: []
---

# Generated-site acceptance and handover

## Purpose and scope

A bounded pre-release procedure for a generated baseline site. It proves the
observed build and route contract for the tested environment; it does not certify
production security, search ranking, accessibility conformance, or Core Web Vitals.

## Preconditions

- Use the supported scaffolder and a disposable or authorized target.
- Confirm repository, dependency versions/lockfile, configured provider and output mode.
- Keep credentials outside files and command output.

## Steps

1. **S-001** — Run `npm run verify`; stop on errors. Evidence: `RAW-20260828-web-a4-baseline-smoke` / `VR-ACCEPT-001`.
2. **S-002** — Run `npm run build`; record output mode and warnings. Evidence: `RAW-20260828-web-a4-baseline-smoke` / `VR-ACCEPT-001`.
3. **S-003** — For Node SSR, confirm `dist/server/entry.mjs` exists and start it with host-provided `HOST`/`PORT`. Evidence: `RAW-20260828-web-a4-baseline-smoke` / `VR-ACCEPT-001`.
4. **S-004** — Smoke `/`, `/blog`, and `/keystatic` as applicable; record status and content type without retaining sensitive bodies. Evidence: `RAW-20260828-web-a4-baseline-smoke` and `RAW-20260828-github-a12-keystatic-boundary` / `VR-ACCEPT-001` and `VR-ACCEPT-002`.
5. **S-005** — Inspect generated HTML for required title/description/viewport and the sitemap link. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
6. **S-006** — If the template enables sitemap generation, inspect `sitemap-index.xml` and numbered sitemaps and confirm intended origin/path. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
7. **S-007** — If content images exist, check meaningful `alt` and stable dimensions; otherwise mark image checks not applicable. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
8. **S-008** — Perform manual semantic HTML, labels, keyboard, visible-focus and no-trap checks for interactive UI. Evidence: verification run required; not present in A4/A10 and must be recorded as `not_run` when omitted.
9. **S-009** — Check canonical, Open Graph, JSON-LD and `robots.txt` only when the site has an explicit requirement for them. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
10. **S-010** — Record provider, runtime, commit, routes, warnings, evidence locations and limitations. Evidence: `RAW-20260828-web-a5-e-deployment-mapping` and `RAW-20260828-web-a4-baseline-smoke`.

## Verification

Acceptance requires successful `verify`/`build`, expected output for the configured
mode, and required route checks. A route returning HTTP 200 proves reachability only;
it is not authentication or authorization evidence. Record optional checks as
`pass`, `fail`, or `not_applicable` rather than silently treating absence as failure.

## Rollback / recovery

Use the last known-good commit/image, restore the prior lockfile/configuration, and
repeat verify/build and health/route checks. Preserve the failed result as evidence;
do not overwrite it with a later successful run.

## Security and safety

Never log or commit secrets, cookies, tokens, private URLs, PII, auth headers or
runtime payloads. Do not run production auth tests with real credentials in a
captured workflow.

## Related records

- [Baseline compatibility matrix](../architecture/baseline-compatibility.md)
- [Raw baseline smoke](../raw/web/web-a4-baseline-smoke.md)
- [Raw acceptance smoke](../raw/web/web-a10-generated-acceptance.md)
- [Raw admin boundary smoke](../raw/github/web-a12-keystatic-boundary.md)
- [Raw deployment mapping](../raw/web/web-a5-e-deployment-mapping.md)
