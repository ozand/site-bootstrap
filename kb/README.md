# Knowledge base

Cross-site lessons for sites built from this template. Before debugging an Astro/Keystatic/Tailwind problem in ANY generated site — grep `kb/lessons/` first.

## Format

One lesson = one file in `lessons/`, kebab-case name, structure:

```markdown
# <symptom in one line>

**Date:** YYYY-MM-DD · **Area:** astro | keystatic | tailwind | hosting | ...

**Symptom:** what you observed (exact error text).
**Cause:** verified root cause.
**Fix:** what actually fixed it.
```

Add a lesson whenever you solve a non-obvious problem in a generated site — the fix belongs here, not only in that site's history.

## Research captures

The project-wide raw evidence and provenance contract is documented in
[docs/agent-guide/raw-evidence.md](../docs/agent-guide/raw-evidence.md). New
captures belong under `kb/raw/` and must remain separate from canonical knowledge
and project lessons.

## Current canonical records

- [Baseline compatibility matrix](./architecture/baseline-compatibility.md)
- [Generated-site acceptance procedure](./procedures/generated-site-acceptance.md)
- [Markdoc and Keystatic schema boundary](./apps/content-schema-boundary.md)
