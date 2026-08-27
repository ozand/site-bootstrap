---
id: ADR-0001
title: "Keep canonical and raw knowledge in separate QMD collections"
category: decision
tags: [qmd, architecture, knowledge-base]
status: accepted
created: 2026-08-27
updated: 2026-08-27
environment:
  os: any
  shell: any
  tools: ["qmd 2.5.3"]
error_signatures: []
---

# Keep canonical and raw knowledge in separate QMD collections

**Date:** 2026-08-27 · **Status:** accepted

## Context

Agents need reviewed recommendations and source evidence, but search results must not blur the distinction between them. `kb-bootstrap` provides a canonical/wiki collection and an explicit raw collection.

## Decision

Use two logical project collections:

- `site-bootstrap-wiki` — canonical knowledge under `kb/`, excluding `kb/raw/`.
- `site-bootstrap-raw` — source captures under `kb/raw/`.

Keep web, Reddit, YouTube, and GitHub channel metadata and directories inside the raw tree instead of creating separate channel collections by default.

## Consequences

Canonical search remains the default and raw research is explicit. The layout reduces collection-selection ambiguity and prevents raw evidence from silently becoming a recommendation corpus. Channel-specific collections may be introduced later only when corpus size, access, retention, or update cadence justifies them.

## Revisit triggers

Revisit this decision if a channel needs different retention or access policy, a different embedding model, a materially different update cadence, or collection size makes explicit channel filtering unreliable.

## Evidence and review

This decision follows the project research direction in `GOALS.md` and the generated `kb-bootstrap` collection contract in [the framework README](../../kb-bootstrap/README.md). It should be rechecked if the framework or QMD configuration contract changes.

## Related records

- [QMD search procedure](../procedures/qmd-agent-search.md)
