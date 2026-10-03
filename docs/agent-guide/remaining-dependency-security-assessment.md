# Remaining dependency audit assessment — Issue #79

**Status:** assessment complete; no dependency remediation authorized or performed.
**Source:** merged `main` commit `310cbcf5226ad288a1a548e375aa6476d736590f` (PR #78).
**Environment:** one disposable supported scaffold; Node `v24.14.0`, npm `11.19.0`.
**Scope:** current-source audit, advisory and package constraint review. Excludes dependency/lock edits, candidate installs, fixes, auth/runtime probes, migrations, and deployment.

## Executive result

A fresh scaffold ran `npm ci` and `npm audit --json`. Npm reported **15 package findings** (2 low, 12 high, 1 critical), across 25 unique GHSA IDs; audit exit 1 is expected. This is a time-bound npm advisory snapshot, not a vulnerability count, exploitability result, or production-risk score.

The lockfile is unchanged and normalizes byte-for-byte to the pinned merged template input. Metadata-only options: devalue 5.9.3 is within Astro's `^5.6.2`; Astro-nested esbuild 0.28.1 is outside Astro's `^0.27.3`; sharp 0.35.x is outside Astro's optional `^0.34.0`. None were installed or tested. Astro 5 / Node adapter 9 major advisory groups lack an evidenced single compatible target in this bounded review; npm suggests Astro 7.3.5 / Node adapter 11.1.6, requiring separate owner decision and compatibility/ADR review. Astro 6 is not sufficient for critical GHSA-26w7-cxv4-gfx2, whose affected range is `<7.2.8`.

## Reproduction and provenance

From a detached worktree at the stated commit, scaffolded with:

```sh
node scripts/create-site.mjs --name remaining79-audit --domain example.test --target <scratch>/site --no-skills
cd <scratch>/site
npm ci
npm audit --json
```

Observed: `npm ci` succeeded, adding 863 packages and auditing 864. Audit exited 1; totals above. Source manifest SHA-256 `dad4acf963bc296b0bf772a28a007341805ac1ecf6e15aeaa37b24e7be08ac49`; fixture manifest SHA `b9beb0968851f0dfb8bd3012cf0a4a728423e05edd8e47220b802eb4f640416e`, normalizes exactly by replacing `remaining79-audit` with `__SITE_NAME__`. Source lock SHA `89562f9431765b9778c387f87d511c811ab9318c404737c090391c4f215311d8`; fixture lock SHA `9c7c54ef830b357a326d1b1ff7bf6c6a211aab48ab4e8c689e92a6bbbcd99525`, normalizes exactly by the same replacement. Both have 963 package nodes; no version deltas. No manifest or lock change occurred.

Portable receipts: [`remaining-dependency-audit-receipt.json`](./remaining-dependency-audit-receipt.json), SHA `e3faae7dffe9a6ccd93cae4133134709fbe2cc5739065f4a718b106b602ccb87`; [`remaining-dependency-ghsa-receipt.json`](./remaining-dependency-ghsa-receipt.json), SHA `c0d77a466bef09cfac200f253401a7f20c3af714d9ad7355c883becf50130f21`. GHSA receipt records authenticated read-only `gh api advisories/{GHSA}` GET, time, all 25 unique audit IDs, source severities/ranges/first-patched metadata, zero request errors. Raw command logs remain local disposable evidence.

## Current npm audit records

Severity is npm's aggregate package severity; per-advisory severity and affected ranges are in the attached receipts. Direct means declared in the template manifest. Some direct integration findings are inherited via Astro/Tailwind and have no package-specific GHSA.

| Package | npm severity | Declared | Audited node and installed version | GHSA IDs / inheritance | npm fix suggestion |
|---|---|---|---|---|---|
| `@astrojs/markdoc` | low | direct | `node_modules/@astrojs/markdoc` (0.15.11) | none; via astro | `{'name': '@astrojs/markdoc', 'version': '2.0.9', 'isSemVerMajor': True}` |
| `@astrojs/node` | high | direct | `node_modules/@astrojs/node` (9.5.5) | GHSA-3rmj-9m5h-8fpv, GHSA-c57f-mm3j-27q9, GHSA-r557-wffq-wvrc, GHSA-qh8j-hqjv-7m4x | `{'name': '@astrojs/node', 'version': '11.1.6', 'isSemVerMajor': True}` |
| `@astrojs/tailwind` | high | direct | `node_modules/@astrojs/tailwind` (6.0.2) | none; via astro, tailwindcss | `{'name': '@astrojs/tailwind', 'version': '2.1.3', 'isSemVerMajor': True}` |
| `astro` | critical | direct | `node_modules/astro` (5.18.2) | GHSA-j687-52p2-xcff, GHSA-xr5h-phrj-8vxv, GHSA-jrpj-wcv7-9fh9, GHSA-f48w-9m4c-m7f5, GHSA-7pw4-f3q4-r2p2, GHSA-4g3v-8h47-v7g6, GHSA-2pvr-wf23-7pc7, GHSA-8hv8-536x-4wqp, GHSA-26w7-cxv4-gfx2, GHSA-376h-93r7-7g6f | `{'name': 'astro', 'version': '7.3.5', 'isSemVerMajor': True}` |
| `astro-eslint-parser` | high | transitive | `node_modules/astro-eslint-parser` (1.4.0) | none; via fast-glob | `True` |
| `braces` | high | transitive | `node_modules/braces` (3.0.3) | GHSA-vfj7-8cjw-p6xm | `{'name': 'tailwindcss', 'version': '4.3.3', 'isSemVerMajor': True}` |
| `chokidar` | high | transitive | `node_modules/tailwindcss/node_modules/chokidar` (3.6.0) | none; via braces | `{'name': 'tailwindcss', 'version': '4.3.3', 'isSemVerMajor': True}` |
| `devalue` | high | transitive | `node_modules/devalue` (5.9.2) | GHSA-j22f-vq7h-c4qm, GHSA-hx4r-w6wj-j8fg, GHSA-mcm9-63f2-9j32, GHSA-wf3x-273g-mvxv, GHSA-x5rw-q4pp-hg5g, GHSA-4q55-j62x-fr9h | `True` |
| `esbuild` | low | transitive | `node_modules/astro/node_modules/esbuild` (0.27.7) | GHSA-g7r4-m6w7-qqqr | `{'name': 'astro', 'version': '7.3.5', 'isSemVerMajor': True}` |
| `eslint-plugin-astro` | high | direct | `node_modules/eslint-plugin-astro` (1.7.0) | none; via astro-eslint-parser | `True` |
| `fast-glob` | high | transitive | `node_modules/fast-glob` (3.3.3) | none; via micromatch | `{'name': 'tailwindcss', 'version': '4.3.3', 'isSemVerMajor': True}` |
| `http-cache-semantics` | high | transitive | `node_modules/http-cache-semantics` (4.2.0) | GHSA-ch52-4w7c-c8xp | `{'name': 'astro', 'version': '7.3.5', 'isSemVerMajor': True}` |
| `micromatch` | high | transitive | `node_modules/micromatch` (4.0.8) | none; via braces | `{'name': 'tailwindcss', 'version': '4.3.3', 'isSemVerMajor': True}` |
| `sharp` | high | transitive | `node_modules/sharp` (0.34.5) | GHSA-f88m-g3jw-g9cj, GHSA-rgj7-g3m4-5g8c | `{'name': 'astro', 'version': '7.3.5', 'isSemVerMajor': True}` |
| `tailwindcss` | high | direct | `node_modules/tailwindcss` (3.4.19) | none; via chokidar, fast-glob, micromatch | `{'name': 'tailwindcss', 'version': '4.3.3', 'isSemVerMajor': True}` |

## Parent, peer, engine, and candidate classification

| Finding / path | Pinned package constraint and metadata | Assessment-only classification |
|---|---|---|
| Astro nested `esbuild@0.27.7` | Astro `5.18.2` requires `esbuild ^0.27.3`; GHSA-g7r4-m6w7-qqqr affects `>=0.27.3 <0.28.1`. Registry `esbuild@0.28.1` exists with Node `>=18`. | 0.28.1 is outside Astro's `^0.27.3` (for 0.x, `<0.28.0`), so not a direct lock-only candidate under this parent range. Npm suggests Astro 7.3.5. No parent change/override authorized. Separate top-level `esbuild@0.25.12` is not the audit node. |
| Astro optional `sharp@0.34.5` | Astro requires optional `sharp ^0.34.0`; installed engine `^18.17.0 || ^20.3.0 || >=21.0.0`. GHSA-f88m-g3jw-g9cj affects `<0.35.0`; GHSA-rgj7-g3m4-5g8c affects `<0.35.4`. | Common advisory floor 0.35.4 is outside parent `^0.34.0`. Registry sharp 0.35.4 requires Node `>=20.9.0`; that does not resolve the parent mismatch. No lock-only compatible option established. |
| Astro `devalue@5.9.2` | Astro requires `devalue ^5.6.2`. Six GHSA records affect 5.9.2; primary receipt lists 5.9.3 first-patched for these records. Registry lists 5.9.3, within parent range. | Clearest compatible metadata candidate. Not installed, tested, or re-audited; not claimed to fix all current advisories in a later database state. Latest 6.0.2 is outside the parent range and registry metadata requires Node `>=22.17`. Devalue finding is observed from current audit; no cause beyond its own advisory record is inferred. |
| Astro `http-cache-semantics@4.2.0` | Astro requires `^4.2.0`; GHSA-ch52-4w7c-c8xp affects `<=4.2.0`. The queried registry version list showed 4.2.0 as last stable 4.x; exact query for 4.2.1 returned E404. | No compatible corrected version established by the bounded query. E404 is only an exact-version result, not proof no backport exists. Npm suggests Astro 7.3.5. |
| `@astrojs/node@9.5.5` | Four GHSA records. Registry peer: adapter 9.5.5 requires Astro `^5.17.3`. Npm suggests 11.1.6; registry peer for 11.1.6 is Astro `^7.2.1`. | Recommendation crosses current Astro major. No single compatible target for full Node advisory cluster established here. Major/architecture option requires owner decision, compatibility research, ADR. |
| Astro 5 and integrations | Astro engine `18.20.8 || ^20.3.0 || >=22`; Markdoc 0.15.11 peer Astro `^5.0.0`; Tailwind 6.0.2 peers Astro `^3 || ^4 || ^5`, Tailwind `^3.0.24`. Markdoc 2.0.9 peer Astro `^7.0.0`; Node adapter 11.1.6 peer Astro `^7.2.1`. | Npm's Astro 7.3.5 suggestion is major. Astro 6 remains affected by critical Astro `<7.2.8`. Markdoc/Tailwind audit package rows are inherited via Astro/Tailwind, not independent GHSAs in the receipt. No upgrade authorized. |
| Tailwind 3 transitive family | Tailwind 3.4.19 has `fast-glob@3.3.3`, `micromatch@4.0.8`, `braces@3.0.3`, nested chokidar 3.6.0. Parent ranges for braces include `^3.0.3` and `~3.0.2`. GHSA-vfj7-8cjw-p6xm affects `<=3.0.3` and has no first-patched version in the API receipt. | Read-only registry query listed 3.0.3 as highest 3.x; exact query for 3.0.4 returned E404. Thus no patched version within the observed existing 3.x ranges was available in that registry snapshot; a compatible fix is not established. This does not prove no alternate source/backport exists. Npm's Tailwind 4.3.3 suggestion is a major and was not tested; do not change parents without owner decision. |

Registry queries were read-only, writer-observed 2026-10-03; raw registry snapshots were not preserved. These are time-bound metadata observations, not candidate verification. The GHSA receipt is the durable primary advisory snapshot. No claim that all possible backports were exhaustively searched.

## Exposure and limitations

**Observed:** public `astro.config.mjs` uses static output and omits Keystatic; separate editor config uses Node adapter, server output, and Keystatic. Historical #74/#77 evidence includes public/editor builds and artifact inventories, but Issue #79 did not rebuild or launch profiles. **Inference:** public static output differs from the editor server artifact, while dependency code still executes during install, development, check/lint, image processing, and builds. **Unverified:** reachability, exploitability, live editor authentication/authorization, persistence, production deployment, or candidate fixes. Audit presence proves none. No runtime or auth requests were made.

## Recommendation and decision gate

If the owner wants the smallest follow-up, separately authorize testing devalue 5.9.3 as a lock-only candidate within Astro `^5.6.2`, with a fresh source-pinned install, audit, verify, public build and preserved artifact, then editor build. Separately assess whether a patched `http-cache-semantics` 4.x release becomes available. Do not override/widen Astro parent constraints for esbuild or sharp. Treat Astro/Node clusters and Markdoc/Tailwind migration targets as `needs_decision` requiring owner architecture approval, compatibility research, and ADR before implementation. This report does not assert that compatible backports are absent or that any untested version resolves every finding.

**Assessment status:** complete for Issue #79 criteria; independent review approved. **Development:** report and sanitized receipts only. **Tests:** one supported scaffold, `npm ci` passed, audit returned expected 1; lock identity retained. **Rollout:** none. **Residual risk:** 15 package findings (2 low, 12 high, 1 critical) remain in this snapshot; no exploitability conclusion.
