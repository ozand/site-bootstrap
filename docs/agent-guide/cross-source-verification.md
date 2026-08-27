# Cross-source verification and claim-status policy

This document defines how evidence moves from `kb/raw/` into reviewed canonical
knowledge. It complements the [raw evidence and provenance contract](./raw-evidence.md)
and does not replace the canonical, lesson, procedure, or decision contracts.

## Purpose and boundary

A raw capture records what a source contained at capture time. Verification tests
whether a bounded claim is sufficiently supported for the intended use. A QMD hit,
rank, snippet, recent date, or repeated wording is a discovery aid—not proof.

The workflow is:

```text
raw claim -> normalize scope/type -> compare evidence -> reproduce when required
           -> record status/conflicts -> publish only reviewed canonical wording
```

Unknown or unavailable evidence is not a positive disproof. Keep the claim
unverified rather than turning missing confirmation into `rejected`.

## Claim taxonomy

Assign each material claim one primary type:

| Type | Meaning | Typical evidence requirement |
| --- | --- | --- |
| `api_contract` | documented API, schema, configuration, or guarantee | Current normative specification or official docs; run a conformance test before saying it works in a specific version. |
| `observed_behavior` | behavior actually seen in a named environment/version | Reproducible command or test with exact version, configuration, and result. |
| `benchmark` | measured performance or comparison | Workload, hardware, software/configuration, raw result, and preferably a repeat or independent reproduction. |
| `workaround` | mitigation for a failure, not necessarily its root cause | Sanitized failure signature, scope, steps, and verification of the mitigation. |
| `opinion` | preference, judgment, prediction, or interpretation | Attributed source and explicit opinion wording; never silently rewrite as fact. |
| `historical_claim` | statement about a past state or event | Dated primary artifact such as a release, tag, commit, changelog, or archived page. |

One source can support different claim types only when each claim has its own
wording and evidence location.

## Two-axis status model

Keep truth/knowledge status separate from record lifecycle:

- **Epistemic status:** `hypothesis`, `reported`, `corroborated`, `confirmed`.
- **Lifecycle:** `active`, `deprecated`, `rejected`.

The combined status may be written in a claim ledger as `claim_status`, but the
lifecycle reason must remain clear. `deprecated` means no longer current,
recommended, or applicable; it does not mean historically false. `rejected` is
reserved for an exact, scoped claim disproved by positive counter-evidence or a
failed reproducible test.

| Status | Minimum basis | Allowed interpretation/transition |
| --- | --- | --- |
| `hypothesis` | Question and rationale, without verified observation | Seek evidence; it may become `reported`, `corroborated`, or `confirmed`. Reject only after scoped disproof. |
| `reported` | One identifiable source with locator and scope | Appropriate for a single Reddit/YouTube report or opinion. Upgrade only with independent support; stale material may become deprecated. |
| `corroborated` | At least two genuinely independent evidence items, or a primary source plus an independent reproduction | Supported within stated scope, but not necessarily enough for a normative or high-risk guarantee. |
| `confirmed` | Current normative primary source for a contract, or successful reproducible verification for behavior/benchmark/workaround | Confirmed only for the named scope/version/environment; never a universal claim. |
| `deprecated` | Supersession, expiry, loss of applicability, or out-of-support version | Preserve the historical evidence and point to a replacement when available. Do not imply falsehood. |
| `rejected` | Explicit contradiction or failed reproducible test for the exact scoped wording | Record counter-evidence, test conditions, and scope. A narrower reformulation receives a new claim ID. |

Two URLs are not automatically independent: copied documentation, reposted videos,
comments repeating one parent, or multiple summaries of one announcement form one
evidence family. For critical API, security, compatibility, or production claims,
require a primary source plus an independent reproduction, or two independent
primary artifacts where reproduction is not meaningful.

## Source precedence and conflicts

Normalize every candidate claim before comparison: exact wording, product/version,
environment, date, source type, evidence family, and locator.

Precedence depends on the claim type:

1. **API/contract:** current official specification/docs → official release/changelog
   → maintainer issue/comment → independent reproduction → Reddit/YouTube opinion.
2. **Actual behavior:** reproducible test on the named version/environment → official
   docs (which may lag) → maintainer issue/report → community/video report.
3. **Release history:** signed/tagged commit or release/changelog → current docs →
   later commentary.
4. **Benchmark:** reproducible raw measurement → independent repeat → attributed
   report → opinion.

Do not delete lower-precedence evidence. Mark it as reported, qualified,
version-specific, stale, or contradicted and explain the scope. If sources describe
different versions or environments, split them into separate claims rather than
calling them a conflict. If a same-scope conflict remains unresolved, keep the
canonical wording qualified and no stronger than `corroborated`/`reported`.

A later source supersedes an earlier one only when it addresses the same scope and
provides a version/date or explicit replacement. Recency alone is not proof.

## Evidence references

Every material canonical claim needs an atomic `claim_id` and one or more precise
`evidence_ref` entries. Use the raw capture ID, public URL, capture date/version,
and a channel-appropriate locator:

```yaml
evidence_ref:
  evidence_id: RAW-20260827-example-a1b2c3
  source_type: web | reddit | youtube | github
  url: "https://public.example/path"
  captured_at: "2026-08-27T00:00:00Z"
  source_version: "release, item ID, or full commit SHA"
  locator:
    kind: heading | line_range | timestamp | reddit_post | reddit_comment | github_path | json_path
    value: "Configuration > SSR"
  notes: "Scope, freshness, and limitations"
```

Examples:

```yaml
# Web or cleaned capture
locator: {kind: line_range, value: "raw-web-001.md:L120-L141"}
# Reddit comment
locator: {kind: reddit_comment, value: "t1_comment; parent=t3_post"}
# YouTube transcript
locator: {kind: timestamp, value: "00:12:34-00:13:10"}
# GitHub content pinned to an immutable revision
locator: {kind: github_path, value: "path/to/file#L20-L48@FULL_COMMIT_SHA"}
# Structured API response
locator: {kind: json_path, value: "$.snippet.publishedAt"}
```

A generic link to `kb/raw/` without an evidence ID, version, and locator is not
sufficient. Canonical References should expose the evidence ID and readable URL;
the machine-readable claim ledger carries exact traceability.

## Freshness, mutable material, and missing evidence

Record `published_at`, `updated_at`, `captured_at`, effective product version, and
tool version separately. For GitHub code, branches and tags are discovery pointers;
resolve and record the full commit SHA. For web, Reddit, and YouTube, preserve the
capture-time hash/state and create a new capture when the source changes.

An edited/deleted/private/unavailable community item or a stale index limits current
verification but does not falsify the captured historical claim. A missing source,
no QMD hit, failed access attempt, or unrun test means `unverified`/`needs_review`,
not `rejected`. Version mismatch requires splitting the claim by version.

## Raw-to-canonical review gate

Before publishing a canonical claim, procedure, lesson, or decision:

- [ ] The claim is atomic, attributed where needed, typed, and bounded by version,
      environment, date, and applicability.
- [ ] Raw capture has stable identity, public token-free URL, UTC capture time,
      source context, hash/size, tool/version, quality, and limitations.
- [ ] Every material claim has a resolvable `evidence_ref` and precise locator.
- [ ] The evidence threshold for its type and risk is met; source families are
      genuinely independent.
- [ ] Reddit/YouTube reports and opinions remain reported unless primary evidence or
      reproducible verification supports a stronger status.
- [ ] Conflicts, alternatives, uncertainty, edits/deletions, and stale context are
      preserved explicitly; scope differences are not silently merged.
- [ ] A reproducible test is attached for observed behavior, benchmarks, workaround
      efficacy, compatibility/performance, security behavior, and “works in version X”
      claims. Pure historical facts and attributed opinions may not need runtime tests.
- [ ] `rejected` is used only with positive scoped counter-evidence or a failed test;
      missing confirmation never qualifies.
- [ ] Canonical wording is a synthesis, not a wholesale copy of raw material, and is
      stored outside `kb/raw/` with links back to evidence.
- [ ] No credentials, cookies, tokens, signed URLs, PII, private payloads, prompts,
      filesystem paths, or runtime/session state are present.
- [ ] Run `kb-bootstrap validate --dir kb --project-root .`; after authorized index
      maintenance, run QMD update and relevant raw/wiki smoke searches.

## Worked sanitized example

**Question:** Does a documented configuration work in a named Astro/Node version?

1. An official documentation capture states the configuration contract. A YouTube
   transcript and a Reddit comment describe a similar success, but both are assigned
   `reported` because they are derivative/community evidence.
2. A sanitized reproduction runs the documented command against the pinned version
   and succeeds. The claim becomes `confirmed` for that version/environment, with the
   test output and official heading in separate evidence refs.
3. A second capture reports failure on an older version. This is not a contradiction:
   split the claim by version and mark the older workaround `deprecated` if superseded.
4. If the reproduction cannot be run, retain the official contract as a documented
   claim and the community reports as `reported`; do not promote “works in version X”
   and do not mark anything `rejected`.

## Relationship to existing contracts

- Raw capture format and safety rules: [raw evidence contract](./raw-evidence.md).
- Canonical pages must remain outside `kb/raw/`; QMD raw and wiki collections stay
  separate. Search ranking is not verification.
- Project lessons retain their existing `PROJECT-XXXX`, `SCHEMA.md`, and `index.yaml`
  contract; this policy does not create a new lesson store or validator.
