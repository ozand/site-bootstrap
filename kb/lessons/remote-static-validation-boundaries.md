# Remote static validation fails or risks shared services despite a successful local build

**Date:** 2026-08-30 · **Area:** hosting

## Canonical remote access path

**Symptom:** A remote target is reported unavailable because a convenience SSH alias does not resolve, although the project runbook documents another authorized path.

**Cause:** The execution plan did not select and verify one canonical access path before running commands. Alias resolution, direct SSH, and Docker-over-SSH were treated as interchangeable even though they can use different identity configuration.

**Fix:** Read the target runbook first and record the authorized transport without copying private connection details into Git or reports. Verify that path with one metadata-only probe. If Docker-over-SSH identity handling is not already verified, run Docker commands inside the successfully authenticated direct SSH session rather than improvising a separate `DOCKER_HOST` transport.

**Prevention:** The execution manifest must name the access-path source, transport class, command host, daemon host, and health-check origin. Do not conclude `access_unavailable` after testing only an alias when the runbook provides another authorized route.

## Docker-only Nginx validation on a shared VPS

**Symptom:** A temporary static-site test can create concern about unrelated reverse-proxy endpoints or shared Nginx state.

**Cause:** Running a second host-level Nginx process and signaling it still shares more host state and operational risk than the test requires, even when a temporary PID file is configured.

**Fix:** Run synthetic Nginx validation only in a uniquely named and labelled disposable container. Use a bridge network, an explicit loopback high port, read-only mounts containing only the test artifact and config, and no host network, production mounts, environment files, or service-control commands. Stop and remove only the exact owned container and test directory, then verify both are absent and the port is released.

**Prevention:** For disposable validation on a shared VPS, forbid host `nginx -s` and Nginx/systemd mutation. Host checks are read-only baselines only. Record external service probes as diagnostic evidence, not proof of causality or production integrity.

## Static artifact root and permissions

**Symptom:** The isolated Nginx container returns HTTP 403 for `/` even though the Astro build succeeded.

**Cause:** The mounted directory is not the exact public `dist` root, `index.html` is absent at the configured root, directory traversal permissions are insufficient, or the Nginx `root`/`try_files` contract does not match the artifact layout.

**Fix:** Inspect the actual static artifact tree instead of assuming an SSR-style path. Stage the exact public `dist` contents, require a root `index.html`, use directories readable/traversable by the container and ordinary readable files, reject unsafe symlinks, mount the exact artifact root read-only, and validate the full route matrix before acceptance.

**Prevention:** Artifact validation must check the required entry file, layout, deterministic digest, safe permissions, and absence of server/editor/runtime material before transfer. A successful build alone does not prove that the artifact is publishable.

## Required checks versus diagnostics

**Symptom:** A rollback or publication test is left blocked because an unrelated health probe fails, although every stated acceptance criterion passed.

**Cause:** Required acceptance checks and diagnostic observations were not classified before execution.

**Fix:** Label each probe as `required`, `diagnostic`, `optional`, or `forbidden`. Only required failures may block completion. Keep diagnostic failures as bounded limitations and do not reinterpret them as product or production failures.

**Prevention:** Review the Issue acceptance criteria before execution and again before closure. If the desired acceptance changes, update the Issue first. Generate the final receipt from deterministic outputs where possible to avoid manual transcription and status errors.

## Command context and package entrypoints

**Symptom:** Tests report zero cases, package-relative imports fail, or validation reports an empty repository even though the code and records exist.

**Cause:** The command ran from the wrong working directory, an internal package file was executed directly instead of through its supported module entrypoint, or the project root was inferred incorrectly.

**Fix:** Run commands from the owning package/repository root, use package/module invocation for package CLIs, and pass explicit project roots to cross-repository validators. For Python verification, disable bytecode output when the working tree must remain unchanged.

**Prevention:** The execution manifest must record `cwd`, entrypoint, project root, and expected test discovery scope before the command runs. Verify the command found the expected test/record count instead of accepting an empty pass.
