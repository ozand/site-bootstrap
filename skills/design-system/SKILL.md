---
name: design-system
description: Apply and audit AI Business Catalyst repository UI constraints before creating or changing Astro layouts, React islands, Tailwind styling, shadcn/Radix primitives, or Command Center chat interfaces. Use when UI work must reuse verified local components, tokens, layouts, hydration patterns, and loading states rather than generic design advice.
license: MIT
metadata:
  audience: frontend
  workflow: repository-ui-constraints
---

# Design System

Apply verified repository UI constraints before optional visual ideation. This skill owns local component, token, layout, and integration consistency; it does not replace UX, accessibility, performance, or visual-regression specialists.

## Precedence

For repository UI work, follow:

1. the user's accepted requirements and explicit product decisions;
2. `AGENTS.md`;
3. live components, layouts, tokens, configuration, and usage sites;
4. this skill;
5. [ui-design-brain](../ui-design-brain/SKILL.md) for optional pattern ideation inside the frozen constraints;
6. external/general frontend skills.

If this document conflicts with live code, treat the live repository as evidence, report the drift, and do not invent a replacement architecture. Generic aesthetic guidance cannot override verified local tokens, shared primitives, layouts, accessibility requirements, or existing component APIs.

## Current verified stack

Verify `package.json` before relying on versions. At the time of this contract, the repository uses:

- Astro 5 with `output: 'server'` and the Vercel adapter;
- React 19 islands through `@astrojs/react`;
- TypeScript 5.8;
- Tailwind CSS 3.4 through `@astrojs/tailwind`;
- shadcn-style local components built on Radix UI;
- `class-variance-authority`, `clsx`, and `tailwind-merge` for variants/class composition;
- `lucide-react` icons.

TanStack, local-first, database, or state libraries are feature choices, not universal design-system requirements. Do not add them merely because another tool uses them.

## Verified source map

Inspect these paths rather than relying on copied examples:

| Concern | Current source |
|---|---|
| Global repository rules | `AGENTS.md` |
| UI tokens and base/component utilities | `src/index.css` |
| Tailwind token mapping, fonts, radius, animation | `tailwind.config.ts` |
| Shared UI primitives | `src/components/ui/` |
| Shared chat components | `src/components/chat-ui/` |
| Standard site layout | `src/layouts/Layout.astro` |
| Command Center layout shell | `src/layouts/ChatLayout.astro` |
| Resource layout | `src/layouts/ResourceLayout.astro` |
| Astro/React/Tailwind/adapter behavior | `astro.config.mjs` |
| Package and script availability | `package.json` |

There is no current `src/styles/` directory. Do not reference or create it unless an approved change explicitly introduces that architecture.

## Verified shared components

These local paths currently exist:

### Command Center

- `src/layouts/ChatLayout.astro` — full-height chat/tool document shell with global CSS, metadata, skip link, and overflow-managed main content.
- `src/components/chat-ui/FloatingChatInput.tsx` — shared chat input with textarea, submit/abort behavior, resizing, shortcuts, slash-command integration, actions, and toolbar slots.
- `src/components/chat-ui/ChatSidebar.tsx` — shared collapsible history/navigation sidebar.
- `src/components/chat-ui/ChatMessage.tsx`, `ChatMessageList.tsx`, `ChatHeader.tsx`, `ChatContainer.tsx` — reusable chat composition pieces.
- `src/components/ui/ToolSkeleton.tsx` — full-page loading fallback aligned with the sidebar/main/input shell.

### General primitives

Inspect `src/components/ui/` before adding anything. Verified examples include:

- `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`;
- `card.tsx`, `table.tsx`, `badge.tsx`, `alert.tsx`;
- `dialog.tsx`, `sheet.tsx`, `popover.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`;
- `tabs.tsx`, `accordion.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`;
- `scroll-area.tsx`, `skeleton.tsx`, `progress.tsx`, `separator.tsx`.

The list is evidence, not a frozen registry. Re-scan the directory for each task and inspect the actual API and usage sites before importing.

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

1. read `AGENTS.md` and the applicable layout;
2. inspect `src/index.css` and `tailwind.config.ts` for tokens;
3. list `src/components/ui/` and `src/components/chat-ui/`;
4. search for existing components with the same role, interaction, or visual state;
5. read the candidate component API and at least one live usage site;
6. identify current loading, empty, error, disabled, focus, active, and responsive states;
7. inspect hydration directives at comparable routes;
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

- Use semantic Tailwind tokens mapped from `src/index.css` and `tailwind.config.ts`: `background`, `foreground`, `card`, `muted`, `primary`, `secondary`, `accent`, `destructive`, `border`, `input`, `ring`, and their foreground variants.
- Preserve `--radius`-based rounded tokens and current font families unless the task explicitly owns a token change.
- Prefer existing `cva`, `cn`, and variant patterns in the target primitive.
- Do not introduce isolated hex/RGB colors, shadow systems, radii, fonts, arbitrary spacing scales, or dark-mode overrides when a semantic token exists.
- A token change is portfolio-wide. Audit consumers and obtain design-owner approval before changing token definitions.

### Phase 5 — Command Center constraints

For full-screen chat/tool experiences, inspect existing live routes such as `src/pages/tools/chat.astro`, `local-chat.astro`, `nexus.astro`, `site-analyzer.astro`, and their components.

Default constraints:

- use `src/layouts/ChatLayout.astro` for the full-height tool shell when the route matches that pattern;
- reuse `FloatingChatInput` rather than creating a custom chat textarea/input bar;
- reuse `ChatSidebar` for compatible history/navigation behavior;
- use `ToolSkeleton` for compatible full-shell loading fallbacks;
- preserve the skip link, `main` target, full-height/overflow behavior, keyboard behavior, and loading geometry;
- inspect existing mobile/responsive behavior instead of assuming fixed `w-64` desktop composition is sufficient for a new route.

A different product interaction may justify a different composition, but the exception must be explicit and evidence-backed. Do not call every form or assistant panel a Command Center.

### Phase 6 — Hydration and loading

Choose the narrowest Astro client directive supported by the interaction:

- no directive for static Astro-rendered UI;
- `client:visible` for below-the-fold islands that can wait for viewport entry;
- `client:idle` for non-critical interactive islands that may wait for idle time;
- `client:load` when interaction is needed immediately after load;
- `client:only="react"` only when server rendering is unsuitable or browser-only dependencies require it.

Do not prescribe `client:only` for every complex React component. Current routes use a mixture of `client:load`, `client:visible`, and `client:only`.

For delayed or client-only rendering:

- provide a fallback only when the chosen directive/component supports it and the wait is user-visible;
- match fallback dimensions to the final layout to reduce layout shift;
- prefer `ToolSkeleton` only for compatible full-page tool geometry;
- use smaller existing skeleton primitives for bounded components;
- do not mix spinner, blank-screen, and incompatible skeleton conventions for equivalent states.

### Phase 7 — Specialist validation

This skill validates repository consistency, not every quality domain:

- route usability findings to [ux-audit](../ux-audit/SKILL.md);
- route normative accessibility testing/remediation to [web-accessibility](../web-accessibility/SKILL.md);
- route measured performance work to [web-performance](../web-performance/SKILL.md);
- route screenshots and visual-delta evidence to [visual-inspection](../visual-inspection/SKILL.md);
- use [skill-portfolio-routing](../skill-portfolio-routing/SKILL.md) for ambiguous multi-domain ownership.

Accessibility and security failures are not aesthetic trade-offs. Performance claims require measurement. A screenshot cannot prove keyboard behavior, screen-reader compatibility, or Core Web Vitals.

## Gotchas and hard stops

### Token drift

**Risk:** isolated colors, radii, shadows, fonts, or dark-mode values create parallel visual systems.

**Stop:** identify the semantic token or obtain explicit approval for a portfolio token change. Report affected consumers.

### Duplicate primitives

**Risk:** a new `Button`, `Textarea`, `Dialog`, card, or sidebar duplicates a verified shared component and drifts in states/API.

**Stop:** show the inspected candidates and why reuse/composition/extension cannot satisfy the contract before creating a new shared primitive.

### Custom chat inputs

**Risk:** a page-specific textarea loses slash commands, abort behavior, shortcuts, resizing, toolbar/actions, accessibility, or interaction consistency.

**Stop:** reuse or deliberately extend `FloatingChatInput`. A replacement requires an approved incompatible interaction and migration/validation plan.

### Inconsistent loading states

**Risk:** blank screens, layout jumps, unrelated spinners, or a full-page `ToolSkeleton` used inside a small card.

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
  hydration:
    directive: none | client:visible | client:idle | client:load | client:only
    reason: string
    fallback: string | none
  owned_changes: []
  delegated_checks: []
  validation: []
  unresolved_decisions: []
```

## Validation

For an implementation handoff, require as applicable:

- referenced paths and imports exist;
- no duplicate primitive was introduced without rationale;
- semantic tokens are used and dark mode remains coherent;
- loading/empty/error/disabled/focus/active states are accounted for;
- hydration choice is justified against comparable routes;
- `npm run check` and `npm run build` pass;
- targeted interaction, accessibility, performance, and visual checks are performed by their owners when in scope.

Build success alone does not prove UX quality, accessibility, visual fidelity, runtime performance, or deployed reachability.
