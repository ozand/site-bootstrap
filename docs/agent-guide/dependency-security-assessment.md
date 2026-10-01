# Dependency security assessment — Astro 5 factory

**Issue:** #74 · **Source revision:** `087df202f8dcd4a90622413d87042c727de3cdd0`
**Assessment:** 2026-10-01 · **Environment:** one disposable Windows scaffold
**Scope:** install/audit/verify/public build/editor build and metadata review. Excludes dependency changes, fixes, upgrades, auth tests, runtime probes, and deployment.
**Owner:** site-bootstrap repository owner · **Access/storage model:** public static output and separate private editor build; editor enforcement and persistence model not tested or inferred.

## Summary

The source-pinned scaffold audit reports nine vulnerable package records: 3 low, 5 high, 1 critical. Audit exit 1 is expected. The JSON contains 40 advisory-reference objects and 34 unique GHSA IDs. References can repeat across packages, and Markdoc/Tailwind package-level records inherit Astro findings; neither count is a count of distinct exploitable vulnerabilities.

The critical Astro and high Node-adapter audit recommendations point to major versions. No compatible Astro 5 backport was established. Keep dependency remediation separate: owner decision is needed before an Astro-5-compatible transitive refresh issue; Astro/adapter major migration requires a separate needs-decision, compatibility review, ADR, and explicit implementation approval. Do not use `npm audit fix` based on this report.

## Reproduction and provenance

Source is commit `087df202f8dcd4a90622413d87042c727de3cdd0`. The supported scaffold command was:

```sh
node scripts/create-site.mjs --name audit74 --domain example.test --target <scratch>/site --no-skills
cd <scratch>/site
npm ci
npm audit --json
npm run verify
npm run build
npm run build:editor
```

Toolchain: Node `v24.14.0`, npm `11.19.0`. Fixture path at assessment time: `C:/Temp/tmp.nFP8l375Di/site`. The generated `package.json` and `package-lock.json` each normalize byte-for-byte to the source files by replacing `audit74` with `__SITE_NAME__`. Source SHA-256 values: package manifest `dad4acf963bc296b0bf772a28a007341805ac1ecf6e15aeaa37b24e7be08ac49`; lockfile `5139cb79971bc32510aeb7362a6c30bc663dc1d10003876d3792f302a2cdbfe2`. Generated fixture hashes: `6041c2e933070e337cd38a77d517d9abaddb76dd96ed6f3b7786794c35710c37` and `fcd4683290aee73a5a6c4dcda9eb79780277af8ffd1cfa773aa100cee04423ef`, respectively. Source and fixture lockfiles each contain 962 dependency nodes and zero resolved-version differences.

- `npm ci`: passed, 863 packages; npm reported the same nine findings.
- `npm audit --json`: expected exit code 1. Sanitized full audit receipt is committed alongside this report as [`dependency-security-audit-receipt.json`](./dependency-security-audit-receipt.json), SHA-256 `5e80a6568f33ce09d8a5a8416a7313c24a3164274721d8a05207adeabaa00e27`. It retains npm package records, severities, ranges, nodes, suggested fixes, and advisory titles/URLs/CVSS; original raw npm JSON remains temporary at `C:/Temp/dependency74-audit.json` (SHA-256 `580d4d3da7b76629af2d1a0ce70845d80808769cf731058c49beeb4c0ae87f43`).
- `npm run verify`: passed; Astro check 0 errors/0 warnings and one existing TypeScript deprecation hint; ESLint passed.
- `npm run build`: passed; public static profile generated four HTML routes.
- After the editor build had replaced `dist`, the public static build was rerun in the same fixture and preserved separately at `C:/Temp/dependency74-public-preserved/`. The sanitized command log is `build.log` (SHA-256 `4d4f21e3b9d4988000cda93178ad0ef2ce29eb169801a036bdd6534b2483cf7f`); the 11-file path/SHA-256 inventory is `manifest.json` (SHA-256 `f1501c5a955035a418b321835b332e5bbcbe17c55cb22d98ca5ed460c04dbaf4`). This renewed build is evidence for static artifact composition only, not runtime/security.
- `npm run build:editor`: completed; this generated Node/editor output. Existing warnings: dynamic blog `getStaticPaths()` is ignored for SSR, and a Keystatic client chunk exceeds 500 KB.

This is one local disposable environment, not a production, cross-platform, or security exploit test. No server was launched and no authenticated route was probed.

## Audit findings

| Package and severity | Resolved version / advisories | Source path and bounded interpretation |
|---|---|---|
| `astro` — critical, direct | `5.18.2`; [GHSA-j687-52p2-xcff](https://github.com/advisories/GHSA-j687-52p2-xcff), [GHSA-xr5h-phrj-8vxv](https://github.com/advisories/GHSA-xr5h-phrj-8vxv), [GHSA-jrpj-wcv7-9fh9](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9), [GHSA-f48w-9m4c-m7f5](https://github.com/advisories/GHSA-f48w-9m4c-m7f5), [GHSA-7pw4-f3q4-r2p2](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2), [GHSA-4g3v-8h47-v7g6](https://github.com/advisories/GHSA-4g3v-8h47-v7g6), [GHSA-2pvr-wf23-7pc7](https://github.com/advisories/GHSA-2pvr-wf23-7pc7), [GHSA-8hv8-536x-4wqp](https://github.com/advisories/GHSA-8hv8-536x-4wqp), [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2), [GHSA-376h-93r7-7g6f](https://github.com/advisories/GHSA-376h-93r7-7g6f). Audit recommends `7.3.5` (major). | Core Astro is used during development/build; an emitted static artifact excludes SSR runtime but does not remove build-toolchain exposure. No affected path was exercised. |
| `@astrojs/node` — high, direct | `9.5.5`; [GHSA-3rmj-9m5h-8fpv](https://github.com/advisories/GHSA-3rmj-9m5h-8fpv), [GHSA-c57f-mm3j-27q9](https://github.com/advisories/GHSA-c57f-mm3j-27q9), [GHSA-r557-wffq-wvrc](https://github.com/advisories/GHSA-r557-wffq-wvrc), [GHSA-qh8j-hqjv-7m4x](https://github.com/advisories/GHSA-qh8j-hqjv-7m4x). Audit recommends `11.1.6` (major). | Private editor/server adapter path; editor build completed but no server/auth request was tested. Static-public delivery is not evidence about editor safety. |
| `@astrojs/markdoc` — low, direct dependency | `0.15.11`; npm record has `via: astro` and no package-specific GHSA, suggesting `2.0.9` (major). | The low package record is inherited from Astro's audit finding; it is not an independent Markdoc advisory. Registry metadata for 2.0.9 requires Astro `^7.0.0`. |
| `@astrojs/tailwind` — low, direct dependency | `6.0.2`; npm record has `via: astro` and no package-specific GHSA, suggesting `2.1.3` (major). | This package record inherits the Astro finding; it is not an independent integration advisory. Current integration peers on Astro 3/4/5 and Tailwind 3. The suggested lower version is a different release line; compatibility with this baseline is not established. |
| `brace-expansion` — high, transitive | `1.1.18`, `2.1.4`, `5.0.9`; [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p). Five installed nodes. | Some paths are dev tooling; one path is under Keystatic/minimatch. `fixAvailable: true` is a candidate signal only, not test evidence. |
| `esbuild` — low, transitive | `0.27.7` at `node_modules/astro/node_modules/esbuild`; a separate top-level lock entry is `0.25.12` and is not the audited node. [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr). | The advisory concerns Windows dev server. Npm's aggregate suggestion is Astro 7.3.5; no Astro-5-compatible remediation was established here. |
| `fast-uri` — high, transitive | `3.1.6`; [GHSA-qw65-cvwx-89v3](https://github.com/advisories/GHSA-qw65-cvwx-89v3), [GHSA-58mr-gqgx-xq4g](https://github.com/advisories/GHSA-58mr-gqgx-xq4g), [GHSA-hrr3-gc8f-f4qj](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj). | Via AJV/YAML language-server tooling. GHSA-qw65 lists first-fixed 3.1.7 for that advisory alone; audit also reports other applicable ranges, including the exact-3.1.6 GHSA-58mr and GHSA-hrr3 `<3.1.8`. These advisory checks do not establish one version fixes all paths. Candidate only for a separately authorized refresh. |
| `sharp` — high, transitive/optional | `0.34.5`; [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c). | Optional under Astro; audit suggests Astro 7.3.5. Platform-specific image processing exposure was not evaluated. |
| `undici` — high, transitive | `8.10.0`; [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v), [GHSA-pmjh-fq2x-6v4x](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x), [GHSA-r53p-7pc4-xj5r](https://github.com/advisories/GHSA-r53p-7pc4-xj5r), [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5), [GHSA-3xpg-4rpp-hhhm](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm), [GHSA-2jfj-6hjv-fm6j](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j), [GHSA-2gqq-gqf2-x968](https://github.com/advisories/GHSA-2gqq-gqf2-x968), [GHSA-w293-vg96-wgc3](https://github.com/advisories/GHSA-w293-vg96-wgc3), [GHSA-8436-99hf-9mmv](https://github.com/advisories/GHSA-8436-99hf-9mmv), [GHSA-vp8m-p9jh-q5pm](https://github.com/advisories/GHSA-vp8m-p9jh-q5pm), [GHSA-rx4f-c7p8-82vq](https://github.com/advisories/GHSA-rx4f-c7p8-82vq). | Via `unifont` under Astro. Candidate transitive update; preserve Astro scope and validate before changing. |

## Evidence interpretation and next decision

A sanitized portable audit receipt is included below so reviewers need not access the assessment machine's temporary directory. It preserves package-level severity, advisory IDs, installed versions, vulnerable ranges, and suggested fixes. The original JSON also contains the dependency node paths; the paths are omitted from the table for brevity. Full titles and CVSS data are in the linked GHSA records and original `npm audit --json` output.

| Package | Severity | Installed | Advisory IDs | Vulnerable range / npm suggestion |
|---|---|---|---|---|
| `@astrojs/markdoc` | low, inherited | 0.15.11 | no package-specific GHSA; `via: astro` | audit fix 2.0.9 (major) |
| `@astrojs/node` | high | 9.5.5 | GHSA-3rmj-9m5h-8fpv, GHSA-c57f-mm3j-27q9, GHSA-r557-wffq-wvrc, GHSA-qh8j-hqjv-7m4x; plus via `astro` | `<=11.1.2`; 11.1.6 (major) |
| `@astrojs/tailwind` | low, inherited | 6.0.2 | no package-specific GHSA; `via: astro` | audit suggests 2.1.3 (major); compatibility not established |
| `astro` | critical | 5.18.2 | GHSA-j687-52p2-xcff, GHSA-xr5h-phrj-8vxv, GHSA-jrpj-wcv7-9fh9, GHSA-f48w-9m4c-m7f5, GHSA-7pw4-f3q4-r2p2, GHSA-4g3v-8h47-v7g6, GHSA-2pvr-wf23-7pc7, GHSA-8hv8-536x-4wqp, GHSA-26w7-cxv4-gfx2, GHSA-376h-93r7-7g6f; plus `esbuild`, `sharp` | `<=7.2.7`; 7.3.5 (major) |
| `brace-expansion` | high | 1.1.18, 2.1.4, 5.0.9 | GHSA-q2hr-2g5m-vwhr, GHSA-qhr7-859c-m2p7, GHSA-6j4f-fj2g-mc7p | `<=1.1.20 || 2.0.0–2.1.6 || 4.0.0–5.0.11`; `fixAvailable: true` |
| `esbuild` | low | 0.27.7 | GHSA-g7r4-m6w7-qqqr | `0.27.3–0.28.0`; Astro 7.3.5 (major) |
| `fast-uri` | high | 3.1.6 | GHSA-qw65-cvwx-89v3, GHSA-58mr-gqgx-xq4g, GHSA-hrr3-gc8f-f4qj | `3.0.0–3.1.7`; `fixAvailable: true` |
| `sharp` | high | 0.34.5 | GHSA-f88m-g3jw-g9cj, GHSA-rgj7-g3m4-5g8c | `<=0.35.4-rc.0`; Astro 7.3.5 (major) |
| `undici` | high | 8.10.0 | GHSA-3wwx-pv8p-q78v, GHSA-pmjh-fq2x-6v4x, GHSA-r53p-7pc4-xj5r, GHSA-rfgv-xxqx-mfg5, GHSA-3xpg-4rpp-hhhm, GHSA-2jfj-6hjv-fm6j, GHSA-2gqq-gqf2-x968, GHSA-w293-vg96-wgc3, GHSA-8436-99hf-9mmv, GHSA-vp8m-p9jh-q5pm, GHSA-rx4f-c7p8-82vq | `8.0.0–8.10.1`; `fixAvailable: true` |

Npm totals: low 3, moderate 0, high 5, critical 1, total 9; graph total 962 (prod 751, dev 100, optional 111, peer 1). Advisories are grouped in `via` records; Astro's critical severity is the maximum of its associated records, not a claim that each listed GHSA is critical. The original raw npm audit JSON and full preserved public artifact bytes remain machine-local; sanitized audit, advisory, and public artifact manifests are portable repository evidence. Their recorded hashes identify the exact receipts.

**Observed:** source/fixture lock graph equivalence; audit findings and command results above; public static build and editor build both completed. **Inference:** the static artifact has no editor/server output; this only describes artifact composition, not whether build-time tools or the editor have exploitable paths. **Unverified:** advisory reachability/exploitability, live editor authentication/authorization and persistence, production deployment, alternate platforms, and compatible backports. **Non-claim:** neither the successful builds nor static output demonstrate that the template is secure or that findings are irrelevant.

**Decision needed:** does the owner authorize a separate bounded Astro-5-compatible transitive lock-refresh investigation? Until answered, no package edits or lockfile changes. Astro 7/adapter major migration is a distinct decision. If a transitive refresh is authorized, its required verification should include a fresh source-pinned `npm ci`, audit, `npm run verify`, public build, and editor build. Advisory data is mutable; repeat audit at that time.

**Assessment status:** complete for Issue #74's bounded dependency-security assessment; deferred remediation is outside this issue and remains unapproved. **Development:** only this report was drafted in the isolated assessment worktree; no product code/config/dependency changes. **Tests:** `npm ci`, `npm run verify`, public `npm run build`, editor `npm run build:editor` passed in disposable scaffold; audit returned expected nonzero 1. **Rollout:** not planned; no staging/production activity. **Blocker:** none for the assessment acceptance criteria. A separate owner decision is required only before any follow-up remediation work. **Residual risk:** nine audit package findings remain in pinned baseline; no security exploitability or private editor boundary assessment.

### Review disposition

The first independent review raised a major evidence-portability concern: receipts cited only from `C:/Temp` cannot be opened by another reviewer. To address it, the preceding sanitized package table was cross-checked directly against the captured JSON and added in this report. The original raw audit JSON and public artifact bytes remain in temporary local storage and are not committed; the sanitized audit receipt is portable and reviewable in-repository. The preserved public directory contains only the 11 inventoried static files; this supports the bounded observation about generated output, not a security conclusion. Independent reviews verified package versions, severity totals, direct/transitive status, audit hash, and nested Astro esbuild version. One reviewer could not independently reproduce the scaffold install stdout or re-hash the fixture lock inputs, so those are reported as observed provenance with the source/fixture hashes and normalization rule—not as reviewer-reproduced runs.

## Primary-source advisory cross-check (GitHub API GET, 2026-10-01)

The author retrieved all 34 unique GHSA IDs in the audit receipt through authenticated, read-only GitHub Advisory Database API GET requests (`gh api advisories/{GHSA}`), with no exploit testing. The sanitized full response is [`dependency-security-advisory-receipt.json`](./dependency-security-advisory-receipt.json), SHA-256 `0410f10e732cb77b6f95a9500d7e6eca07e4053a28ab4740b13bfc5497187e37`; it records method, timestamp, package, title, GitHub severity, published date, affected ranges, first-patched versions, URLs, and empty error list. GitHub severity is per advisory; npm severity is an aggregate per installed package and can differ. These records establish neither site exploitability nor overall package compatibility. First-patched versions apply only to their associated advisory/range; no cross-advisory fix or Astro 5 backport is inferred.

| Advisory | API affected range / severity | First fixed per advisory record | Audit's aggregate suggestion | Compatibility observation |
|---|---|---|---|---|
| [GHSA-26w7-cxv4-gfx2](https://api.github.com/advisories/GHSA-26w7-cxv4-gfx2) Astro AVIF image optimization RCE | `<7.2.8` / critical | `7.2.8` | Astro `7.3.5` | Confirms Astro 5.18.2 is affected per range; listed fix is Astro 7, no Astro 5 backport established. |
| [GHSA-3rmj-9m5h-8fpv](https://api.github.com/advisories/GHSA-3rmj-9m5h-8fpv) Node adapter body-size DoS | `<10.0.0` / moderate | `10.0.0` | Node adapter `11.1.6` | Adapter 9.5.5 is in range. |
| [GHSA-c57f-mm3j-27q9](https://api.github.com/advisories/GHSA-c57f-mm3j-27q9) Node adapter cache poisoning | `<10.0.5` / moderate | `10.0.5` | Node adapter `11.1.6` | Adapter 9.5.5 is in range. |
| [GHSA-r557-wffq-wvrc](https://api.github.com/advisories/GHSA-r557-wffq-wvrc) Node adapter redirect path handling | `>=8.1.0 <11.0.2` / low | `11.0.2` | Node adapter `11.1.6` | Adapter 9.5.5 is in range. |
| [GHSA-qh8j-hqjv-7m4x](https://api.github.com/advisories/GHSA-qh8j-hqjv-7m4x) Node adapter malformed Host port crash | `<=11.1.2` / high | `11.1.3` | Node adapter `11.1.6` | Adapter 9.5.5 is in range. |

### Complete primary-source GHSA receipt summary

The table below summarizes all 34 unique GHSA rows from the attached API receipt. GitHub Advisory severity is the source severity (the audit's package severity is an aggregate and may differ). Affected ranges and first-patched versions are exactly the API's `affected_and_first_patched` entries; do not treat one row's first-patched version as a fix for another advisory. The full machine-readable response fields and retrieval metadata are in [`dependency-security-advisory-receipt.json`](./dependency-security-advisory-receipt.json), SHA-256 `0410f10e732cb77b6f95a9500d7e6eca07e4053a28ab4740b13bfc5497187e37`.

| GHSA | Package | GitHub severity | Advisory affected ranges → first patched |
|---|---|---|---|
| [GHSA-j687-52p2-xcff](https://github.com/advisories/GHSA-j687-52p2-xcff) | `astro` | medium | `< 6.1.6` → 6.1.6 |
| [GHSA-xr5h-phrj-8vxv](https://github.com/advisories/GHSA-xr5h-phrj-8vxv) | `astro` | low | `< 6.1.10` → 6.1.10 |
| [GHSA-jrpj-wcv7-9fh9](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9) | `astro` | medium | `< 6.4.6` → 6.4.6 |
| [GHSA-f48w-9m4c-m7f5](https://github.com/advisories/GHSA-f48w-9m4c-m7f5) | `astro` | medium | `< 7.0.6` → 7.0.6 |
| [GHSA-7pw4-f3q4-r2p2](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2) | `astro` | low | `>= 3.10.0, < 7.0.4` → 7.0.4 |
| [GHSA-4g3v-8h47-v7g6](https://github.com/advisories/GHSA-4g3v-8h47-v7g6) | `astro` | medium | `>= 2.9.0, <= 7.0.9` → 7.1.0 |
| [GHSA-2pvr-wf23-7pc7](https://github.com/advisories/GHSA-2pvr-wf23-7pc7) | `astro` | high | `< 6.4.6` → 6.4.6 |
| [GHSA-8hv8-536x-4wqp](https://github.com/advisories/GHSA-8hv8-536x-4wqp) | `astro` | high | `< 6.3.3` → 6.3.3 |
| [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2) | `astro` | critical | `< 7.2.8` → 7.2.8 |
| [GHSA-376h-93r7-7g6f](https://github.com/advisories/GHSA-376h-93r7-7g6f) | `astro` | medium | `<= 7.2.3` → 7.2.4 |
| [GHSA-3rmj-9m5h-8fpv](https://github.com/advisories/GHSA-3rmj-9m5h-8fpv) | `@astrojs/node` | medium | `< 10.0.0` → 10.0.0 |
| [GHSA-c57f-mm3j-27q9](https://github.com/advisories/GHSA-c57f-mm3j-27q9) | `@astrojs/node` | medium | `< 10.0.5` → 10.0.5 |
| [GHSA-r557-wffq-wvrc](https://github.com/advisories/GHSA-r557-wffq-wvrc) | `@astrojs/node` | low | `>= 8.1.0, < 11.0.2` → 11.0.2 |
| [GHSA-qh8j-hqjv-7m4x](https://github.com/advisories/GHSA-qh8j-hqjv-7m4x) | `@astrojs/node` | high | `<= 11.1.2` → 11.1.3 |
| [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | `brace-expansion` | medium | `< 1.1.21` → 1.1.21; `< 2.1.7` → 2.1.7; `< 5.0.12` → 5.0.12 |
| [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | `brace-expansion` | high | `< 1.1.20` → 1.1.20; `< 2.1.6` → 2.1.6; `< 5.0.11` → 5.0.11 |
| [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | `brace-expansion` | high | `< 1.1.19` → 1.1.19; `< 2.1.5` → 2.1.5; `< 5.0.10` → 5.0.10 |
| [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) | `esbuild` | low | `>= 0.27.3, < 0.28.1` → 0.28.1 |
| [GHSA-qw65-cvwx-89v3](https://github.com/advisories/GHSA-qw65-cvwx-89v3) | `fast-uri` | high | `>= 3.0.0, < 3.1.7` → 3.1.7 |
| [GHSA-58mr-gqgx-xq4g](https://github.com/advisories/GHSA-58mr-gqgx-xq4g) | `fast-uri` | high | `= 3.1.6` → 3.1.7 |
| [GHSA-hrr3-gc8f-f4qj](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj) | `fast-uri` | medium | `>= 3.0.0, < 3.1.8` → 3.1.8 |
| [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) | `sharp` | high | `< 0.35.0` → 0.35.0 |
| [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) | `sharp` | high | `< 0.35.4` → 0.35.4 |
| [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v) | `undici` | medium | `>= 8.1.0, < 8.10.2` → 8.10.2 |
| [GHSA-pmjh-fq2x-6v4x](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x) | `undici` | medium | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-r53p-7pc4-xj5r](https://github.com/advisories/GHSA-r53p-7pc4-xj5r) | `undici` | low | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) | `undici` | high | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-3xpg-4rpp-hhhm](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm) | `undici` | medium | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-2jfj-6hjv-fm6j](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j) | `undici` | medium | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-2gqq-gqf2-x968](https://github.com/advisories/GHSA-2gqq-gqf2-x968) | `undici` | low | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-w293-vg96-wgc3](https://github.com/advisories/GHSA-w293-vg96-wgc3) | `undici` | high | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-8436-99hf-9mmv](https://github.com/advisories/GHSA-8436-99hf-9mmv) | `undici` | low | `>= 8.0.0, < 8.10.2` → 8.10.2 |
| [GHSA-vp8m-p9jh-q5pm](https://github.com/advisories/GHSA-vp8m-p9jh-q5pm) | `undici` | high | `>= 8.10.0, < 8.10.2` → 8.10.2 |
| [GHSA-rx4f-c7p8-82vq](https://github.com/advisories/GHSA-rx4f-c7p8-82vq) | `undici` | medium | `>= 8.0.0, < 8.10.2` → 8.10.2 |

Separately, the author queried read-only npm registry peer metadata: `@astrojs/node@9.5.5` requires Astro `^5.17.3`; `@astrojs/node@11.1.6` requires Astro `^7.2.1`. This indicates npm's Node adapter suggestion crosses the current Astro major boundary. These registry observations were not archived as response snapshots and remain author-reported. Advisory and registry sources are mutable; receipts here are point-in-time evidence.

The public artifact manifest is also committed alongside this report as [`dependency-security-public-artifact-manifest.json`](./dependency-security-public-artifact-manifest.json). It enumerates the 11 files and their hashes from the preserved public build; hash `1bd50562a6c92f4526c8d0b1ac1724fc87966a55c145226442f369218010006c`. The build log and preserved artifact bytes remain local temporary evidence.
