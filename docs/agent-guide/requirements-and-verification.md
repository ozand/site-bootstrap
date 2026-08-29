# Requirements and verification contract

This guide is the decision-first preflight for changes and acceptance in
`site-bootstrap`. It complements the repository workflow, evidence contracts, and
knowledge-record rules. It does not implement product behavior or decide an
unresolved product/architecture choice on the owner's behalf.

## 1. Normalize the request before implementation

Write a compact intake record before editing:

```yaml
request:
  outcome: "Observable result the owner wants"
  target: "Repository, site, route, artifact, or component"
  scope: "Included surfaces and explicit exclusions"
  owner: "Role or repository owner"
  environment: "Local | disposable | staging | production"
  dependencies: ["tool/version or approved external system"]
  access_model: "public | network | proxy_acl | application_auth | application_authorization | storage_persistence | combined | unknown"
  storage_mode: "local | github | none | unknown"
  acceptance: ["Observable pass/fail criteria"]
  verification: ["Commands, checks, or evidence needed"]
  rollout: "not_planned | disposable | staging | production"
```

`scope` must name what is not being changed. `owner`, `environment`, and
`verification` must be concrete enough for another agent to reproduce the check.
For protected routes, declare the enforcement point and distinguish network,
proxy, application auth/authz, and storage/persistence controls. `local` Keystatic
storage is a file-editing mode, not an identity boundary.

## 2. Ambiguity and `needs_decision`

Stop before mutation when a material choice is absent or contradictory, including:

- public versus private/network-only access;
- proxy ACL versus application authentication/authorization;
- local versus GitHub storage and the expected persistence behavior;
- disposable versus staging/production environment;
- owner, data boundary, provider, or rollback authority.

Set `status: needs_decision`, state the exact question and decision owner, and list
what cannot be verified until it is answered. Do not convert an unknown control
into an application-auth blocker, and do not use an HTTP 200 as security evidence.
Once decided, record the selected model, enforcement point, allowed principals,
protected routes, fixture, and non-goals before writing acceptance criteria.

## 3. Blocker taxonomy

Use one primary blocker class and a bounded explanation:

| Class | Meaning | Required response |
| --- | --- | --- |
| `needs_decision` | Required product/architecture/scope choice is unresolved | Ask the named owner; do not implement by assumption |
| `access_unavailable` | Authorized target, identity, browser, provider, or network path is unavailable | Stop; record the missing access without probing private systems |
| `environment_unavailable` | Required runtime/tool/engine is unavailable | Record client/server distinction and defer the run |
| `evidence_insufficient` | Observation exists but cannot support the requested claim | Narrow the claim or gather independent evidence |
| `implementation_failure` | Scoped code/config/test fails reproducibly | Preserve the failure and fix or escalate |
| `safety_boundary` | The requested action would expose secrets, private data, or protected state | Stop and refuse the unsafe path |

A blocker is not a negative product finding. Report the failed or unrun check,
impact, owner/action needed, and safe next step. Remove an active-work marker when
work stops; leave the issue open unless its acceptance criteria are met.

## 4. Evidence interpretation

Every report separates:

- **Observed:** command, version, environment, input, and result actually seen;
- **Inference:** bounded interpretation that follows from the observation;
- **Unverified:** requested behavior not tested or evidence unavailable;
- **Non-claim:** stronger conclusion explicitly not supported by the run.

HTTP status proves only the response at that endpoint. A route `200` is reachability,
not authentication, authorization, proxy allowlisting, network membership, storage
persistence, or production readiness. A client-only tool result does not prove a
server is available. A no-hit, access error, or absent capture does not prove that a
source, feature, or behavior does not exist. Follow the raw/canonical contracts for
stable identity, scope, hashes, provenance, and channel-appropriate locators.

For access testing, report independent results for each configured layer:
`network_reachable`/`network_denied`, `proxy_allowed`/`proxy_denied`,
`app_unauthenticated_denied`, `app_authorized`,
`app_insufficient_privilege_denied`, and `storage_persisted`. Mark unconfigured or
unrun layers `not_applicable` or `not_run` with a reason. Never invent identities,
credentials, cookies, tokens, or private payloads.

## 5. Development, test, and rollout report

Use this compact structure in issue comments, handoffs, and canonical evidence:

```text
Status: complete | partial | blocked | needs_decision
Scope: <target, environment, explicit exclusions>
Decision: <selected access/storage/provider model, or unresolved question>
Development: <files/code/config changed, or none>
Tests: <commands/checks and pass/fail/not_run result>
Observed: <sanitized facts with versions and scope>
Inference: <bounded interpretation>
Unverified: <requested checks not run or unavailable>
Rollout: not_planned | disposable | staging | production; <actual result>
Blocker: <class, owner, action; or none>
Residual risk: <remaining limitations and next review>
```

For every `complete` result, tests must cover the acceptance criteria in the named
environment. A disposable or scratch pass is not production certification. A
`partial`, `blocked`, or `needs_decision` result must preserve the issue and state
the minimum next action. Keep all reports sanitized and omit credentials, tokens,
cookies, PII, private URLs/paths, raw payloads, runtime/session contents, and
protected local-state details.

## 6. Pre-acceptance checklist

- [ ] Outcome, target, scope, exclusions, owner, environment, dependencies, and rollout are explicit.
- [ ] Access model, storage mode, enforcement point, protected routes, and allowed principals are decided or marked `needs_decision`.
- [ ] Acceptance criteria are observable and match the selected architecture.
- [ ] Each criterion has a reproducible test or an explicit `not_run`/`not_applicable` reason.
- [ ] Evidence is labeled observed, inferred, unverified, and non-claim as applicable.
- [ ] Blockers use the taxonomy above and do not masquerade as product failures.
- [ ] Development, test, rollout, and residual-risk status are reported separately.
- [ ] Secret, privacy, protected-state, and external-access boundaries are checked.
- [ ] Repository links and relevant validation commands pass before acceptance.

## Related contracts

- [Bootstrap workflow](./bootstrap-workflow.md)
- [Raw evidence and provenance](./raw-evidence.md)
- [Cross-source verification](./cross-source-verification.md)
- [Canonical knowledge](./canonical-knowledge.md)
- [Generated-site acceptance](../../kb/procedures/generated-site-acceptance.md)
