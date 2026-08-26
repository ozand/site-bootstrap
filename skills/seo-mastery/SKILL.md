---
name: seo-mastery
description: Use this skill when the user asks to audit, prioritize, or coordinate SEO improvements across the whole content portfolio, including broken internal-link relationships, orphan pages, dead ends, authority distribution, technical SEO, GEO compliance, and specialist remediation sequencing.
compatibility: Requires Node.js and repository scripts for graph and GEO validation; remediation is delegated to related SEO skills.
---

# SEO Mastery

Coordinate portfolio-level SEO diagnosis and prioritization. This skill owns the cross-portfolio backlog and verification loop; it does not duplicate page-level remediation instructions owned by specialist skills.

## When to use

Use for:

- portfolio-wide SEO audits or recurring health checks;
- prioritizing multiple technical, GEO, and internal-linking findings;
- deciding remediation order across posts, glossary entries, resources, and routes;
- verifying that a coordinated SEO change improved health without harming relevance.

Do not use for a single known metadata fix, one content rewrite, or one internal link. Route that task directly to the appropriate specialist.

## Ownership and boundaries

`seo-mastery` owns:

- baseline collection;
- finding classification and deduplication;
- dependency-aware priority order;
- specialist routing;
- portfolio-level acceptance criteria;
- final re-audit and residual-risk report.

Route implementation details to:

- `technical-seo` — crawlability, indexation, metadata, canonical, sitemap, robots, status codes, and structured data;
- `geo-optimization` — source credibility, direct answers, citation readiness, content structure, and GEO validation failures;
- `content-interlinking` — contextually relevant links among blog, glossary, and resource content.

Do not restate their detailed playbooks. Give each specialist a bounded finding packet and verify its result at portfolio level.

## Inputs

Capture:

- audit scope: full portfolio or named collections/routes;
- business-priority pages or topic clusters;
- known constraints: editorial, legal, migration, release, or content-freeze rules;
- baseline commit or timestamp;
- requested success criteria.

If scope is missing, default to the full content portfolio. Never assume that a high-PageRank page is a business-priority page.

## Workflow

### 1. Establish a baseline

Run the graph analyzer from the repository root:

```bash
npx tsx scripts/seo/graph_analyzer.ts
```

Capture at minimum:

- total pages scanned;
- orphan pages;
- dead ends;
- broken semantic loops reported by the analyzer;
- top internal PageRank pages.

Run GEO validation when the scope includes posts, glossary content, source metadata, or AI-search visibility:

```bash
npm run validate:geo
```

Capture error and warning totals plus affected files. Do not edit content during baseline collection.

### 2. Normalize findings

Create one finding per observable problem:

```json
{
  "id": "SEO-001",
  "type": "broken-link|orphan|dead-end|technical|geo|authority-opportunity",
  "affected": ["paths or routes"],
  "evidence": "command output or audit observation",
  "impact": "blocking|high|medium|low",
  "specialist": "technical-seo|geo-optimization|content-interlinking",
  "depends_on": [],
  "editorial_fit": "confirmed|needs-review|rejected",
  "done_when": "observable verification rule"
}
```

Merge duplicate findings that share the same root cause. Do not merge unrelated pages merely because they have the same metric.

### 3. Prioritize deterministically

Use this order:

1. **Broken access, crawl, indexation, or link targets** — failed user/crawler paths, invalid destinations, status/canonical/robots errors, or other blockers that prevent intended pages from being accessed or indexed. Route routing, redirects, canonicals, robots, status, and indexation behavior to `technical-seo`; route content link corrections to `content-interlinking`.
2. **Orphan pages** — valid indexable pages with no meaningful incoming internal path. Route to `content-interlinking`.
3. **Dead ends and broken semantic loops** — pages that receive traffic or authority but provide no relevant onward path. Route to `content-interlinking`.
4. **Non-blocking technical and GEO quality failures** — structured-signal defects that do not block intended indexation, missing required sources, missing answer structures, or citability warnings. Route to `technical-seo` or `geo-optimization`.
5. **Authority opportunities** — low or uneven authority on approved priority pages after structural defects are fixed.

Within a tier, sort by:

1. crawl/indexation or user-access impact;
2. number of affected pages;
3. business-priority relevance;
4. implementation risk;
5. effort.

Never start authority optimization while higher-tier broken links, orphans, or dead ends remain in the same scope unless they are explicitly blocked and documented.

### 4. Apply the editorial relevance gate

A proposed internal link must:

- help the reader understand or continue the current topic;
- use accurate, descriptive anchor text;
- connect semantically related content;
- avoid misleading, repetitive, or sitewide link placement solely to change PageRank;
- preserve editorial tone and information architecture.

If a link would improve a graph metric but fails editorial relevance, mark `editorial_fit: rejected` and do not implement it. PageRank is diagnostic evidence, not an editorial objective.

### 5. Route bounded remediation packets

Send each specialist only:

- finding ID and evidence;
- affected paths;
- scope and constraints;
- required acceptance rule;
- dependencies and approved priority context.

The specialist proposes or implements the page-level fix. `seo-mastery` accepts it only when the specialist check passes and the change does not introduce a higher-priority regression.

### 6. Re-audit and report

After the remediation batch, rerun the same applicable baseline commands:

```bash
npx tsx scripts/seo/graph_analyzer.ts
npm run validate:geo
```

Compare before and after using identical scope. Report:

- resolved findings by tier;
- new or regressed findings;
- orphan, dead-end, and semantic-loop count changes;
- GEO error/warning changes when applicable;
- deferred findings with blockers;
- authority changes only after structural health is acceptable;
- rejected link ideas and editorial reasons.

## Definition of done

A portfolio increment is ready for review when:

- all targeted higher-tier findings are resolved or explicitly blocked;
- relevant specialist checks pass;
- graph and GEO commands were rerun when applicable;
- no new broken link, orphan, dead end, or critical validation regression was introduced;
- every authority-oriented change passed editorial review;
- the report contains before/after evidence and residual risks.

## Gotchas

- The graph analyzer reports orphans and dead ends, but it does not prove editorial relevance. Human-readable context remains the gate.
- A zero-inbound page may be intentionally isolated, private, canonicalized elsewhere, or outside the indexable portfolio. Classify before linking.
- A dead end is not automatically defective when the page intentionally completes a user journey. Record the rationale when accepting it.
- `npm run validate:geo` can return warnings that require editorial judgment; do not convert every warning into an automatic rewrite.
- Do not optimize PageRank by adding arbitrary links, global footer links, repeated exact-match anchors, or links from unrelated high-authority pages.
- Do not claim that a metric improved without comparable before/after command output.

## Evals

Use `evals/evals.json` to test prioritization, specialist routing, editorial rejection, and non-trigger behavior.

## Related

- `technical-seo`
- `geo-optimization`
- `content-interlinking`
