# Freshness cadence and identifier registry

This document defines a small, repository-local policy for research and
verification records. It does not create a service, database, or external
registry, and it does not require reprocessing existing artifacts.

## Scope and ownership

The policy covers these artifact classes:

| Class | Examples | Owner | Review cadence |
| --- | --- | --- | --- |
| Raw source capture | `kb/raw/**/*.md` | Research owner | 90 days for active/current sources; historical captures are reviewed when reused |
| Canonical knowledge | `kb/apps/`, `kb/architecture/`, `kb/procedures/` | Maintainer | 90 days for compatibility/deployment/security guidance; 180 days for stable concepts |
| Verification record | `verification` blocks and acceptance evidence | Verification owner | Before each release or material dependency/configuration change; at least every 90 days while active |
| Lesson record | `kb/lessons/` | Record owner | At each recurrence or promotion; otherwise annually |
| Decision record | Architecture/operational decisions | Decision owner | At a stated revisit trigger; otherwise annually |

The owner is a role or team label, not a private person identifier. A record's
`updated`/`captured_at` date is the last known review input; it is not proof that
the underlying source is unchanged.

## Deterministic ID namespaces

IDs are stable, human-readable, and allocated once. Use the following prefixes:

| Record | Prefix and shape | Ownership |
| --- | --- | --- |
| Raw capture | `RAW-YYYYMMDD-<channel>-<stable-subject>-<short-hash>` | Capture author; hash identifies the stored representation |
| Canonical page | Existing project/framework prefix plus zero-padded number, e.g. `KB-CONTENT-0001` | Repository maintainers |
| Procedure | `PROC-0001` | Owning repository |
| Decision | `ADR-0001` | Owning repository |
| Verification | `VR-<scope>-<number>` | Verification owner |
| Claim/step | `C-<scope>-<number>` / `S-<scope>-<number>` | Owning record author |
| Lesson | Existing configured `PROJECT-####` contract | Configured lesson-store owner |

To allocate a new ID, normalize the stable subject to lowercase ASCII
letters/digits separated by single hyphens, select the next UTC date for a new
capture, and use the first 8 hexadecimal characters of the SHA-256 digest of the
exact stored representation. For numbered namespaces, scan tracked records and
indexes and choose the lowest unused number within the owning scope. Do not
recycle an ID. The filename, frontmatter ID, and any configured index entry must
agree. IDs must not include session IDs, machine paths, credentials, PII, or
other transient values.

## Allocation, collision, and retirement

1. Search the repository's tracked records and configured indexes before
   allocating an ID.
2. Preserve the same ID for a record whose subject and scope remain the same.
3. If an ID already exists for a different subject, stop and allocate the next
   unused sequence or a different stable subject/hash; never overwrite the
   existing record.
4. A changed source representation, material version, environment, or scope
   receives a new capture/claim/verification ID where the old evidence remains
   relevant. Link the records with `derived_from`, `supersedes`, or
   `superseded_by` as appropriate.
5. Retired records remain addressable with lifecycle `deprecated` or
   `superseded`; do not delete them merely because they are stale.
6. A collision or ambiguous ownership is a blocking condition for publication,
   not a reason to silently rename an existing artifact.

## Staleness and review workflow

An item is **overdue** when its last `updated`, `captured_at`, or explicit review
input exceeds the cadence for its class, or when a stated revisit trigger occurs.
Records without the date/owner needed to determine this are `needs_review`, not
fresh by default.

At review time:

1. Read the record's scope, status, provenance, evidence, and limitations.
2. Compare current source/version and environment with the recorded scope.
3. Mark the record `active` only when its current applicability is confirmed;
   otherwise mark it `needs_review`, `deprecated`, or `superseded` as justified.
4. Add a new evidence/version record rather than overwriting immutable raw
   material.
5. Record the review date, reviewer role, outcome, and next action in the record
   or its issue/commit note without secrets or private payloads.

Overdue escalation is: owner → repository maintainer → issue with `in progress`
when work starts. A critical security/deployment/compatibility item that is
past due or has a triggered conflict blocks release claims until reviewed. A
stable concept may remain usable with an explicit stale/legacy note while review
is scheduled.

## Practical checks

The minimum deterministic check is a repository search for the ID and its
frontmatter/index entry, followed by date and scope inspection. A future script
may automate this check, but this policy intentionally does not introduce a
registry service or migrate existing records.

## Safety and non-goals

- Store identifiers, dates, roles, status, and provenance only; never secrets,
  credentials, cookies, PII, private URLs, or raw sensitive payloads.
- This policy does not rewrite legacy artifacts or make their metadata complete.
- QMD indexes and runtime databases are derived state and are not an ID registry.
