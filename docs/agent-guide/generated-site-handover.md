# Generated-site handover

This procedure hands a generated site from repository changes to a verified
static release. It follows the [separated static-site architecture](../architecture/separated-static-site.md).

## Boundaries and roles

- **GitHub** is the source of truth for code, content, configuration, review, and
  release identity.
- The **private editor host** runs Keystatic in GitHub storage mode for authorized
  content edits. It is not the public website.
- The **build host** checks out the selected GitHub revision and runs the locked
  install, verification, and static build pipeline.
- The **public VPS** receives only the verified static artifact; Nginx serves the
  active versioned release. It does not run Node, SSR, Keystatic, or a database.

Do not put credentials, cookies, tokens, private URLs, customer data, or runtime
payloads in Git, artifacts, handoff notes, or issue comments.

## Content-edit workflow

Use this path for copy, posts, settings, and other content-only changes:

1. On the private editor host, use Keystatic with GitHub storage mode, or make a
   reviewed direct file edit in the repository. Keep the schema contract intact.
2. Review the resulting GitHub commit and confirm content scope only. Do not mix
   unrelated code/design changes into the same handoff.
3. The build host checks out that commit and runs `npm ci`, `npm run verify`, and
   `npm run build` using the public static profile.
4. Inspect the resulting `dist/` artifact and its sanitized build metadata. Do not
   expect `/keystatic` in the public artifact.
5. Hand the artifact to the versioned-release publisher. Record release ID,
   digest, health result, and operator ownership without secrets.
6. Nginx serves the accepted `current` release. Keep the prior accepted release
   available until health checks pass.

## Code and design workflow

Use this path for templates, components, styles, routes, schemas, dependencies,
configuration, and other implementation changes:

1. Create a scoped GitHub change with explicit acceptance criteria and a decision
   record when architecture or access boundaries change.
2. Run the required checks for the affected surface, then the build-host pipeline:
   locked `npm ci`, `npm run verify`, and `npm run build`.
3. Review the static artifact contents, source revision, lockfile/toolchain
   identity, digest, and expected public routes. A successful command alone is
   not a publication approval.
4. Publish only through the versioned release process after the artifact is
   accepted. Keep the previous `current` target for recovery.
5. If the new release is unhealthy, stop promotion and switch `current` atomically
   to the last accepted release. Re-run the same static health/HTTP checks and
   escalate to the build/release owner and VPS operator.

Do not use the content-edit workflow to bypass code review, and do not use the
code/design workflow to edit production files directly.

## Static publication and rollback handoff

A handoff must identify, in sanitized form:

- source repository and selected commit/revision;
- build status and toolchain/lockfile identity;
- artifact path, digest, release ID, and expected static entry files;
- publisher result, active `current` target, health/HTTP results, and operator;
- previous accepted release and rollback decision if promotion failed;
- unverified checks, residual risks, and the next owner/action.

The publisher creates immutable `releases/<release-id>/` content and atomically
updates `current`; it does not implement Nginx or production policy. Nginx must
serve the selected static root and return no public editor route. Keep release
retention sufficient for rollback and never delete the last accepted release
before verifying its replacement.

## Troubleshooting boundaries

- A failed `npm ci`, verify, or build is a **build/verification** failure; do not
  publish its output.
- A missing or invalid artifact is a **artifact-contract** failure; preserve the
  last accepted `current` release.
- A refused or unavailable publisher target is a **access/rollout** issue; do not
  infer a bad artifact or change production configuration.
- A public HTTP failure is a **static host/release** issue; compare the release
  pointer and artifact before changing application code.
- `/keystatic` absent from a public artifact is expected in the static profile. A
  private editor-host check is separate and must not be used as public-site proof.

## Verification and report

Use the following handoff report:

```text
Status: complete | partial | blocked | needs_decision
Workflow: content-edit | code-design
Source: <repository + selected revision>
Development: <changed files or none>
Tests: <npm ci/verify/build and targeted checks>
Artifact: <release ID + digest + static entry checks>
Publication: <publisher/current/health result, or not_run>
Rollback: <previous release/checks, or not_applicable>
Unverified: <checks not run>
Owner/action: <next responsible role and action>
Residual risk: <scope-limited limitations>
```

A local/disposable verification is not a production rollout. Report publication as
`not_run` when no authorized target exists. Keep content, code/design, build,
publishing, health, and rollback results separate; do not infer one from another.

## Related implementation contracts

- [Static build pipeline](../../hosting/static-build/README.md)
- [Static publisher](../../hosting/vps/README.md)
- [Static Nginx profile](../../hosting/vps/nginx-static.conf)
- [Rollback verification](../../hosting/vps/test-static-rollback.mjs)
- [Bootstrap workflow](./bootstrap-workflow.md)
- [Acceptance procedure](../../kb/procedures/generated-site-acceptance.md)
