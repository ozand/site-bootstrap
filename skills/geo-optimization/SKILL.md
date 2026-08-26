---
name: geo-optimization
description: Use this skill when auditing or revising AI Business Catalyst repository content for answerability, entity clarity, claim-to-source traceability, self-contained machine-readable structure, and the actual `npm run validate:geo` checks.
compatibility: Uses the live Astro schema, current content components, and current GEO validator. Does not own technical SEO, internal-link strategy, or evidence collection.
---

# GEO Optimization

Improve how clearly repository content can be understood, extracted, and cited by people and answer systems. Treat GEO recommendations as evidence-qualified editorial hypotheses and repository checks—not guaranteed ranking rules.

## Trigger boundary

Use for:

- auditing a repository post for answerability and citation readiness;
- revising a supported draft to make entities, claims, scope, and answers clearer;
- interpreting and remediating current `npm run validate:geo` findings;
- reviewing whether a draft is self-contained enough for machine consumption.

Do not use for:

- crawling, canonical tags, robots, sitemaps, rendering, performance, structured-data implementation, or indexability — route to `technical-seo`;
- selecting internal-link targets, anchors, or graph relationships — route to `content-interlinking`;
- researching or verifying missing evidence — route to `deep-research`;
- drafting or substantively rewriting the whole article — route to `blog-writing`;
- coordinating publication phases — route to `content-pipeline`.

GEO may flag a boundary issue and return a handoff, but it must not silently perform another specialist's work.

## Evidence posture

Use three labels for recommendations:

- **Repository requirement** — directly enforced by the live schema, current component contract, or current validator.
- **Evidence-supported editorial practice** — supported by accessible research, platform documentation, or repeatable observation, with source and scope stated.
- **Experiment hypothesis** — plausible for answerability or citation readiness but not confirmed as a ranking requirement; define an observable test.

Never claim that a heading pattern, word count, numeric density, FAQ block, direct-answer length, citation style, or “citability score” guarantees inclusion, citation, visibility, or ranking in Google AI Overviews, ChatGPT, Perplexity, Gemini, or another answer system.

Platform behavior changes. If the user asks for platform-specific claims, require accessible current evidence or label the guidance as an experiment hypothesis.

## Inputs

Capture:

```json
{
  "mode": "audit|revise|validate",
  "target": "repository path, slug, or supplied draft",
  "reader_question": "primary question the content must answer",
  "audience": "target reader",
  "evidence": {
    "claim_ledger": [],
    "source_ledger": [],
    "data_holes": [],
    "contradictions": []
  },
  "allowed_changes": ["answer block", "entity introductions", "headings", "source placement", "section structure"],
  "constraints": []
}
```

For `revise`, require explicit change authority. For `validate`, require an accessible repository candidate. If the target is missing or inaccessible, return `GEO_BLOCKED` at `stage: intake`.

## Authority order

When instructions conflict, use:

1. `src/content/config.ts` for active schema fields, types, optionality, and references;
2. current content components/loaders/routes for supported syntax and placement contracts;
3. current `scripts/validate_geo.ts` for what `npm run validate:geo` actually checks;
4. current `package.json` for the command name;
5. this skill and older content examples.

Do not copy a nested author object, fixed source count, fixed component placement, static scoring threshold, or platform checklist into content as permanent truth without checking the higher authorities.

## GEO review workflow

### 1. Establish the question and evidence boundary

Identify:

- the primary reader question;
- the bounded direct answer or thesis;
- material entities and the first place each is introduced;
- accepted claims and their source IDs;
- unsupported, partial, contradicted, or stale claims;
- allowed edit scope.

**Gate:** the reader question and accepted evidence are identifiable. If a required material claim lacks support, return it to `deep-research`/`blog-writing`; GEO does not invent evidence.

### 2. Check the live repository contract

Inspect `src/content/config.ts`, the target file, and any content component that would be added or moved.

Produce `Schema_Check`:

- required field/type results from the active target collection;
- author reference validity;
- source field structure when present or validator-required;
- target path/extension compatibility;
- component existence and accepted props;
- blocking schema/component errors.

The live posts schema currently may differ from older examples, and other collections may have different requirements. Never apply post frontmatter to glossary or another collection without inspecting its schema.

**Gate:** unresolved schema or component errors set `status: blocked`. GEO quality cannot waive invalid repository content.

### 3. Audit answerability

Produce `Answerability_Check`:

- direct answer exists when required by the current validator or brief;
- it answers the identified reader question rather than repeating the title;
- entities, timeframe, geography, population, product/version, and conditions are explicit where material;
- pronouns and shorthand have clear antecedents;
- the answer is self-contained enough to understand outside surrounding paragraphs;
- factual wording maps to accepted claim IDs;
- uncertainty and limitations remain visible.

Do not add a number merely to satisfy a heuristic. A factual number requires traceable evidence and relevant context. If a supported answer has no meaningful numeric claim, preserve accuracy and record the validator warning rather than fabricating one.

### 4. Audit entity clarity and structure

Produce `Entity_Structure_Check`:

- canonical entity names at first mention;
- aliases or acronyms defined once;
- distinct products, organizations, people, standards, and concepts not conflated;
- descriptive headings matching section questions or purposes;
- sections understandable without hidden context such as “as above”;
- tables, lists, and comparison structures used only when they improve comprehension;
- claims and source attribution close enough to remain unambiguous.

Question-style headings can be useful when they match real reader questions, but they are not a universal ranking requirement. Do not rewrite every heading mechanically.

### 5. Audit source traceability

Produce `Source_Check`:

```json
{
  "claim_id": "C1",
  "claim_text": "bounded published claim",
  "source_ids": ["S1"],
  "attribution_location": "section or paragraph",
  "status": "pass|partial|fail",
  "notes": "scope, freshness, contradiction, or access limits"
}
```

Rules:

- each material factual claim must map to accessible or approved source metadata;
- preserve source scope, date, methodology, qualifiers, and contradictions;
- do not invent quotations, statistics, titles, URLs, dates, authors, or original research;
- frontmatter source presence does not prove that body claims are traceable;
- return unsupported claims to evidence revision instead of optimizing their phrasing.

**Gate:** a material unsupported or misattributed claim blocks GEO readiness.

### 6. Propose minimal revisions

Return a `GEO_Revision_Plan` ordered by:

1. blocking repository/schema errors;
2. unsupported or ambiguous claims;
3. missing or nonresponsive direct answer;
4. unclear entities/scope;
5. detached attribution;
6. self-containment and structure improvements;
7. optional experiment hypotheses.

For each change include:

- location;
- observed problem;
- proposed change;
- preserved claim/source IDs;
- rationale label: `repository_requirement|evidence_supported|experiment_hypothesis`;
- validation method.

Keep revisions inside `allowed_changes`. Substantive new argumentation returns to `blog-writing`.

### 7. Run and interpret repository validation

Verify the script in current `package.json`, then run from repository root when applicable:

```bash
npm run validate:geo
```

Interpret current output accurately:

- **Errors** are repository validation blockers for affected content.
- **Warnings** identify heuristic/editorial review items; inspect them individually rather than blindly maximizing a score.
- **Citability Score and dimension scores** are repository heuristics from `scripts/validate_geo.ts`, not external search-engine metrics or ranking guarantees.
- The current validator may report errors/warnings without setting a nonzero process exit code. Therefore command exit success alone is not a pass: parse the report for the target and record its errors and warnings.
- The validator scans the posts collection rather than necessarily isolating one target. Distinguish target findings from unrelated repository findings and never claim an unrelated warning was fixed.

Produce `Validation_Result`:

```json
{
  "command": "npm run validate:geo",
  "executed": true,
  "exit_code": 0,
  "target": "file",
  "target_errors": [],
  "target_warnings": [],
  "target_score": null,
  "unrelated_findings": [],
  "interpretation": "pass|revise|blocked"
}
```

Never report the command or target as passed unless it was executed and the target report was inspected.

### 8. Final GEO decision

Return `GEO_Report`:

```json
{
  "status": "ready|revise|blocked",
  "answerability": "pass|revise|blocked",
  "entity_clarity": "pass|revise|blocked",
  "source_traceability": "pass|revise|blocked",
  "schema": "pass|blocked",
  "validation": "pass|revise|blocked|not_run",
  "recommendations": [],
  "experiment_hypotheses": [],
  "handoffs": [],
  "residual_risks": []
}
```

Decision rules:

- `blocked` — schema/component error, validator error for target, unsupported material claim, fabricated attribution, or inaccessible target.
- `revise` — answer/entity/source clarity is materially weak or target warnings require justified editorial changes.
- `ready` — required checks pass, no blocker remains, material claims are traceable, and warnings are resolved or explicitly assessed as non-blocking with rationale.

`ready` means GEO-ready for the next pipeline gate, not guaranteed ranking, citation, publication, or human approval.

## Boundary handoffs

- `technical-seo`: crawlability, rendering, canonical/index directives, sitemap, robots, structured-data implementation, metadata, performance, HTTP behavior.
- `content-interlinking`: link targets, anchors, orphan analysis, graph relationships, route-valid contextual links.
- `deep-research`: missing, stale, contradictory, or inaccessible evidence.
- `blog-writing`: substantive rewriting, new argumentation, or changes outside GEO edit authority.
- `content-pipeline`: publication sequencing and final readiness.

## Gotchas

- The current validator's message may describe a placement rule more strongly than its code verifies. Treat the actual implemented check as repository behavior and separately inspect the component/editorial contract.
- Optional schema fields can still be required by the current validator for GEO purposes; label this as a validator requirement, not a schema requirement.
- A high heuristic score does not excuse unsupported claims or schema errors.
- A low statistical-density score is not permission to add decorative numbers.
- Author bio/social warnings concern the referenced user record; do not replace a valid author reference with a nested object.
- Do not require FAQ, Quote, tables, question headings, or a word count unless the brief, live contract, or evidence-supported rationale calls for them.

## Evals

Use `evals/evals.json` for grounded audit, unsupported claims, live-schema conflict, validator-output interpretation, boundary routing, and experimental platform advice.
