# Static build pipeline

This Dockerfile is a provider-neutral build pipeline for the public static
profile. It does not deploy, publish, serve, or configure a provider.

## Contract

The caller must first check out a specific GitHub revision into a disposable
build context containing the site's `package.json` and committed lockfile. Build
with a non-secret revision identity:

```bash
docker build \
  --build-arg SOURCE_REVISION=<full-revision-or-release-id> \
  --build-arg SOURCE_REPOSITORY=<owner/repository> \
  --file hosting/static-build/Dockerfile \
  --tag <disposable-build-tag> .
```

The stages run, in order:

1. `npm ci` — fails if the manifest and lockfile are missing or drifted;
2. `npm run verify` — fails before any artifact stage can be exported;
3. `npm run build` — uses the selected public static profile;
4. metadata emission — stores only sanitized revision/repository/toolchain identity.

The final `artifact` stage contains only `/dist` and
`/metadata/build-metadata.json`. It deliberately contains no Node runtime,
`node_modules`, Keystatic editor profile, credentials, cookies, tokens, source
checkout, or deployment state. Export it with a Docker-capable builder, for
example:

```bash
docker buildx build \
  --build-arg SOURCE_REVISION=<full-revision-or-release-id> \
  --build-arg SOURCE_REPOSITORY=<owner/repository> \
  --file hosting/static-build/Dockerfile \
  --output type=local,dest=./artifact \
  .
```

A failed `npm ci`, `npm run verify`, or `npm run build` stops the build and
produces no successful `artifact` output. Use a disposable output directory and
remove it after an unsuccessful run; never publish a failed build.

## Disposable verification

From the repository root, run the tracked test helper:

```bash
node hosting/static-build/test-static-build.mjs
```

The helper creates synthetic disposable projects and verifies the matching path,
a controlled failure gate, and the artifact-content boundary. It does not use
production credentials or change the repository.
