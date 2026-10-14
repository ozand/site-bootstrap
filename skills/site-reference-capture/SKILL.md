---
name: site-reference-capture
description: Use when documenting evidence from a public website for a design or product reference. Defines a manual, non-invasive capture record with traceable observations and explicit uncertainty; it does not browse or automate capture.
license: MIT
metadata:
  audience: research
  workflow: website-reference-capture
---

# Site Reference Capture

Create a minimal, auditable record from artifacts the operator already captured. This is an instructional checklist, not a browser tool, scraper, runner, or permission to access a site.

## Scope and safety

- Work only from user-provided or already authorized saved artifacts. This skill performs no network access, login, automated browsing, or new capture.
- Do not capture credentials, cookies, private data, personal data, session state, unpublished content, or protected screens. Stop if a supplied artifact contains them; do not silently redact and present it as raw evidence.
- Preserve source artifacts unchanged and privately. Make a separately named, minimal sanitized derivative only when authorized; record its parent and transformation. Do not publish wholesale pages, screenshots, DOM, or third-party text.
- Before any publication, apply the project's raw-evidence, licensing, minimal-copy, sanitization, and publication review requirements. A reference note is not permission to redistribute its source.
- If a needed artifact, route, state, timestamp, viewport, or access status is absent, record `NOT_VERIFIED` or `unknown`; do not infer it.

## Procedure

1. Record task scope, allowed artifact paths, public source identity/URL (if known), capture timestamp with timezone, route, viewport dimensions, locale/theme, and interaction state. Use `unknown` for unavailable values; never invent timestamps or device emulation.
2. Inventory the provided artifacts and their provenance. For each, record a stable local artifact identifier, exact path within the approved bundle, representation, capture method/tool/version when known, source version when applicable, and integrity hash only if actually computed. Separate raw source from derivatives.
3. Extract only observations directly visible in the artifact. Each observation must identify its evidence artifact and precise locator (DOM selector/property, screenshot region, text heading/line, or route/state). Keep exact observed values distinct from interpretation.
4. Classify statements:
   - `OBSERVED`: directly supported by a cited artifact at a specified route/state/viewport.
   - `SITE_CLAIM`: wording attributed to the site's publisher, not independently verified.
   - `INFERRED`: bounded interpretation with cited observations and stated reasoning.
   - `HYPOTHESIS`: untested proposition, including JTBD, buyer/decider, user motive, emotion, and persona claims absent actual research.
   - `NOT_VERIFIED`: missing capture, route, viewport, mobile behavior, access state, or other unobserved claim.
5. Mark agent-exercised actions as `agent_observed_flow`, never as live-user behavior, user research, or an empirical persona. Do not claim WCAG conformance from visual inspection or a partial automated check.
6. Check every observation for a valid artifact reference and locator. Check that claims are attributed and hypotheses are not promoted to facts. Record gaps and limitations.
7. Keep the evidence package private until an authorized publication review approves specific sanitized excerpts and references.

## Output

Produce a concise Markdown record with: scope; artifact inventory/provenance; route and capture context; observations with evidence references; attributed site claims; inferences/hypotheses; `NOT_VERIFIED` items; privacy/publication status; and limitations. Use the project's existing evidence format when supplied. Do not invent a persistent schema or claim the output validates a site.

## Stop conditions

Stop and report a blocker if source identity/provenance cannot be distinguished, artifacts contain private or sensitive material, requested work requires live access, or publication rights/sanitization are unresolved. Never bypass login, access control, anti-bot challenges, or operator policy.
