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
