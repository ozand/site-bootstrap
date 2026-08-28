# Research coverage inventory

This inventory maps the agreed research questions to available evidence and reusable
outputs. It is a planning and freshness aid, not a claim that every area is verified.
Update the inventory when a new versioned capture or verification changes coverage.
Do not duplicate source content here.

**Reviewed:** 2026-08-28 · **Owner:** site-bootstrap maintainers

## Coverage states

- `covered`: a bounded primary/reproducible result exists for the stated scope.
- `partial`: useful evidence exists, but important scope, version or verification is missing.
- `access-blocked`: the source channel could not be safely read; this is not evidence that content is absent.
- `unrun`: the check or reproduction has not been performed.
- `context-only`: educational/reported material exists, but it is not canonical proof.

## Inventory

| Research area / question | Channel(s) | Evidence / outputs | State | Confidence and limitations | Next action |
| --- | --- | --- | --- | --- | --- |
| Baseline scaffold compatibility | primary + reproduction | `RAW-20260828-web-a4-baseline-smoke`; `kb/architecture/baseline-compatibility.md` | covered (scoped) | High for one resolved Astro 5/Node/Keystatic fixture; no cross-platform or future-resolution guarantee | Repeat with a new versioned run identity after input/version changes |
| Content/Markdoc/Zod ↔ Keystatic schema boundary | primary + local comparison | `RAW-20260828-web-cd-content-schema`; `kb/apps/content-schema-boundary.md`; `scripts/test_schema_negative_path.py` | covered (scoped) | Primary docs/package anchors plus local mapping; broader editing/date/slug behavior needs fixture coverage | Run controlled draft/slug and mismatch fixture when authorized |
| Generated-site acceptance | local reproduction | `RAW-20260828-web-a10-generated-acceptance`; `kb/procedures/generated-site-acceptance.md`; `scripts/test_site_quality.py` | partial | Basic verify/build/route/DOM/keyboard/load smoke exists; no axe/WCAG/Lighthouse/field CWV or production claim | Add approved current-version audits with explicit methodology |
| Keystatic `/keystatic` exposure/auth | primary source + local anonymous smoke | `RAW-20260828-github-a12-keystatic-boundary`; procedure S-004; no current auth capture | partial | Anonymous reachability only; no OAuth, permissions, write, cookie or deployment test; source is a fixture reference | Run disposable auth/authorization matrix with sanitized statuses only |
| Node SSR/VPS/Docker operation | primary docs + local config | `RAW-20260828-web-a5-e-deployment-mapping`; `hosting/vps/README.md`; Issue #20 blocker | partial / blocked | Recipe and Node entrypoint documented; Docker engine unavailable and no image/run/health result | Re-run Issue #20 when engine and authorized env fixture exist |
| Provider deployment/rollback | primary docs + community context | B-cycle reports; Vercel docs cross-checks; no local provider run | unrun | Provider contracts are not Astro deployment proof; no live promotion/rollback/health verification | Select one disposable provider and record promotion/rollback evidence |
| SEO metadata/sitemap | local artifact + primary docs + tutorial context | `RAW-20260828-web-a10-generated-acceptance`; Astro sitemap docs; B7 YouTube reports | partial | Sitemap/title/description checked; canonical/OG/JSON-LD/robots optional/absent in fixture; tutorial reports are not benchmarks | Define project-required head contract, then assert rendered HTML |
| Image optimization / asset boundary | primary docs + tutorial context | Astro Images docs; B7 `VsZ6feIU_bA` report | context-only / partial | Tutorial has sample network observations but old/version-specific, no current lab benchmark | Run current `src/` vs `public/` image comparison |
| Accessibility | primary standards + local basic smoke | `scripts/test_site_quality.py`; WCAG/MDN cross-checks in B7/B10 | partial | Basic alt/href/first-tab smoke only; no axe/WCAG conformance audit or screen-reader test | Run automated + manual keyboard/focus audit |
| Performance / Core Web Vitals | primary references + local load smoke | `scripts/test_site_quality.py`; web.dev Vitals; B7/B10 reports | partial | Local loadEventEnd budget is not Lighthouse/CWV field data; no repeated controlled benchmark | Define repeatable Lighthouse/Web Vitals methodology and run it |
| Agent repository instructions and PR verification | primary + YouTube context | `docs/agent-guide/*`; B3/B9 reports; `docs/agent-guide/youtube-source-registry.md` | context-only / covered (process) | Process pattern supported; no controlled quality/safety benchmark; YouTube claims remain reported/not-promoted | Add process checks only when tied to a concrete acceptance workflow |
| Reddit practical evidence | Reddit + mirrors | REDDIT-C/D and B8/B9 reports | access-blocked | Native/JSON 403; PullPush/RSS 429; browser ownership not confirmed; this is access limitation, not absence of content | Retry only after explicit owned browser window/session; require post/comment context |
| YouTube practical evidence | YouTube | `docs/agent-guide/youtube-source-registry.md`; existing B-cycle reports | context-only | Mostly auto-captioned tutorials/demos; approved means research context, not verified claim; claims remain not-promoted | Prefer current reproducible Astro-specific demos over generic tutorials |
| QMD/KB ownership and scope | primary framework source + local config | `kb/decisions/qmd-collection-layout.md`; `kb/raw/web/qmd-layout-research-v2.md`; `qmd.json`; collection YAML | covered (scoped) | Project-local config and generated-site exclusion documented; QMD runtime/index freshness is separate | Run authorized `qmd update` + two collection smoke searches |

## Interpretation rules

- `covered` always carries a scope; it does not mean production certification.
- `partial` and `unrun` are content/verification gaps.
- `access-blocked` records an access/ownership limitation; never convert it to “no results”.
- YouTube `approved` in the source registry means suitable for bounded research context only; its claims remain reported/not-promoted unless independently verified.
- Community reports are not independent confirmation merely because multiple comments or videos repeat the same idea.
- Existing raw captures are immutable; new versions must use new capture IDs.

## Review checklist

1. Check each row’s evidence IDs and paths resolve.
2. Recheck `captured_at`, source version, claim status and limitations.
3. Move `partial`/`unrun` only after a scoped reproducible check or qualifying primary evidence.
4. Keep access failures separate from content absence.
5. Do not add raw community records without safely captured body/comment or timestamped bounded evidence.
6. Record next action without silently expanding an existing issue’s scope.
