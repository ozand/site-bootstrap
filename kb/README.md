# Knowledge base

Cross-site lessons for sites built from this template. Before debugging an Astro/Keystatic/Tailwind problem in ANY generated site — grep `kb/lessons/` first.

## Format

One topic-focused lesson file belongs in `lessons/` with a kebab-case name. A
file may contain several tightly related failure modes when they share one
operational boundary and are easier to apply together than separately. Unrelated
causes require separate files.

Structure:

```markdown
# <symptom in one line>

**Date:** YYYY-MM-DD · **Area:** astro | keystatic | tailwind | hosting | ...

**Symptom:** what you observed (exact error text).
**Cause:** verified root cause.
**Fix:** what actually fixed it.
**Prevention:** reusable rule that prevents recurrence.
```

Add a lesson whenever you solve a non-obvious problem in a generated site — the fix belongs here, not only in that site's history.

## Current lessons

- [Portable Astro lessons](./lessons/astro-lessons-from-ai-business-catalyst.md)
- [Remote static validation boundaries](./lessons/remote-static-validation-boundaries.md)
- [Mobile route discoverability](./lessons/mobile-route-discoverability.md)

## Research captures

The project-wide raw evidence and provenance contract is documented in
[docs/agent-guide/raw-evidence.md](../docs/agent-guide/raw-evidence.md). New
captures belong under `kb/raw/` and must remain separate from canonical knowledge
and project lessons.

## Current canonical records

- [Baseline compatibility matrix](./architecture/baseline-compatibility.md)
- [Generated-site acceptance procedure](./procedures/generated-site-acceptance.md)
- [Markdoc and Keystatic schema boundary](./apps/content-schema-boundary.md)
