---
name: content-interlinking
description: Use this skill when auditing, selecting, inserting, or validating contextual internal links for a bounded set of AI Business Catalyst posts and glossary entries, including anchor quality, destination relevance, broken targets, duplicate links, and scoped orphan/dead-end risk.
compatibility: Uses live repository collections/routes, page-frontmatter contracts, current link scripts, and reference validation. Portfolio-wide graph prioritization belongs to seo-mastery.
---

# Content Interlinking

Create useful navigational relationships without inventing routes, mutating unsupported collections, or adding weak links to satisfy a quota.

## Trigger boundary

Use for:

- selecting contextual internal-link candidates for a named post or small approved set;
- inserting or reviewing links among posts, glossary entries, and verified resource pages in a bounded content edit;
- validating glossary `relatedPosts` and verified resource-page `relatedBlog` relationships;
- checking broken targets, duplicate links, anchor quality, and local orphan/dead-end risk;
- reviewing a dry-run auto-linker proposal before any write operation.

Do not use for:

- site-wide graph scoring, portfolio clusters, global orphan prioritization, or allocation of linking work across the corpus — route to `seo-mastery`;
- substantive article drafting — route to `blog-writing`;
- answerability/source optimization — route to `geo-optimization`;
- crawl/index/render/canonical/sitemap work — route to `technical-seo`;
- end-to-end publication sequencing — route to `content-pipeline`.

This skill owns candidate selection, contextual insertion, and scoped verification after a target is assigned. It may report portfolio observations, but it must not reprioritize the entire content graph unless `seo-mastery` supplies that scope.

## Inputs

Capture:

```json
{
  "mode": "audit|plan|apply|validate",
  "source_paths": ["approved files to inspect or change"],
  "objective": "reader-navigation or knowledge relationship outcome",
  "allowed_destinations": ["collections or routes permitted by scope"],
  "relationship_scope": ["post_to_glossary", "glossary_to_post", "post_to_post"],
  "change_authority": "findings_only|approved_changes",
  "constraints": []
}
```

For `apply`, require named source files and explicit change authority. If a source is missing/inaccessible or the requested destination route cannot be verified, return `INTERLINKING_BLOCKED` at `stage: intake|target_validation`.

## Authority order

Before proposing relationships, inspect:

1. `src/content/config.ts` for live Astro collections and relationship fields;
2. current page files, layouts, routes, and loaders for non-collection contracts such as `src/pages/resources/*` and their frontmatter;
3. current files/slugs for target existence;
4. current link scripts for automation/analysis behavior;
5. current `scripts/validate-references.ts` and `package.json` for repository checks;
6. this skill and old content examples.

A relationship may be live without being an Astro content-collection field. For example, resource pages can exist under `src/pages/resources/*` and use layout-consumed `relatedBlog` frontmatter. Verify the page/layout contract and both routes. Conversely, never invent a new `resources` collection, models content directory, field, route, or reciprocal relationship merely because an old standard or script assumes one.

## Relationship contract

Represent each candidate as:

```json
{
  "source_path": "src/content/posts/example.mdx",
  "destination": "/glossary/concept_example",
  "destination_type": "glossary",
  "anchor": "bounded contextual phrase",
  "context": "sentence or section purpose",
  "relationship": "definition|background|evidence_context|next_step|related_analysis",
  "relevance": "strong|conditional|weak",
  "target_verified": true,
  "duplicate": false,
  "reader_value": "what the destination adds",
  "decision": "accept|revise|reject"
}
```

Accept only when the destination adds information the reader is likely to need at that point.

## Workflow

### 1. Verify live collections and routes

Produce `Repository_Link_Contract`:

- source collection and allowed relationship types;
- destination collections/routes that actually exist;
- target slug/path lookup method;
- schema-backed or page-layout-backed reciprocal fields, if any;
- supported resource-page relationships and their route/frontmatter contract;
- unsupported legacy relationships;
- applicable repository tools and limitations.

Current contracts may include glossary `relatedPosts` in `src/content/config.ts` and resource-page `relatedBlog` frontmatter consumed by a current layout. Verify rather than assume. Inline Markdown links, content-schema fields, and page-frontmatter contracts are different mechanisms and must be checked separately.

**Gate:** every proposed destination type and route is supported by the live repository. Unsupported or unverifiable relationships are rejected, not fabricated.

### 2. Understand the source context

For each approved source file, identify:

- article purpose and audience;
- section purpose;
- entities/concepts already explained locally;
- terms that genuinely need definition or deeper context;
- existing internal links and their destinations;
- links that are duplicated, misleading, obsolete, or placed inside code/import/frontmatter contexts;
- reader paths that end without a useful next step.

Do not turn every entity mention into a link. The first occurrence is not automatically the best occurrence.

### 3. Generate candidates

Generate the smallest useful candidate set from verified targets. Candidate sources can include:

- explicit concepts/entities in the text;
- related analysis that answers the reader's next likely question;
- schema-backed reciprocal relationships;
- dry-run automation proposals;
- a portfolio priority list supplied by `seo-mastery`;
- a verified resource page whose `relatedBlog` relationship and `/resources/<slug>` route add useful source or translation context.

A numeric target is a review ceiling or planning signal, not a minimum. Zero links is valid when no candidate improves reader understanding.

### 4. Evaluate destination relevance

Reject or revise a candidate when:

- the destination only shares a keyword but not meaning;
- the destination does not answer the contextual need;
- the target is draft-only, unavailable, redirected incorrectly, or outside allowed scope;
- the destination repeats the source without adding depth;
- the link would misrepresent an entity, product, person, or concept;
- a more specific verified destination exists;
- the proposal exists only to increase link count or presumed PageRank.

For conditional relevance, state what must be true before acceptance.

### 5. Evaluate anchor quality

An acceptable anchor:

- identifies the destination topic without requiring surrounding guesswork;
- matches the source sentence grammatically;
- is neither misleadingly broad nor stuffed with keywords;
- preserves the sentence's factual meaning and tone;
- avoids generic anchors such as “here,” “read more,” or a raw URL when descriptive wording is possible;
- does not imply an endorsement, equivalence, or claim absent from the destination;
- does not link a heading, code sample, import, frontmatter, existing link, or unrelated repeated occurrence accidentally.

Prefer one well-placed descriptive link over repeated links to the same destination in a short section.

### 6. Check graph safety in the edited scope

Produce `Scoped_Graph_Check`:

- verified outgoing targets from each edited source;
- inbound relationship updates required by the live schema;
- source files with no useful outgoing next step (`dead_end_risk`);
- destination entries with no verified inbound relationship in the inspected scope (`orphan_signal`);
- duplicate source/destination pairs;
- broken or unsupported targets;
- findings requiring portfolio analysis.

An `orphan_signal` from a bounded audit is not proof of a site-wide orphan. Hand portfolio-wide confirmation and prioritization to `seo-mastery`.

### 7. Use automation safely

The current auto-linker can be previewed with:

```bash
npx tsx scripts/seo/auto_linker.ts --dry-run
```

Treat its output as candidates, not approved edits. Current behavior must be inspected before use; it may:

- scan more files than the requested scope;
- match aliases/terms by regex without semantic disambiguation;
- insert only the first matching occurrence;
- propose glossary links inside content contexts that still need human review;
- update glossary `relatedPosts` when write mode is used;
- reference a legacy models directory that may not be a live content collection;
- write directly when `--dry-run` is omitted.

Rules:

1. Verify the script path and behavior.
2. Record that the current script has no per-source filter and scans its configured corpus globally.
3. Run dry-run first.
4. Filter the global proposals to approved source paths and live destination routes.
5. Review relevance, anchor, context, duplicates, and diff impact.
6. Never run write mode merely because dry-run completed.
7. If write mode is explicitly approved, inspect the exact diff and revert/reject weak proposals before validation.

The skill does not assume an npm alias or target-file option exists for the auto-linker.

For portfolio diagnosis, the repository also contains `scripts/seo/graph_analyzer.ts`. Treat it as `seo-mastery` evidence, not authoritative ground truth: it performs a global scan and PageRank/orphan/dead-end report, but its configured models/resources directories and route assumptions can be stale, it filters outbound links to nodes represented in its constructed graph, and it does not judge contextual relevance or anchor quality. `content-interlinking` may consume an approved candidate list from this analysis; it does not use the script to justify unreviewed bulk edits.

### 8. Apply bounded changes

For each accepted candidate:

- edit only approved source/relationship files;
- preserve facts, citations, formatting, component syntax, and unrelated content;
- add at most the accepted occurrence;
- update reciprocal schema or page-frontmatter fields only when a current schema/layout defines them and the relationship is verified;
- record rejected automation proposals and reasons.

Return `Link_Change_Set` with changed files and accepted/rejected candidate IDs.

### 9. Validate

Verify commands in current `package.json`. For schema-backed cross-references, run:

```bash
npm run validate:refs
```

Interpret it accurately:

- it currently validates specific frontmatter relationships such as glossary `relatedPosts`/`mentionedIn` to posts and industries to departments;
- it does not validate every inline Markdown URL, every route, anchor quality, destination relevance, duplicates, or site-wide orphan status;
- a nonzero exit is blocking for affected references;
- exit success is not proof that inline links are relevant or all targets exist.

For inline links, also perform target-specific existence/route checks and inspect the diff. Run broader repository checks required by the publication pipeline when requested.

Produce `Validation_Result`:

```json
{
  "commands": [],
  "changed_files": [],
  "broken_targets": [],
  "schema_reference_failures": [],
  "duplicate_links": [],
  "scope_violations": [],
  "unrelated_findings": [],
  "status": "pass|revise|blocked"
}
```

### 10. Final decision

Return `Interlinking_Report`:

```json
{
  "status": "ready|revise|blocked",
  "accepted_links": [],
  "rejected_links": [],
  "anchor_findings": [],
  "broken_targets": [],
  "dead_end_risks": [],
  "orphan_signals": [],
  "portfolio_handoffs": [],
  "validation": {},
  "residual_risks": []
}
```

Decision rules:

- `blocked` — inaccessible source, broken/unsupported target, schema-backed reference failure, unauthorized mutation, or unreviewed bulk write.
- `revise` — weak/ambiguous anchors, conditional relevance, duplicates, dead-end risk, or accepted candidates not yet applied/validated.
- `ready` — all applied links are relevant, descriptive, target-verified, scoped, non-duplicative, and required checks pass.

`ready` means link-ready for the next pipeline gate, not portfolio-optimal or publication-approved.

## Blocked response

```json
{
  "status": "INTERLINKING_BLOCKED",
  "stage": "intake|target_validation|application|validation",
  "blockers": [],
  "required_action": [],
  "safe_artifacts": []
}
```

## Gotchas

- Keyword overlap is not destination relevance.
- `npm run validate:refs` validates a bounded set of schema references, not all inline links.
- A dry run can still propose unsafe or out-of-scope edits; no-write does not mean approved.
- Existing `relatedPosts` values use slugs, not full routes; verify against the live schema/tool.
- Resource routes and `relatedBlog` can be valid page-layout contracts even though they are absent from `src/content/config.ts`; verify `src/pages/resources/*`, the consuming layout, and both routes.
- Do not create a new resources collection, unsupported reciprocal field, or model relationship when the live repository lacks that specific contract.
- Do not remove a manual relationship merely because automation did not rediscover it.
- Do not convert a local orphan signal into a site-wide priority claim; hand it to `seo-mastery`.
- Preserve unrelated dirty files and stage only explicitly owned prompt assets when modifying this skill.

## Evals

Use `evals/evals.json` for contextual linking, weak quotas, broken targets, dry-run review, reference-validation limits, reciprocal fields, and portfolio-boundary scenarios.
