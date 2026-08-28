---
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

1. Run `npm run verify`; stop on errors.
2. Run `npm run build`; record output mode and warnings.
3. For Node SSR, confirm `dist/server/entry.mjs` exists and start it with host-provided `HOST`/`PORT`.
4. Smoke `/`, `/blog`, and `/keystatic` as applicable; record status and content type without retaining sensitive bodies.
5. Inspect generated HTML for required title/description/viewport and the sitemap link.
6. If the template enables sitemap generation, inspect `sitemap-index.xml` and numbered sitemaps and confirm intended origin/path.
7. If content images exist, check meaningful `alt` and stable dimensions; otherwise mark image checks not applicable.
8. Perform manual semantic HTML, labels, keyboard, visible-focus and no-trap checks for interactive UI.
9. Check canonical, Open Graph, JSON-LD and `robots.txt` only when the site has an explicit requirement for them.
10. Record provider, runtime, commit, routes, warnings, evidence locations and limitations.

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
