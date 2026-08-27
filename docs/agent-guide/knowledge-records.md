# Knowledge records: lessons, procedures, and decisions

This document standardizes three reusable record types for the project knowledge
base. It is an additive guide: it does not migrate existing records, create a new
registry, or change the `kb-bootstrap` CLI.

## Record boundaries

Choose the record by the question a future agent needs answered:

| Record | Create when | Primary question | Required outcome | Do not create when |
| --- | --- | --- | --- | --- |
| **Lesson** | A recurring or non-obvious failure has a verified cause and fix. | What failed, why, and how do we prevent recurrence? | Symptom → Root Cause → Resolution → Verification → Prevention. | The failure is one-off, the cause is only suspected, or the content is a general how-to. |
| **Procedure / runbook** | An operation must be repeated safely with ordered actions and checks. | How do we perform this operation? | Preconditions → Inputs/Outputs → Steps → Verification → Rollback/Recovery. | There are no reproducible steps, or the record only explains a durable choice. |
| **Architecture decision** | A durable choice among alternatives needs rationale, scope, trade-offs, and revisit conditions. | What did we choose, why, and when should we reconsider it? | Context → Decision → Alternatives → Consequences → Revisit Triggers. | It is a temporary workaround, routine instruction, or unsupported preference. |

If none of these questions applies, keep a reviewed canonical note or raw evidence
instead. One incident can produce several linked records only when each has a
different purpose: a lesson captures the failure, a procedure captures a repeatable
operation, and a decision captures a durable choice. Do not copy one narrative into
all three records.

## Existing contracts and ownership

The following are **confirmed project contracts** and must not be silently changed:

- Project lessons live in `kb/lessons/`, use `PROJECT-XXXX` IDs, and are catalogued
  by `kb/lessons/index.yaml`.
- Existing lessons require the current frontmatter and sections in the
  [project lesson schema](../../kb-bootstrap/kb_bootstrap/templates/lessons/SCHEMA.md):
  `id`, `title`, `category`, `severity`, `tags`, `status`, `created`, `updated`,
  `error_signatures`, plus `Symptom`, `Root Cause`, `Resolution`, and `Prevention`.
- Lesson capture resolves exactly one configured destination. Local and shared
  stores are not dual-written. Shared promotion is a separate reviewed operation;
  see the [routing policy](../../kb-bootstrap/docs/LESSON_ROUTING_POLICY.md) and
  [promotion workflow](../../kb-bootstrap/docs/LESSON_PROMOTION_WORKFLOW.md).
- Canonical records are outside `kb/raw/`, use the existing OKF fields, and are
  searched separately from raw evidence. See the [canonical synthesis contract](./canonical-knowledge.md).

The following are **recommendations introduced by this document**: `PROC-*` and
`ADR-*` namespaces, optional additive metadata for new records, the suggested
folders below, and the common lifecycle/review envelope. They do not impose new
required fields on legacy `PROJECT-*` lessons.

Recommended canonical locations:

```text
kb/
  procedures/PROC-0001-<slug>.md
  decisions/ADR-0001-<slug>.md
  patterns/<slug>.md
  lessons/PROJECT-0001-<slug>.md  # only where the configured lesson store exists
```

Procedures and decisions are canonical knowledge and remain owned by the repository
that adopts them. A workspace-shared lesson requires the explicit shared metadata
and reviewed promotion workflow; never write local and shared stores in one capture.

## Common additive metadata envelope

For new procedures and decisions, and for lessons after an explicit schema
migration, the following `record-v1` envelope is recommended. Existing project
lessons remain valid without these additional fields.

```yaml
---
record_schema: record-v1
record_type: lesson | procedure | decision
id: PROJECT-0001 | PROC-0001 | ADR-0001
title: "Short descriptive title"
category: lesson | procedure | decision
tags: [tag]
status: draft | active | deprecated | superseded | rejected
created: 2026-08-27
updated: 2026-08-27
scope:
  kind: project | workspace | system | component
  target: "owner/repository or sanitized component"
version_scope:
  product: "Product or system"
  versions: ["X.Y"]
  environments: ["Node.js", "VPS"]
  as_of: 2026-08-27
owner: "public team or repository"
provenance:
  derived_from: [RAW-001, CANON-001]
  evidence_refs: [RAW-001]
  verification_ids: [VR-001]
related_records: []
supersedes: []
superseded_by: null
review:
  state: needs_review | reviewed
  last_reviewed: null
  next_review: null
error_signatures: []
---
```

`status` is the record lifecycle, not proof that every claim is confirmed. Claim
epistemic status remains per claim and follows the
[cross-source policy](./cross-source-verification.md): `hypothesis`, `reported`,
`corroborated`, or `confirmed`, with scoped lifecycle handling for deprecated or
rejected claims. Never turn missing evidence into `rejected`.

## Lesson contract and template

The current lesson contract is authoritative for existing project lessons. A new
lesson must retain the exact required fields, stable sanitized error signatures,
matching filename/frontmatter/index ID, and the single-store routing rule.
`Verification` is recommended as an additional section but is not made mandatory
here because the current schema does not require it.

```markdown
---
id: PROJECT-0001
title: "Sanitized recurring failure"
category: tooling
severity: medium
tags: [tooling]
status: active
created: 2026-08-27
updated: 2026-08-27
error_signatures:
  - "stable sanitized error phrase"
---

# Sanitized recurring failure

## Symptom
The exact stable symptom, without credentials, PIDs, private paths, or payloads.

## Root Cause
The verified cause and its scope. If only suspected, record a hypothesis instead
of calling it a root cause.

## Resolution
The minimal fix and the versions/environments where it applies.

## Verification
The command/check and expected result that demonstrated the fix.

## Prevention
The actionable control that prevents recurrence.

## Related Records
- `PROC-0001` — [related runbook](../procedures/PROC-0001-example.md)
- `ADR-0001` — [related decision](../decisions/ADR-0001-example.md)
```

Do not add a separate lesson for an ordinary successful operation. Promote a lesson
to workspace scope only through the reviewed workflow; preserve the project source
until the destination is verified.

## Procedure / runbook template

Use the `PROC-*` namespace in a canonical location; a separate registry is a future
choice, not part of this increment.

```markdown
---
record_schema: record-v1
record_type: procedure
id: PROC-0001
title: "Scaffold and verify a site"
category: procedure
tags: [scaffolding, verification]
status: active
created: 2026-08-27
updated: 2026-08-27
environment: {os: any, shell: any, tools: ["node", "npm"]}
scope: {kind: project, target: "owner/repository"}
version_scope: {product: "site-bootstrap", versions: ["current"], environments: ["Node.js", "npm"], as_of: 2026-08-27}
owner: "maintainers"
provenance: {derived_from: [CANON-001], evidence_refs: [RAW-001], verification_ids: [VR-001]}
related_records: [ADR-0001]
supersedes: []
superseded_by: null
review: {state: reviewed, last_reviewed: 2026-08-27, next_review: null}
error_signatures: []
---

# Scaffold and verify a site

## Purpose and Scope
Define the operation, supported environments, and explicit non-goals.

## Preconditions
Repository identity, permissions, tool versions, inputs, and safety checks.

## Inputs and Outputs
Expected inputs, generated artifacts, and output boundaries.

## Steps
1. Run the documented action.
2. Check the expected result.
3. Stop on a failed or ambiguous condition; do not continue by assumption.

## Verification
List commands, expected statuses/artifacts, and negative checks.

## Rollback / Recovery
Describe safe reversal, evidence preservation, and escalation when rollback is unavailable.

## Security and Safety
Never place credentials in commands, files, logs, or examples. Identify destructive actions.

## Related Records
Link lessons that explain failures and decisions that constrain the procedure.

## Evidence / References
Map each critical step to a canonical/raw evidence ID and precise locator.
```

A procedure is independently testable when another agent can execute its steps with
sanitized inputs and determine success from stated expected results.

## Architecture decision template

Use the `ADR-*` namespace. An ADR records a durable choice, not an assertion that
one option is universally best.

```markdown
---
record_schema: record-v1
record_type: decision
id: ADR-0001
title: "Git as the content store"
category: decision
tags: [architecture]
status: active
created: 2026-08-27
updated: 2026-08-27
scope: {kind: system, target: "site-bootstrap"}
version_scope: {product: "site-bootstrap", versions: ["current"], environments: ["all"], as_of: 2026-08-27}
owner: "maintainers"
provenance: {derived_from: [CANON-001], evidence_refs: [RAW-001], verification_ids: []}
related_records: [PROC-0001]
supersedes: []
superseded_by: null
review: {state: reviewed, last_reviewed: 2026-08-27, next_review: null}
error_signatures: []
---

# Git as the content store

**Date:** 2026-08-27
**Status:** accepted

## Context
Problem, constraints, decision drivers, and scope.

## Decision
The selected approach, stated precisely and bounded by the scope above.

## Alternatives Considered
- Alternative — evidence-backed trade-off and reason it was not selected.

## Consequences
Benefits, costs, operational burden, risks, and non-goals.

## Revisit Triggers
Observable events that reopen the decision: scale, security requirement, platform change,
repeated failure, or dependency/version change.

## Evidence and Review
Evidence refs, reviewer/owner, date, unresolved questions, and review result.

## Related Records
Procedures, lessons, and canonical guidance affected by this choice.
```

A decision example is independently reviewable when its alternatives, scope,
consequences, and observable revisit trigger are explicit. A runtime test is useful
when the decision contains empirical claims, but a preference alone is not a test
result.

## Provenance and cross-link policy

The derivation chain is:

```text
raw evidence -> optional cleaned artifact -> canonical claim -> lesson/procedure/decision
```

- Raw evidence is immutable/minimally transformed and is never overwritten by a
  synthesis operation.
- Canonical records use `provenance.derived_from` for raw or intermediate records
  and `evidence_refs` for precise source support. Every material claim, procedure
  step, or decision proposition should have a stable ID and evidence locator.
- Use real relation labels such as `derived_from`, `supports`, `implements`,
  `mitigates`, `supersedes`, and `related_to`; do not add reciprocal links only to
  change graph metrics.
- Keep repository-relative Markdown links resolvable. Raw directories are excluded
  from the graph linter, so raw IDs and locators need a separate human review.
- When a lesson is promoted, source and destination ownership are explicit and only
  the reviewed destination is written; see the [promotion workflow](../../kb-bootstrap/docs/LESSON_PROMOTION_WORKFLOW.md).

## Lifecycle and update policy

Recommended record lifecycle is `draft → active → deprecated → superseded`. Use
`rejected` only for an exact scoped proposal or claim with positive counter-evidence,
a failed reproducible test, or an explicitly rejected decision. Missing evidence is
`needs_review`/unverified, never `rejected`.

- Keep an ID stable while the subject remains the same; update `updated` only after
  a reviewed change.
- Add new evidence and verification records; never overwrite raw captures or erase
  historical meaning.
- A material version, environment, or scope change creates a new claim/record or a
  version-specific variant; do not silently broaden old guidance.
- When new evidence supersedes guidance, set `superseded_by` and preserve the old
  record/evidence as historical context. `deprecated` does not mean false.
- Mutable web/community/video captures become new evidence versions. GitHub
  branches/tags are discovery pointers; code evidence should use a full commit SHA.
- Review cadence should be risk-based: current API, security, compatibility, and
  deployment records need more frequent review than historical decisions.

## Review checklist

### Universal

- [ ] Correct record type selected; no duplicate triad for one purpose.
- [ ] Existing required lesson fields/sections remain intact where applicable.
- [ ] ID, filename, and any index entry agree; namespace is correct.
- [ ] Scope, version, environment, owner, dates, lifecycle, and review state are explicit.
- [ ] Provenance and evidence refs resolve to raw/canonical records with precise locators.
- [ ] Claims, steps, and decisions are bounded; uncertainty and limitations are visible.
- [ ] Opinions/reports are not upgraded to confirmed recommendations without verification.
- [ ] Raw is not overwritten; canonical text is not a wholesale copy.
- [ ] No secrets, PII, private URLs/paths, private payloads, prompts, or runtime state.
- [ ] `kb-bootstrap validate --dir kb --project-root .` passes; relevant QMD checks are
      run only when authorized and their actual results are recorded.

### Lesson

- [ ] Problem is recurring/non-obvious and the cause is verified.
- [ ] Resolution was applied and Verification states observable success.
- [ ] Prevention is actionable and scoped.
- [ ] `error_signatures` are stable and sanitized.
- [ ] Exactly one configured lesson destination is selected; local index IDs match.

### Procedure

- [ ] Preconditions, inputs/outputs, permissions, versions, and destructive actions are explicit.
- [ ] Steps are ordered, executable, and have expected results/stop conditions.
- [ ] Verification commands and acceptance criteria are concrete.
- [ ] Rollback/recovery is tested or explicitly marked unavailable.
- [ ] Secret handling and provider assumptions are safe.

### Decision

- [ ] Decision drivers, scope, owner, date, and status are explicit.
- [ ] Alternatives and trade-offs are evidence-backed; no invented rejection rationale.
- [ ] Consequences include operational cost and risk.
- [ ] Revisit triggers are observable.
- [ ] Supersession/deprecation links preserve history.

## Anti-patterns

- **Everything-as-lesson:** ordinary documentation and one-off success are not lessons.
- **Procedure disguised as lesson:** a long runbook hidden in `Resolution` loses reusable steps.
- **Root cause by intuition:** suspected cause is not a verified root cause.
- **Duplicate triad:** copying one event into all three record types without distinct purposes.
- **Status conflation:** record `active` does not make each claim `confirmed`.
- **Version erasure:** replacing current text without preserving old scope/evidence.
- **Evidence laundering:** rewriting a Reddit/YouTube report as a confirmed fact.
- **QMD authority fallacy:** search rank, score, or index success is not proof.
- **Secret leakage:** copying credentials, signed URLs, private paths, or runtime payloads.
- **Graph gaming:** adding unrelated links solely to avoid orphan warnings.

## Relationship to other contracts

- Raw capture and safety: [raw-evidence.md](./raw-evidence.md).
- Claim verification: [cross-source-verification.md](./cross-source-verification.md).
- Canonical synthesis: [canonical-knowledge.md](./canonical-knowledge.md).
- QMD search: [qmd-agent-search.md](../../kb/procedures/qmd-agent-search.md).
- Existing lesson storage/routing remains governed by `kb-bootstrap`; this document
  does not create or migrate a lesson registry.
