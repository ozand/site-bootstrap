# Research Question Coverage Matrix (Canonical Methodology Mapping)

- **Version:** 3.0.0 (Sanitized Public Methodology Mapping)
- **Scope:** 28 Research Methodology Questions across 8 Core Architectural Domains
- **Archive Status:** Raw capture corpora, full texts, and DOM dumps are retained in private local research storage ([LOCAL_NOT_SHIPPED]).
- **Standards:** Canonical URL attribution, normative section references, and attributed paraphrases.

---

## 1. Design Systems, Token Architectures & Component Anatomy

### 1.1 Format DESIGN.md: Specification & Token Structure
- **Canonical Source:** SRC-01 (Google Labs)
- **Canonical URL:** `https://github.com/google-labs-code/design.md/blob/main/docs/spec.md`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `DESIGN.md Format`, § `Do's and Don'ts`
- **Methodological Summary:** A DESIGN.md file consists of an optional YAML front matter (containing machine-readable design tokens) and a markdown body providing human-readable rationale. Recommends maintaining WCAG AA contrast (4.5:1 for normal text).
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Format is currently in alpha (`version: alpha`). Schema structure and contrast guidelines are normative; subjective aesthetic harmony cannot be evaluated purely from format rules.

### 1.2 W3C DTCG Format Module: Token Specification & Aliasing
- **Canonical Source:** SRC-02 (W3C Design Tokens Community Group)
- **Canonical URL:** `https://www.designtokens.org/tr/drafts/format/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `3.1 (Design) Token`, § `7.1.1 Curly Brace Syntax`
- **Methodological Summary:** Design tokens are defined as name/value pairs with explicit `$type` and `$value` properties. Complete token references use curly brace syntax `{group.token}` resolving to target values.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** DTCG specifies an abstract JSON schema; translation into CSS variables, Tailwind classes, or code variables requires external transformation tools.

### 1.3 Open UI: Component Anatomy & Slot Model
- **Canonical Source:** SRC-03 (W3C Open UI Community Group)
- **Canonical URL:** `https://open-ui.org/components/customizable-select.explainer/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Replacing the button`
- **Methodological Summary:** Standardized component models separate interactive triggers (buttons) from popup containers (listbox/options), establishing explicit slot and part semantics.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Open UI focuses primarily on advanced primitives (select, popup); arbitrary composite application widgets require custom semantic role mapping.

---

## 2. Accessibility Standards & Visual Heuristics

### 2.1 W3C WCAG 2.2: Normative Success Criteria
- **Canonical Source:** SRC-04 (W3C Accessibility Guidelines Working Group)
- **Canonical URL:** `https://www.w3.org/TR/WCAG22/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Success Criterion 1.4.3 (Contrast Minimum)`, § `2.4.11 (Focus Not Obscured)`
- **Methodological Summary:** Normative web accessibility recommendation defining Level AA thresholds: 4.5:1 text contrast minimum, keyboard focus visibility, touch target sizing (2.5.8), and dragging movements (2.5.7).
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Initial tool truncation at 50,000 characters was resolved via raw client DOM export. Automated DOM audits verify mathematical color contrast and computed target dimensions, but cannot replace manual assistive technology audits (screen readers, keyboard testing).

### 2.2 Nielsen Norman Group: 10 Usability Heuristics
- **Canonical Source:** SRC-06 (Nielsen Norman Group)
- **Canonical URL:** `https://www.nngroup.com/articles/ten-usability-heuristics/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `1: Visibility of System Status` through § `10: Help and Documentation`
- **Methodological Summary:** Foundational principles for user interface design including visibility of system status, match between system and real world, user control, consistency, error prevention, and recognition over recall.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Heuristics provide qualitative evaluation guidelines, not binary deterministic tests.

### 2.3 NN/g Severity Ratings for Usability Problems
- **Canonical Source:** SRC-06-sev (Nielsen Norman Group)
- **Canonical URL:** `https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Severity Factors`, § `0 to 4 Rating Scale`
- **Methodological Summary:** Usability problem severity is graded on a 0-4 scale (0=cosmetic only, 4=catastrophe) based on frequency, impact, and persistence.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Requires evaluators to synthesize multiple observations; automated scripts cannot determine organizational business catastrophe without commercial context.

---

## 3. Product Positioning & Strategic Messaging

### 3.1 April Dunford: 10-Step Positioning Framework
- **Canonical Source:** SRC-07-quick (April Dunford)
- **Canonical URL:** `https://www.aprildunford.com/post/a-quickstart-guide-to-positioning`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Five Components of Effective Positioning`
- **Methodological Summary:** Core positioning architecture: Competitive Alternatives -> Unique Attributes -> Value for Customers -> Target Customer Segments -> Market Category.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Public marketing copy reflects published claims (`[SITE_CLAIM]`); assessing true customer differentiation requires empirical win/loss data against non-phantom alternatives.

### 3.2 Dunford Positioning Traps: Phantom Competitors
- **Canonical Source:** SRC-07-quick (April Dunford)
- **Canonical URL:** `https://www.aprildunford.com/post/a-quickstart-guide-to-positioning`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Traps: Phantom Competitors`
- **Methodological Summary:** Warns against defining positioning against hypothetical competitors rather than real alternatives clients actually default to (e.g., spreadsheets, manual work, doing nothing).
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Public landing pages rarely state manual work as a named competitor; identifying true default alternatives requires deductive inference (`[INFERRED]`).

### 3.3 Market Category Context & Value Perception
- **Canonical Source:** SRC-08 (April Dunford / First Round Review)
- **Canonical URL:** `https://review.firstround.com/the-market-is-trying-to-tell-you-something-listen-up/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Category Creation vs Sub-segmenting`
- **Methodological Summary:** Market categories serve as mental shortcuts for buyers; creating a new category demands substantial capital and education compared to sub-segmenting an existing space.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Initial access to First Round article encountered paywall challenge in early scoping, resolved through companion publications.

---

## 4. Jobs-to-be-Done (JTBD) Frameworks & Customer Forces

### 4.1 Bob Moesta: The Four Forces of Progress
- **Canonical Source:** SRC-10-jtbd (Bob Moesta / The Re-Wired Group)
- **Canonical URL:** `https://therewiredgroup.com/learn/complete-guide-jobs-to-be-done/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `The Four Forces of Progress`
- **Methodological Summary:** Progress is driven by the dynamic tension between Push of the current situation and Pull of the new solution against Anxiety of the new solution and Habit of the present: `(Push + Pull) > (Anxiety + Habit)`.
- **Epistemic Status:** `[OBSERVED]` (as framework standard) / `[HYPOTHESIS]` (when applied to site analysis)
- **Gaps & Unknowns:** Public marketing pages showcase features designed to generate Pull; actual Push triggers, Anxiety blockers, and Habit inertia can only be inferred as hypotheses (`[HYPOTHESIS]`) unless validated through customer interviews.

### 4.2 Moesta Demand-Side Sales Timeline & Struggle Moments
- **Canonical Source:** SRC-10-sales (Bob Moesta / The Re-Wired Group)
- **Canonical URL:** `https://therewiredgroup.com/learn/demand-side-sales-101-stop-selling-and-help-your-customers-make-progress/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `First Thought to Trade-off`
- **Methodological Summary:** Customers do not buy products continuously; purchasing follows a timeline triggered by struggle moments, progressing from First Thought to Passive Looking, Active Looking, Deciding, and Consuming.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Public landing pages capture only the active consideration touchpoints; historical struggle triggers remain unobserved.

### 4.3 Clayton Christensen: Customer Job Hiring & Firing
- **Canonical Source:** SRC-11 (Clayton M. Christensen et al. / HBR)
- **Canonical URL:** `https://hbr.org/2016/09/know-your-customers-jobs-to-be-done`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `What is a Job?`, § `Designing for the Job`
- **Methodological Summary:** Customers "hire" products to solve specific functional, social, and emotional jobs in their lives and "fire" existing solutions when alternatives deliver superior progress.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** High-level strategic formulation; requires operational mapping (Ulwick) for UI screen auditing.

### 4.4 Tony Ulwick: 8-Step Universal Job Map & Customer Roles
- **Canonical Source:** SRC-12 (Tony Ulwick / Strategyn)
- **Canonical URL:** `https://strategyn.com/jobs-to-be-done/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Universal Job Map`, § `Customer Roles`
- **Methodological Summary:** Maps universal operational job execution through 8 chronological steps: Define -> Locate -> Prepare -> Confirm -> Execute -> Monitor -> Modify -> Conclude. Identifies three customer roles: Job Executor, Core Buyer, and Product Lifecycle Support.
- **Epistemic Status:** `[OBSERVED]` (as normative framework)
- **Gaps & Unknowns:** In site reference auditing, demonstrated interface steps reflect verified UI (`[OBSERVED]`), whereas mapping of live human executor goals across all 8 steps is strictly analytical (`[HYPOTHESIS]`).

---

## 5. Customer Journey Mapping (CJM) & Service Blueprints

### 5.1 Nielsen Norman Group: Customer Journey Mapping 101
- **Canonical Source:** SRC-13 (Nielsen Norman Group)
- **Canonical URL:** `https://www.nngroup.com/articles/journey-mapping-101/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Key Elements of a Journey Map`, § `Phases and Timeline`
- **Methodological Summary:** Standard journey map anatomy: Actor, Scenario/Expectations, Journey Phases, Mindsets/Actions/Emotions, and Opportunities.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Public site testing captures observed touchpoints and executed actions; internal mindsets and emotional curves cannot be observed from DOM inspection and remain hypotheses (`[HYPOTHESIS]`). Mobile CJM touch behavior is unverified (`[NOT_VERIFIED]`).

### 5.2 NNG Service Blueprints: Line of Visibility & Backstage
- **Canonical Source:** SRC-14 (Nielsen Norman Group)
- **Canonical URL:** `https://www.nngroup.com/articles/service-blueprints-definition/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Key Components of Service Blueprints`, § `Line of Visibility`
- **Methodological Summary:** Service blueprints separate customer actions from backstage processes using structural lines: Line of Interaction, Line of Visibility, and Line of Internal Interaction.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Public non-invasive audits terminate strictly at the Line of Visibility; backstage database and support processing cannot be observed and are classified as `[UNVERIFIABLE]`.

### 5.3 Welie Interaction Patterns: Problem, Solution, Context, Why
- **Canonical Source:** SRC-17 (Martijn van Welie)
- **Canonical URL:** `https://www.welie.com/patterns/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Pattern Anatomy (Problem, Solution, Context, Why)`
- **Methodological Summary:** Interaction design pattern anatomy: Problem statement, Solution description, Usage context/triggers, and Underlying rationale/trade-offs.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Presence of a pattern on a reference site indicates UI convention adoption; it does not prove conversion efficacy without A/B test data.

---

## 6. UX Benchmarking & Information Architecture

### 6.1 Baymard Institute: Empirical UX Benchmark Methodology
- **Canonical Source:** SRC-15 (Baymard Institute)
- **Canonical URL:** `https://baymard.com/research`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Large-Scale Usability Testing Methodology`
- **Methodological Summary:** Rigorous empirical evaluation across normalized criteria, scoring guideline adherence and calculating weighted performance benchmarks.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Public site audits inspect observed interfaces; full benchmark testing requires cross-competitor comparative datasets.

### 6.2 NNG Information Architecture: Organization & Labeling
- **Canonical Source:** SRC-16 (Nielsen Norman Group)
- **Canonical URL:** `https://www.nngroup.com/articles/ia-study-guide/`
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Information Architecture Components`
- **Methodological Summary:** Core IA systems: Organization systems (hierarchical, sequential, matrix), Labeling systems (clear terminology), Navigation systems (global, local, contextual), and Search systems.
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Navigation hierarchies on public sites reflect published taxonomies; user mental model congruence requires card sorting or tree testing.

### 6.3 Token Grounding vs. Brand Hallucinations
- **Canonical Reference:** Desktop Viewport Inspection Protocol (2018×1269 px)
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Section:** § `Client DOM Style Extraction`
- **Methodological Summary:** Automated audits extract actual computed CSS values via `getComputedStyle` on confirmed viewports (2018×1269 px), disproving LLM memory hallucinations (e.g. Linear CTA is `#E5E5E6` pill radius 9999px with 15.83:1 contrast, not purple `#5E6AD2`).
- **Epistemic Status:** `[OBSERVED]`
- **Gaps & Unknowns:** Desktop inspection is verified; mobile viewport scaling without touch event emulation remains unverified (`[NOT_VERIFIED]`).

---

## 7. Core Ontology & Entity Relationship Architecture

### 7.1 M:N Relationship Architecture: Niche to Site
- **Canonical Source:** Proposed Reference Library Architecture (Proposal Section 2)
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Rule:** `niche.member_site_ids` as Single Source of Truth
- **Methodological Summary:** Sites solve multiple jobs across niches. M:N associations are strictly owned by `niche.member_site_ids`. Sites contain canonical product identity, domain mappings, and reference pointers.
- **Epistemic Status:** `[PROPOSED]`
- **Gaps & Unknowns:** Proposed conceptual data dictionary; tested on 2-site pilot, formal scaling requires schema evolution policies.

### 7.2 Conceptual Entity Dictionary (8 Entities)
- **Canonical Source:** Proposed Data Dictionary (Proposal Section 2.2)
- **Archive Reference:** `[LOCAL_NOT_SHIPPED: private research archive]`
- **Normative Entities:**
  1. `niche`: Industry problem space and grouping of sites.
  2. `site`: Canonical product entity handling multiple domains/subdomains.
  3. `capture`: Point-in-time audit instance with execution receipts, timestamp, viewport, and hashes.
  4. `page`: Individual audited route (`/`, `/pricing`, `/customers`).
  5. `component`: UI element block with Open UI interactive role or markup role + DOM locator hint.
  6. `state`: Contextual/interactive variant (viewport_size, modal_active, theme_mode, pseudo-class).
  7. `claim`: Analytical or observed proposition with statement, epistemic_grade, evidence_refs.
  8. `pattern`: Cross-site architectural convention or interaction model.
- **Epistemic Status:** `[PROPOSED]`
- **Gaps & Unknowns:** Informational architecture specification; not an implemented database schema.

---

## 8. Epistemic Labeling Framework & Methodological Boundaries

### 8.1 5-Grade Epistemic Policy
1. `[OBSERVED]`: Backed by browser client text extraction, rendered DOM exports, computed style metrics, or normative standard text (client-side rendering artifacts, not HTTP server network packet traces).
2. `[SITE_CLAIM]`: Published marketing copy or vendor claims on audited websites.
3. `[INFERRED]`: Analytical deductions derived logically from observable interface evidence.
4. `[HYPOTHESIS]`: Plausible operational interpretations requiring empirical customer validation (including all 4 forces of JTBD progress and operational Job Map customer intent).
5. `[UNVERIFIABLE]`: Not observable within non-invasive public auditing (e.g. backend service processes, private database logic, internal business metrics).

### 8.2 Summary of Methodological Boundaries (Explicit Unknowns)
- **Assistive Technology Audits:** Automated DOM audits evaluate WCAG 2.2 color contrast and computed interactive dimensions; they do not replace screen reader testing or keyboard-nav audits by accessibility specialists.
- **Backstage Service Processes:** Service Blueprints strictly terminate at the Line of Visibility; backstage database and support processing are classified as `[UNVERIFIABLE]` as out of scope.
- **Customer Mindsets in CJMs:** Journey mapping mindsets and emotional curves are tagged `[HYPOTHESIS]` unless supported by direct customer research.
- **Positioning Authenticity:** External audits identify published positioning (Dunford 5 components); testing true differentiation requires empirical win/loss data against non-phantom alternatives.
- **Mobile Viewport Emulation:** Emulated viewports without full device UA and touch-event simulation are tagged as `[NOT_VERIFIED]`.

### 8.3 Canonical Methodology Audit Receipt
- **Audited Scope:** 28 research methodology questions across 8 core architectural domains.
- **Methodological Grounding:** All 28 architectural questions for designing the website reference library are substantiated by normative industry specifications and established frameworks (`SRC-01` to `SRC-17`).
- **Research Access History & Alternatives:** Initial scoping encountered access barriers on early URL attempts (Cloudflare challenge on WCAG in plain text mode, partial landing page teasers on Moesta, First Round article limits). In author-reported local observations (private evidence, not independently auditable from the public repository alone), the normative WCAG page became accessible in the browser session (cause unknown; DOM export does not bypass access challenges), whereupon `surf page.save --selector "html"` exported the complete client rendered DOM avoiding the 50,000-character text cap; companion foundational guides were acquired for Moesta and Dunford.
- **Distinction Between Normative Grounding and Empirical Coverage:**
  - Normative grounding establishes the formal taxonomy, data dictionary, token architecture, and epistemic labeling rules.
  - It does not constitute proof of unobserved empirical operational data: mobile touch interactions remain unverified (`[NOT_VERIFIED]`), live customer psychological states and struggle moments remain hypotheses (`[HYPOTHESIS]`), and internal business churn / conversion funnels remain unavailable (`[UNVERIFIABLE]`).
- **Private Archive Preservation:** In compliance with repository boundaries, full third-party text corpora, raw DOM dumps, and extraction receipts are preserved in the separate local private research archive (`[LOCAL_NOT_SHIPPED]`), with archive integrity tracked out-of-band via cryptographic receipts.
