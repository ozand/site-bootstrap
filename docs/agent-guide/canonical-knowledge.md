# Canonical knowledge synthesis contract

This document defines how reviewed canonical knowledge is synthesized from the
project's raw captures and verification records. It is deliberately separate from
the [raw evidence contract](./raw-evidence.md), the [cross-source verification
policy](./cross-source-verification.md), and the project-local lesson contract.

## Purpose and boundaries

Canonical knowledge is a concise, reviewed answer for agents and humans. It is not
a second raw archive. The source-to-knowledge path is:

```text
raw capture -> optional cleaned derivative -> verified claim ledger -> canonical page
```

- Raw captures remain immutable and are stored under `kb/raw/`.
- A cleaned page or transcript is a derived representation and records its raw
  parent, transform, tool/version, and material losses.
- Canonical pages live outside `kb/raw/`, contain bounded claims, and link back to
  exact evidence.
- A search hit, source recency, or QMD rank never upgrades a claim's status.

This is a documentation contract and does not add a validator, CLI, new lesson
store, or automatic ingestion.

## Compatibility with existing contracts

Existing canonical OKF pages retain these required fields:

```yaml
id: <PREFIX>-<NUMBER>
title: "Clear title"
category: "concept, architecture, setup, or other project category"
tags: [tag]
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
environment:
  os: any
  shell: any
  tools: []
error_signatures: []
```

The current `status` is the **page lifecycle** and must not be treated as proof
that every claim is confirmed. Each material claim has its own epistemic status as
defined by the cross-source verification policy. Canonical pages are indexed by the
wiki collection, not the raw collection.

## Minimal `canonical-v1` envelope

For new research-derived pages, preserve the legacy fields above and add the
following fields. During migration, legacy pages may remain readable without the
new fields; new or materially updated research pages should use this envelope.

```yaml
---
canonical_schema: canonical-v1
id: FRAMEWORK-0001
title: "Short descriptive title"
category: concept | architecture | setup | procedure | compatibility | decision | lesson
tags: [tag]
status: draft | active | deprecated | superseded | rejected
created: 2026-08-27
updated: 2026-08-27
environment:
  os: any
  shell: any
  tools: ["product@version"]
version_scope:
  product: "Product or system"
  versions: ["X.Y"]
  environments: ["Node.js", "VPS"]
  as_of: 2026-08-27
  applicability: "Explicit scope and non-goals"
owner: "public team or repository"
claims:
  - claim_id: C-001
    text: "One atomic, bounded claim"
    type: api_contract | observed_behavior | benchmark | workaround | opinion | historical_claim
    status: confirmed | corroborated | reported | hypothesis | deprecated | rejected
    evidence_refs: [RAW-001]
    verification_id: VR-001
    scope: "Version/environment/date scope"
evidence_refs:
  - evidence_id: RAW-001
    source_type: web | reddit | youtube | github
    url: "https://public.example/path"
    captured_at: "2026-08-27T00:00:00Z"
    source_version: "version, item ID, or full commit SHA"
    locator:
      kind: heading | line_range | timestamp | reddit_post | reddit_comment | github_path | json_path
      value: "Heading or precise location"
    notes: "Freshness, limitations, and scope"
verification:
  - verification_id: VR-001
    method: docs_review | reproduction | comparison | benchmark | manual_review
    performed_at: "2026-08-27T00:00:00Z"
    result: pass | partial | fail | not_run
    scope: "Test scope and environment"
    output_ref: "Sanitized output/evidence reference"
    notes: "Relevant limitations"
alternatives: []
unresolved_conflicts: []
supersedes: []
superseded_by: null
provenance:
  derived_from: [RAW-001]
  reviewed_by: "public team or agent label"
error_signatures: []
---
```

Rules:

- `claims[].evidence_refs` must resolve to declared evidence IDs. Every material
  factual sentence or operational step gets an atomic `claim_id` or `step_id`.
- A `verification_id` is required when the claim depends on runtime behavior,
  compatibility, a benchmark, security behavior, or workaround efficacy. A pure
  historical fact or attributed opinion may use `not_run` with an explanation.
- `status` in the page envelope describes lifecycle. The per-claim `status` carries
  epistemic status plus any scoped lifecycle outcome. Never use page `active` to
  erase per-claim uncertainty.
- `version_scope`, `environment`, and `applicability` must be explicit enough for a
  reader to tell whether the claim applies to their situation.
- `alternatives` and `unresolved_conflicts` are records, not reasons to silently
  average sources. Keep rejected alternatives attributed and evidence-backed.
- `provenance.derived_from` names raw or cleaned records; it does not replace the
  precise evidence references.

## Page structures

Choose the smallest page type that answers the reader's question. Do not duplicate
the same material in several page types without a real cross-link relationship.

### Framework guidance / concept

```markdown
---
canonical_schema: canonical-v1
id: FRAMEWORK-0001
title: "Framework capability"
category: concept
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
version_scope: {product: "Framework", versions: ["X.Y"], as_of: YYYY-MM-DD, applicability: "..."}
claims: []
evidence_refs: []
verification: []
tags: [framework]
---

# Framework capability

## Overview
What it is and which bounded problem it addresses.

## Key Facts
- **C-001** — concise factual claim with its status and evidence reference.

## Constraints and Non-goals
Version, platform, and unsupported use cases.

## Verified Examples
Minimal example only when evidence or a test supports it.

## Verification Notes
Review date, scope, and unresolved limitations.

## References
- `RAW-001` — [public source](https://public.example/path)
```

### Approach / pattern

Use: **Context → Problem → Pattern/Recommendation → Applicability → Trade-offs →
Failure modes → Verification → References**. Label recommendations separately from
facts. A recommendation must not be stronger than the evidence supporting it.

### API / compatibility

Use: **Contract → Supported versions → Configuration/request-response → Compatibility
matrix → Runtime verification → Breaking changes → References**. Pin each version
claim. “Works in version X” requires a successful scoped test, not docs alone.

### Deployment procedure

Use: **Purpose/scope → Preconditions → Inputs/outputs → Ordered steps → Expected
results/stop conditions → Verification → Rollback/recovery → Security/secret handling
→ Provider notes → References**. Never include real credentials. Provider docs and
locally verified behavior must be distinguished.

### Architecture decision

Use: **Context → Decision → Scope → Alternatives considered → Consequences/trade-offs
→ Revisit triggers → Evidence/review → Related records**. A preference is not an
ADR unless a durable choice and decision drivers are explicit.

## Synthesis and citation rules

1. Extract only claims explicitly present in raw evidence or established by a
   documented verification run. Do not invent features, causality, compatibility,
   numbers, or universal scope.
2. Keep canonical prose concise; do not copy whole pages, transcripts, threads, or
   payloads. Quote only the minimum necessary text with attribution.
3. Preserve source scope, version, environment, date, and limitations in the claim
   wording—not only in hidden metadata.
4. Reddit/YouTube reports and opinions remain `reported` unless independently
   corroborated by a primary source or reproducible test. They may appear in an
   explicitly attributed community/opinion section.
5. Use precise evidence locations: heading/line range, transcript timestamp, Reddit
   post/comment ID, GitHub full commit SHA + path, or JSON path.
6. Preserve unresolved conflicts and alternatives. If sources describe different
   versions/environments, split the claims instead of merging them.
7. Do not use QMD ranking, a no-hit result, or frontmatter presence as proof of a
   claim. Follow evidence refs to raw and then to the public primary source or test.
8. Canonical pages are reviewed conclusions. Raw and cleaned records remain the
   audit trail; canonical text must not become the only evidence copy.

## Review and publication checklist

### Evidence coverage

- [ ] Intended page type, research question, scope, and audience are explicit.
- [ ] Every material claim/step has a stable ID, status, version/environment scope,
      and precise evidence reference.
- [ ] Every referenced raw/cleaned artifact exists and its locator resolves.
- [ ] Verification records exist for behavior, compatibility, benchmarks,
      workaround efficacy, security, and “works in version X” claims.
- [ ] Primary-source requirements and genuine independence are satisfied; repeated
      copies/reposts are not counted as independent evidence.
- [ ] Conflicts, alternatives, stale/deleted material, and uncertainty are visible.

### Editorial and safety

- [ ] Facts, recommendations, constraints, opinions, and historical notes are
      visibly distinguished.
- [ ] No unsupported inference or upgrade from `reported`/`hypothesis` to
      `confirmed`.
- [ ] `deprecated`/`superseded` material is not presented as current default;
      `rejected` includes positive scoped counter-evidence or an explicit decision.
- [ ] Canonical text is a minimal synthesis, not a wholesale raw copy.
- [ ] No credentials, cookies, tokens, signed URLs, PII, private payloads, prompts,
      filesystem paths, or runtime/session state.

### Structure and repository

- [ ] Legacy OKF required fields remain present and frontmatter parses.
- [ ] IDs are unique; claim/evidence/verification IDs resolve and do not conflict.
- [ ] `provenance.derived_from`, `evidence_refs`, and References agree.
- [ ] Supersession/deprecation links preserve the previous page/claim and history.
- [ ] Canonical file is outside `kb/raw/`; links are repository-relative where
      applicable and do not create dead links.
- [ ] Run `kb-bootstrap validate --dir kb --project-root .`; after authorized
      maintenance, run the relevant QMD update and raw/wiki smoke searches.

## Versioning, updates, and deprecation

- Keep a page ID stable while its conceptual subject remains the same. Update
  `updated` only after a reviewed change.
- Add new evidence and verification records when sources or versions change; never
  overwrite raw captures or silently alter their meaning.
- If a material scope/version change changes the claim, assign a new claim ID or a
  version-specific page rather than broadening the old statement.
- When newer evidence supersedes guidance, mark the old claim/page `deprecated` or
  `superseded`, set `superseded_by` where applicable, and preserve historical text
  and evidence. `deprecated` does not mean false.
- Use `rejected` only for the exact scoped claim that has positive counter-evidence,
  failed reproducible verification, or an explicitly rejected architectural
  proposal; missing evidence is `needs_review`/unverified, not rejected.
- Re-verify current operational/API/security/deployment claims after material
  dependency or platform changes. Historical claims remain historical and should
  not be rewritten as current.
- Mutable web/Reddit/YouTube captures are new evidence versions when changed;
  GitHub branches/tags are discovery pointers and code claims should use full SHAs.

## Representative reviewed example

The following is a sanitized example of the *shape* of a canonical page. It uses
only project-local public contract facts and points to the existing raw research
record; it is illustrative guidance, not a new claim about an external product.

```markdown
---
canonical_schema: canonical-v1
id: QMD-0001
title: "Separate raw and canonical QMD collections"
category: architecture
status: active
created: 2026-08-27
updated: 2026-08-27
environment: {os: any, shell: any, tools: ["kb-bootstrap 0.2.x"]}
version_scope: {product: "kb-bootstrap", versions: ["0.2.x"], environments: ["project repository"], as_of: 2026-08-27, applicability: "Generated project knowledge bases"}
claims:
  - claim_id: C-001
    text: "The generated layout uses a canonical collection over kb/ excluding raw/** and a raw collection over kb/raw/."
    type: api_contract
    status: confirmed
    evidence_refs: [RAW-20260827-qmd-layout-research]
    verification_id: VR-001
    scope: "kb-bootstrap generated project layout"
evidence_refs:
  - evidence_id: RAW-20260827-qmd-layout-research
    source_type: web
    url: "https://github.com/ozand/kb-bootstrap/blob/main/README.md"
    captured_at: "2026-08-27T00:00:00Z"
    source_version: "main; exact commit should be pinned for immutable capture"
    locator: {kind: heading, value: "single-project layout and QMD validation"}
    notes: "Existing project-local raw record; source branch is mutable."
verification:
  - verification_id: VR-001
    method: docs_review
    performed_at: "2026-08-27T00:00:00Z"
    result: pass
    scope: "Compared captured contract with current local generated configuration."
    output_ref: "repository review"
    notes: "Does not claim QMD update or external rollout."
provenance: {derived_from: [RAW-20260827-qmd-layout-research], reviewed_by: "site-bootstrap maintainers"}
error_signatures: []
tags: [qmd, architecture]
---

# Separate raw and canonical QMD collections

## Overview
Use the canonical collection for reviewed project guidance and the raw collection
for explicit source inspection. Search relevance is not evidence of truth.

## Key Facts
- **C-001 (`confirmed`, scoped):** The generated layout separates canonical and raw
  collections. See `RAW-20260827-qmd-layout-research` at the stated heading.

## Constraints
The referenced raw capture points to a mutable `main` branch and therefore needs a
full source commit for immutable future capture. This example documents the local
contract; it does not claim a completed QMD rollout.

## References
- `RAW-20260827-qmd-layout-research` — [raw research record](../../kb/raw/web/qmd-layout-research.md)
- [kb-bootstrap README](../../kb-bootstrap/README.md)
```

The example is not a second canonical page in the KB; it demonstrates the required
mapping and review shape without duplicating the external source text.

## Relationship to existing records

- Raw capture mechanics and source safety: [raw-evidence.md](./raw-evidence.md).
- Cross-source claim verification: [cross-source-verification.md](./cross-source-verification.md).
- QMD search remains a separate procedure and keeps raw/wiki collections distinct:
  [QMD agent search](../../kb/procedures/qmd-agent-search.md).
- Project lessons retain their existing `PROJECT-XXXX`, `SCHEMA.md`, and `index.yaml`
  contract; this document does not create or migrate lesson records.
