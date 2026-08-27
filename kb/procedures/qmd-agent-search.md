---
id: PROC-0001
title: "Search the project knowledge base with QMD"
category: procedure
tags: [qmd, knowledge-base, agents]
status: active
created: 2026-08-27
updated: 2026-08-27
environment:
  os: any
  shell: any
  tools: ["qmd 2.5.3", "kb-bootstrap 0.2.x"]
error_signatures: []
---

# Search the project knowledge base with QMD

## Purpose and scope

Use the project-local QMD collections to find reviewed guidance first and source evidence only when needed. Search relevance is not proof of correctness.

## Preconditions

- Work from the project root.
- Confirm that `qmd.json`, `qmd/collections/`, and the native QMD `.qmd/index.yml` registry exist.
- Confirm the project collection names with `qmd collection list`.
- Keep raw research separate from canonical knowledge.

## Steps

1. Search canonical knowledge by default:

   ```bash
   kb-bootstrap search "how is the site scaffold verified?" --project-root .
   ```

   The equivalent direct query is `qmd search "..." -c site-bootstrap-wiki --format json`.

   On QMD 2.5.3, the project-local `.qmd/index.yml` registry must be present and the command must run from the project root.

2. Inspect the returned document with `qmd get` and read the relevant section, status, version scope, freshness, and evidence references.

3. Follow the referenced evidence to the raw capture and its public primary source when the answer is missing, ambiguous, stale, or disputed.

4. Use raw mode explicitly for source discovery or contradiction checks:

   ```bash
   kb-bootstrap search "Astro deployment" --mode raw --project-root .
   ```

5. Do not treat a score, rank, snippet, or no-hit result as proof. Verify important claims against the cited source or a reproducible test.

## Verification and safety

- Canonical results are the default for recommendations; raw results are evidence and discovery.
- Check `status`, version/environment scope, `updated`/capture dates, claim status, and provenance before use.
- Do not index secrets, cookies, tokens, private payloads, PII, runtime state, or unrelated repositories.
- After an authorized knowledge-file or collection change, run `qmd update`; it changes the local index.
- Keep `.qmd/index.sqlite` and other QMD runtime databases out of Git; commit only the registry configuration.
- Use `qmd search`/`qmd query`/`qmd get` as read operations. Do not run `qmd update`, `qmd embed`, or collection mutation commands without authorization.

## Related records

- [Project goals and research direction](../../GOALS.md)
- [QMD research specification](../../GOALS.md#research-and-knowledge-base-direction)

## Evidence / references

- [kb-bootstrap README](../../kb-bootstrap/README.md)
- [QMD upstream repository](https://github.com/tobi/qmd)
