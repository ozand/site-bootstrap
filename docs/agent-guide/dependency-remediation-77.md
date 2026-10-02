# Issue #77 — compatible transitive lock refresh

**Status:** reviewed and approved for PR; implementation remains limited to the candidate lockfile refresh.
**Source baseline:** commit `8441af8d999d8506c78ee868eaad52a2db3761d1`.
**Owner authorization:** bounded attempt to update only `brace-expansion`, `fast-uri`, `undici` transitive nodes; no Astro 5 changes, audit fix, overrides, new deps, direct version changes, auth, or deployment.
**Environment:** Windows disposable scaffolds; Node `v24.14.0`, npm `11.19.0`.

## Result

Candidate changes exactly seven resolved package nodes in `templates/base-astro/package-lock.json` and the evidence report `docs/agent-guide/dependency-remediation-77.md`:

| Package node | Baseline | Candidate |
|---|---:|---:|
| `@eslint/config-array/node_modules/brace-expansion` | 1.1.18 | 1.1.21 |
| `@eslint/eslintrc/node_modules/brace-expansion` | 1.1.18 | 1.1.21 |
| `@typescript-eslint/typescript-estree/node_modules/brace-expansion` | 5.0.9 | 5.0.12 |
| `node_modules/brace-expansion` | 2.1.4 | 2.1.7 |
| `eslint/node_modules/brace-expansion` | 1.1.18 | 1.1.21 |
| `node_modules/fast-uri` | 3.1.6 | 3.1.8 |
| `node_modules/undici` | 8.10.0 | 8.11.2 |

Each remains within the existing parent range: brace-expansion parents require `^1.1.7`, `^2.0.2`, or `^5.0.8`; fast-uri is required by AJV as `^3.0.1`; unifont requires undici `^8.0.0`. The candidate was produced in a fresh supported scaffold by targeted `npm update brace-expansion fast-uri undici --package-lock-only --ignore-scripts --no-audit`, then copied back after diff review. Seven nodes changed and no others; package manifest/root dependency declarations were unchanged. Direct resolved versions remain Astro 5.18.2, `@astrojs/node` 9.5.5, Markdoc 0.15.11, Tailwind 6.0.2. Candidate direct dependencies and versions were checked against baseline. The source manifest constraints still document Node.js 18+ (npm 9+); candidate engines for `brace-expansion@5.0.12` are `20 || >=22`, while its baseline 5.0.9 has the same engines; undici baseline 8.10.0 and candidate 8.11.2 both require `>=22.19.0`. This lock change therefore does not introduce a new Node engine floor relative to those resolved baseline nodes, but the scaffold/docs' general Node 18 statement is not universal package-engine certification.

## Same-source evidence and audit delta

Both authoritative fixtures were created by `scripts/create-site.mjs --no-skills` using template files from the same pinned source commit, one in a detached source worktree and one in the candidate branch. Source baseline audit: 10 findings (3 low, 6 high, 1 critical). Candidate audit: 7 findings (3 low, 3 high, 1 critical). The candidate audit JSON is not byte-identical to baseline: the exact npm package findings `brace-expansion`, `fast-uri`, and `undici` are absent after the selected refresh. A separate `devalue` finding appears in the fresh same-source baseline (not in the earlier #74 snapshot), reflecting mutable audit/advisory data; the residual candidate audit has seven findings. This is a time-bound npm result, not a guarantee every security concern is resolved.

| Evidence | Baseline | Candidate |
|---|---|---|
| Audit JSON SHA-256 | `9d3e18267da4c70cbd65321a55c5f35036681dd26353f1a18898f4d4590be1a4` | `f59a063f1d0b30da2f7268abb7d87b13c42599a3a2a749137915fccf95e7a791` |
| Scaffold lock SHA-256 | `92eb9d85ee290902cc88fd97110589ea26c784478245830ce3f40e49cfe1c344` | `f632e3e202d31d8900057811266604ee2873ccf43c68f1f4d4450f3baf091819` |
| Verify | pass, 0 errors / 0 warnings / 1 existing hint | pass, 0 errors / 0 warnings / 1 existing hint |
| Public build | pass, four routes | pass, four routes |
| Preserved public artifact | 11 files; manifest SHA `264d0d1eaaa6acb1e8152f658c2feeb90194b81ded878f84f35b0822a6979fe7` | 11 files; manifest SHA `6ee8872129ea7b049d1f6d6561410c4d5146367740ff5c09eb3457b6286f0715` |
| Editor build | pass | pass |

Full sanitized audit JSON and public artifact manifests are available in the disposable evidence paths listed in `C:/Temp/dependency77-evidence-sha256.txt`. A prior exploratory fixture was contaminated with candidate lock resolution before its first audit; it is explicitly excluded from the authoritative baseline. The source-baseline and candidate fixtures were recreated cleanly and audited as described above. Command logs and raw artifacts are local scratch evidence and are not committed. Baseline and candidate `npm ci` succeeded. Editor builds completed with existing Keystatic chunk size warning; no editor server was run.

## Interpretation and residual risk

Observed: only the seven listed nodes changed, lock graph node count remained constant, direct manifest and protected resolved versions remained unchanged, baseline audit reported 10 package findings and candidate reported 7, with the selected three package records removed from candidate. Inference: the selected package records were refreshed compatibly according to lockfile parent ranges and removed from that audit snapshot. Unverified: exploitability/reachability and all runtime behavior. Residual findings remain: 3 low, 3 high, 1 critical, including the Astro/Node major-advisory cluster; remediation is not authorized by this issue beyond the three selected transitive families. No production rollout, authentication/authorization tests, migrations, or existing-site changes occurred.

**Acceptance status:** implementation and required checks complete; independent lock-compatibility, audit-evidence, and preserved-artifact reviews approved. Ready for PR; no merge or rollout performed. PR will reference Issue #77 without closing it.
