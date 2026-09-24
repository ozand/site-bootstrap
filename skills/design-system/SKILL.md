---
name: design-system
description: Apply and audit the current site's UI constraints before creating or changing layouts, components, styling, or interactions. Use when UI work must reuse verified local components, tokens, layouts, hydration patterns, and loading states rather than generic design advice.
license: MIT
metadata:
  audience: frontend
  workflow: project-ui-constraints
---

# Design System

Apply verified project UI constraints before optional visual ideation. This skill owns project component, token, layout, and integration consistency; it does not replace UX, accessibility, performance, or visual-regression specialists.

## Precedence

For project UI work, follow:

1. the user's accepted requirements and explicit product decisions;
2. `AGENTS.md`;
3. the project's current `DESIGN.md`, when present;
4. live components, layouts, tokens, configuration, and usage sites;
5. this skill;
6. any available external or project-specific frontend guidance for optional pattern ideation inside the verified constraints.

If this document conflicts with the project's `DESIGN.md`, instructions, or live code, treat those current project sources as evidence, report the drift, and do not invent a replacement architecture. Generic aesthetic guidance cannot override verified tokens, shared primitives, layouts, accessibility requirements, or existing component APIs.

## Inspect the current stack

Do not assume a framework version, rendering mode, adapter, component library, or styling integration from this skill. Inspect the current project's manifest and framework configuration (including Astro configuration when applicable), along with relevant source files, before making recommendations. Treat libraries and state-management choices as project-specific; do not add them merely because another project uses them.

## Inspect live project sources

Start from `AGENTS.md`, the project's actual design-system document (for example, a generated site's `DESIGN.md`), package manifest, framework configuration, layouts, styles, and component directories. Resolve paths from the current repository root; do not assume a particular CSS filename, source tree, component library, or route structure. Use paths and APIs only after confirming that they exist in the current project.

## Reuse verified project components

Before adding a component, inspect the current project's component directories and live usage sites. A component mentioned in another project's documentation is not evidence that it exists here. Confirm the path, API, relevant states, and compatibility with the requested interaction before reuse; if no suitable component exists, describe the gap without inventing a component or import path.

## Operating workflow

### Phase 1 — Freeze the target and constraints

Capture:

```yaml
UI_Request:
  target_paths: []
  route_or_component: string
  user_outcome: string
  interaction_scope: static | hydrated | unknown
  required_states: []
  responsive_scope: []
  accepted_product_decisions: []
  prohibited_changes: []
  decision_owner: string
```

If the requested product behavior or visual direction is materially ambiguous, ask for that decision. Do not turn generic inspiration into a repository constraint.

### Phase 2 — Inspect before creating

Before proposing or writing a primitive:

1. read `AGENTS.md`, the applicable layout, and the current project's `DESIGN.md` when present;
2. inspect the actual style/configuration files for tokens;
3. list the component directories that exist in this project;
4. search for existing components with the same role, interaction, or visual state;
5. read the candidate component API and at least one live usage site;
6. identify current loading, empty, error, disabled, focus, active, and responsive states;
7. inspect the framework's hydration or client-rendering directives at comparable routes, when applicable;
8. record whether the request can be satisfied by reuse, composition, extension, or truly requires a new primitive.

Return `NEEDS_INSPECTION` rather than claiming a component is missing before these checks.

### Phase 3 — Select the least duplicative change

Use this order:

1. reuse an existing component unchanged;
2. compose existing primitives;
3. extend a shared component when the behavior is genuinely shared and compatibility is understood;
4. create a feature-local component for feature-specific composition;
5. create a new shared primitive only when no verified primitive/composition fits multiple real consumers.

Do not add a generic prop to a shared component solely to serve one unrelated page. Do not copy a shared primitive into a feature directory to avoid understanding its API.

### Phase 4 — Apply tokens and layout constraints

- Use the semantic tokens and styling conventions actually defined by the current project; inspect their source files instead of assuming a filename, framework, or token set.
- Preserve the project's existing radius, typography, and other design tokens unless the task explicitly owns a token change.
- Prefer existing variant and class-composition patterns in the target component, when present.
- Do not introduce isolated hex/RGB colors, shadow systems, radii, fonts, arbitrary spacing scales, or dark-mode overrides when a semantic token exists.
- A shared token change can affect the whole site. Audit consumers and obtain design-owner approval before changing token definitions.

### Phase 5 — Specialized interaction patterns

For specialized interfaces such as chat, dashboards, or full-screen tools, inspect existing live routes and components in the current project before choosing a pattern. Reuse an existing layout or interaction component only when it exists and matches the requested behavior. Preserve applicable landmarks, skip links, keyboard behavior, overflow handling, responsive behavior, and loading geometry. Do not assume every form or assistant panel belongs to a specialized interface pattern.

### Phase 6 — Hydration and loading

For Astro projects, choose the narrowest client directive supported by the interaction:

- no directive for static Astro-rendered UI;
- `client:visible` for below-the-fold islands that can wait for viewport entry;
- `client:idle` for non-critical interactive islands that may wait for idle time;
- `client:load` when interaction is needed immediately after load;
- `client:only="react"` only when server rendering is unsuitable or browser-only dependencies require it.

Do not prescribe `client:only` for every complex React component. Inspect the current project's routes and comparable usage before selecting a directive. For non-Astro projects, follow the framework's existing hydration and loading conventions rather than applying Astro directives.

For delayed or client-only rendering:

- provide a fallback only when the chosen directive/component supports it and the wait is user-visible;
- match fallback dimensions to the final layout to reduce layout shift;
- prefer an existing loading component only when its verified API and geometry match the target;
- use smaller existing skeleton primitives for bounded components;
- do not mix spinner, blank-screen, and incompatible skeleton conventions for equivalent states.

### Phase 7 — Specialist validation

This skill validates project consistency, not every quality domain. If the project provides relevant UX, accessibility, performance, visual-inspection, or skill-routing specialists, involve them for the corresponding checks; otherwise state the limitation and keep claims within the evidence collected.

Accessibility and security failures are not aesthetic trade-offs. Performance claims require measurement. A screenshot cannot prove keyboard behavior, screen-reader compatibility, or Core Web Vitals.

## Gotchas and hard stops

### Token drift

**Risk:** isolated colors, radii, shadows, fonts, or dark-mode values create parallel visual systems.

**Stop:** identify the semantic token or obtain explicit approval for a shared token change. Report affected consumers.

### Duplicate primitives

**Risk:** a new `Button`, `Textarea`, `Dialog`, card, or sidebar duplicates a verified shared component and drifts in states/API.

**Stop:** show the inspected candidates and why reuse/composition/extension cannot satisfy the contract before creating a new shared primitive.

### Custom chat inputs

**Risk:** a page-specific chat input may omit expected submission, cancellation, keyboard, resizing, toolbar, accessibility, or interaction behavior.

**Stop:** inspect whether the project already has a suitable shared chat-input component and reuse or extend it when compatible. A replacement requires an approved interaction contract and validation plan.

### Inconsistent loading states

**Risk:** blank screens, layout jumps, unrelated spinners, or a full-page loading pattern used inside a small component.

**Stop:** match fallback scope and dimensions to the final component and comparable routes. Verify loading, success, empty, and error states.

### Stale examples

**Risk:** copied version numbers, component names, import paths, or hydration rules no longer match the repository.

**Stop:** live paths and configuration override this document. Mark non-existent proposals as proposed; never describe them as current.

### Over-broad shared changes

**Risk:** changing tokens or shared APIs for one feature creates hidden regressions.

**Stop:** keep feature-specific composition local unless multiple verified consumers and compatibility evidence justify a shared change.

## Output contract

```yaml
Design_System_Decision:
  status: REUSE | COMPOSE | EXTEND_SHARED | CREATE_LOCAL | PROPOSE_SHARED | NEEDS_INSPECTION | NEEDS_INPUT | CONSTRAINT_CONFLICT
  target: string
  constraints_read: []
  components_inspected: []
  usage_sites_inspected: []
  tokens_used: []
  selected_pattern: string
  rejected_duplicates: []
  rendering:
    framework: string | unknown
    strategy: string | none | unknown
    reason: string
    fallback: string | none
  owned_changes: []
  delegated_checks: []
  validation: []
  unresolved_decisions: []
```

## Validation

For an implementation handoff, require as applicable:

- referenced paths and imports exist in the target project;
- no duplicate primitive was introduced without rationale;
- semantic tokens are used and dark mode remains coherent;
- loading/empty/error/disabled/focus/active states are accounted for;
- framework-specific hydration or rendering choices are justified against comparable routes, when applicable;
- the project's available check and build scripts pass, or unavailable scripts are recorded as not applicable;
- targeted interaction, accessibility, performance, and visual checks are performed by their owners when in scope.

Build success alone does not prove UX quality, accessibility, visual fidelity, runtime performance, or deployed reachability.
