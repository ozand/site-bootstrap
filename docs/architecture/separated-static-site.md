# Separated static-site architecture and deployment contract

**Status:** accepted decision for the next implementation cycle
**Scope:** site-bootstrap-generated sites; static public publication

## Decision

GitHub is the sole source of truth for site code and content. The deployment
pipeline has four deliberately separated responsibilities:

1. **GitHub repository** — stores reviewed source, Markdoc/content files,
   configuration, and versioned release history.
2. **Private editor host** — runs Keystatic in **GitHub storage mode** for
   authorized content editing. It may be a local workstation or private network
   host; it is not a public serving host. Keystatic changes become GitHub commits.
3. **Build host** — a local Docker or CI environment checks out a selected GitHub
   revision, runs `npm ci`, `npm run verify`, and `npm run build`, and emits the
   resulting static `dist/` artifact. The build input is the selected source
   revision plus its lockfile; credentials are injected by the host and are not
   stored in the artifact or repository.
4. **Public VPS** — receives only a verified, versioned static release artifact.
   Nginx serves the active release directory. The public VPS does not run Node,
   Astro SSR, Keystatic, or a database for this site. There is no public Node
   runtime.

The public publication boundary is the verified static artifact. A source commit
is not public until the build and promotion checks for its release complete.

## Responsibilities and boundaries

| Component | Owns | Must not own |
| --- | --- | --- |
| GitHub | source, review, history, release identity | runtime secrets or mutable public state |
| Private editor host | authorized Keystatic GitHub-mode editing | public traffic or the production artifact |
| Build host | locked install, verification, static build, artifact digest | source-of-truth content edits or public serving |
| Public VPS/Nginx | static files, active pointer, HTTP/TLS delivery | Node/Keystatic runtime, database, source checkout, editing |

The editor host's network restriction, reverse-proxy ACL, and GitHub authorization
are separate controls. This document does not select a Tailscale/VPN product or
implement authentication; each deployment must name its enforcement point and
allowed principals before acceptance. The template's editor profile and
`KEYSTATIC_*` placeholders are configuration guidance only: they do not prove
OAuth, session, role, or GitHub write behavior without an authorized
non-production test.

## Build and artifact contract

A release build must identify:

- the GitHub commit/revision and repository;
- the exact `package.json` and lockfile used by `npm ci`;
- Node/npm versions and build configuration;
- successful `npm ci`, `npm run verify`, and `npm run build` results;
- the static artifact digest, output path, and release identifier;
- sanitized promotion and health-check results.

The artifact contains the public static output only. It must not contain
credentials, cookies, tokens, private payloads, editor session state, editor
configuration, or a source checkout. A missing or failed check blocks promotion.
The private editor host is a separate runtime and is not bundled into `dist/`.

## Release, promotion, and rollback

Use an immutable release directory such as `releases/<release-id>/` on the public
VPS. The `current` pointer identifies the active release. A release ID is derived
from the source revision and build identity; it is not a mutable `latest` alias.

Promotion is:

1. copy the verified static artifact to a new release directory;
2. verify its digest and expected entry files;
3. atomically switch `current` to that directory;
4. check the public health route and required static routes;
5. retain the previous release until the new one is accepted.

Rollback is an atomic switch of `current` to the last accepted release, followed by
the same health and route checks. The release/build owner authorizes promotion and
rollback; the VPS operator executes the pointer change and reports the result.
No content or database restoration is implied because this architecture has no
runtime database. The public deployment has no runtime database at all.

## In scope for this decision

- source/editor/build/public-host responsibilities;
- GitHub source-of-truth and private Keystatic GitHub-mode editing;
- locked verification and static `dist/` artifact boundary;
- versioned release directories, active pointer, promotion, health checks, and
  rollback ownership;
- explicit prohibition of public Node/Keystatic runtime and databases.

## Out of scope and follow-up dependencies

This ADR does not implement the pipeline. Follow-up issues own the smallest
implementation slices:

- **#33** — configure the static build/output profile;
- **#34** — implement Docker/CI locked build and artifact verification;
- **#35** — publish versioned static artifacts to the VPS;
- **#36** — configure Nginx to serve only the active static release;
- **#37** — trigger build/promotion from an approved GitHub commit flow;
- **#38** — implement static-release rollback;
- **#39** — configure the private Keystatic GitHub-mode editor host;
- **#40** — update generated-site handover documentation.

Authentication, network/Tailscale policy, proxy ACLs, provider credentials, and
production rollout require their own explicit decisions and verification. No
follow-up may infer those controls from this ADR or from an HTTP status alone.

## Revisit triggers

Revisit this decision if public editing is required, runtime/user-generated data
is introduced, a provider requires server-rendered public routes, GitHub ceases to
be the content source of truth, or release retention/rollback requirements change.
