---
canonical_schema: canonical-v1
record_schema: record-v1
id: PROC-0002
title: "Generated-site acceptance and handover"
category: procedure
tags: [acceptance, verification, deployment, seo, accessibility, performance]
status: active
created: 2026-08-28
updated: 2026-09-23
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
    evidence_refs: [RAW-20260828-web-a4-baseline-smoke, RAW-20260828-web-verification-run-site-bootstrap-8a1d30b]
    verification_id: VR-ACCEPT-001
    scope: "Project baseline workflow and verification-run identity"
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
  - evidence_id: RAW-20260828-web-verification-run-site-bootstrap-8a1d30b
    source_type: web
    url: "https://github.com/ozand/site-bootstrap"
    captured_at: "2026-08-28T22:50:00Z"
    source_version: "template commit ed7b1a7e4e597891471396d6bd8569946f0aefb0"
    locator:
      kind: line_range
      value: "kb/raw/web/verification-run-20260828-site-bootstrap.md:L1-L48"
    notes: "Versioned metadata-only contract example; not an executed verification."
  - evidence_id: RAW-20260828-github-a12-keystatic-boundary
    source_type: web
    url: "https://github.com/ozand/site-bootstrap"
    captured_at: "2026-08-28T03:56:00Z"
    source_version: "Astro 5.18.2 / Node 9.5.5 / Keystatic Astro 5.2.0 / Core 0.5.51; generated-fixture runtime observation"
    locator:
      kind: line_range
      value: "kb/raw/github/web-a12-keystatic-boundary.md:L49-L62"
    notes: "Anonymous runtime observation; not a source-code claim and not an immutable GitHub object anchor."
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
  - verification_id: VR-ACCEPT-003
    method: manual_review
    performed_at: "2026-08-28T00:00:00Z"
    result: not_run
    scope: "Manual semantic/keyboard/focus/no-trap audit was not performed in A4/A10"
    output_ref: "RAW-20260828-web-a10-generated-acceptance"
    notes: "This procedure step remains a required future check for interactive UI."
alternatives: []
unresolved_conflicts: []
supersedes: []
superseded_by: null
provenance:
  derived_from: [RAW-20260828-web-a4-baseline-smoke, RAW-20260828-github-a12-keystatic-boundary, RAW-20260828-web-verification-run-site-bootstrap-8a1d30b]
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
- Assign a unique `verification_run.run_id` and record the exact template commit SHA,
  input manifest hashes, and runtime tool versions before running checks.
- Keep credentials outside files and command output.

## Steps

1. **S-001** — Run `npm run verify`; stop on errors. Evidence: `RAW-20260828-web-a4-baseline-smoke` / `VR-ACCEPT-001`.
2. **S-002** — Run `npm run build`; record output mode and warnings. Evidence: `RAW-20260828-web-a4-baseline-smoke` / `VR-ACCEPT-001`.
3. **S-003** — For Node SSR, confirm `dist/server/entry.mjs` exists and start it with host-provided `HOST`/`PORT`. Evidence: `RAW-20260828-web-a4-baseline-smoke` / `VR-ACCEPT-001`.
4. **S-004** — Smoke `/`, `/blog`, and `/keystatic` as applicable; record status and content type without retaining sensitive bodies. Evidence: `RAW-20260828-web-a4-baseline-smoke` and `RAW-20260828-github-a12-keystatic-boundary` / `VR-ACCEPT-001` and `VR-ACCEPT-002`.
5. **S-005** — Inspect generated HTML for required title/description/viewport and the sitemap link. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
6. **S-006** — If the template enables sitemap generation, inspect `sitemap-index.xml` and numbered sitemaps and confirm intended origin/path. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
7. **S-007** — If content images exist, check meaningful `alt` and stable dimensions; otherwise mark image checks not applicable. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
8. **S-008** — Perform manual semantic HTML, labels, keyboard, visible-focus and no-trap checks for interactive UI. Evidence: `VR-ACCEPT-003`.
9. **S-009** — Perform deterministic rendered route navigation and layout checks on primary consumer routes defined by the site's information architecture:
   - Verify mutual route discoverability and visibility across narrow mobile viewports (360px and 390px) as well as representative desktop viewports (e.g. 1280px).
   - Confirm primary calls-to-action (CTA) remain accessible, distinguishable, and unclipped across tested viewports.
   - Verify absence of unwanted horizontal document-level overflow (`document.documentElement.scrollWidth <= window.innerWidth`).
   - Confirm visible focus indicators and accessible keyboard activation for all rendered navigation links and action items.
   - Record viewport-by-viewport findings (`pass` or `fail`); mark `not_applicable` only when a site architecture explicitly defines no global navigation header (e.g., single-page splash or headless distribution). Evidence: Record in procedural test evidence alongside S-008 checks.
10. **S-010** — Check canonical, Open Graph, JSON-LD and `robots.txt` only when the site has an explicit requirement for them. Evidence: `RAW-20260828-web-a10-generated-acceptance`.
11. **S-011** — Record provider, runtime, commit, routes, warnings, evidence locations and limitations, together with the `verification_run` metadata. Evidence: `RAW-20260828-web-a5-e-deployment-mapping` and `RAW-20260828-web-a4-baseline-smoke`.

## Verification

Acceptance requires a complete `verification_run` record plus successful `verify`/`build`, expected output for the configured
mode, and required route checks. Confirm the recorded template commit, input manifest
hashes, and runtime versions match the actual verification inputs before accepting the
result. A route returning HTTP 200 proves reachability only;
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
