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

The authoritative QMD configuration for this repository is the committed project-local pair:

- `qmd.json` — workspace name, collection directory, and QMD database path.
- `qmd/collections/wiki.yaml` and `qmd/collections/raw.yaml` — collection names, source paths, and exclusions.

Use two logical project collections:

- `site-bootstrap-wiki` — canonical knowledge under `kb/`, excluding `kb/raw/`.
- `site-bootstrap-raw` — source captures under `kb/raw/`.

Keep web, Reddit, YouTube, and GitHub channel metadata and directories inside the raw tree instead of creating separate channel collections by default.

When sources disagree, precedence is: committed repository configuration and collection files, then the project-local QMD registry, then the QMD runtime index/database. Runtime state is derived and disposable; it must never override committed configuration. A missing or stale runtime index is repaired with the documented read-only checks and an authorized `qmd update`, not by editing generated database files.

Generated sites are explicitly excluded from this repository-level QMD workspace. The scaffolder copies the Astro site template and portable site skills, but does not copy `qmd.json`, `qmd/collections/`, `.qmd/` databases, or this workspace KB. A generated site may opt into its own independent KB/QMD configuration later; that is a separate repository-owned decision and is out of scope for this issue.

## Consequences

Canonical search remains the default and raw research is explicit. The layout reduces collection-selection ambiguity and prevents raw evidence from silently becoming a recommendation corpus. Channel-specific collections may be introduced later only when corpus size, access, retention, or update cadence justifies them.

## Maintenance responsibilities

- Maintainers version and review `qmd.json` and `qmd/collections/*.yaml` as the source of truth.
- Agents use `site-bootstrap-wiki` by default and explicitly select `site-bootstrap-raw` for evidence work.
- After an authorized KB/configuration change, maintainers may run `qmd update` and bounded searches; the generated `.qmd/` runtime remains uncommitted.
- Changes to generated-site scaffolding or native QMD support are downstream follow-up work, not part of this decision.

## Revisit triggers

Revisit this decision if a channel needs different retention or access policy, a different embedding model, a materially different update cadence, collection size makes explicit channel filtering unreliable, or generated sites acquire an approved independent QMD contract.

## Evidence and review

This decision follows the project research direction in `GOALS.md`, the generated `kb-bootstrap` collection contract in [the framework README](../../kb-bootstrap/README.md), and the versioned capture [RAW-20260828-web-qmd-layout-research-v2-b6326f8](../raw/web/qmd-layout-research-v2.md). The local configuration was compared with `qmd.json` and both collection manifests during this decision. It should be rechecked if the framework or QMD configuration contract changes.

## Related records

- [QMD search procedure](../procedures/qmd-agent-search.md)
