---
name: llms-txt-standard
description: Use this skill when auditing or specifying AI Business Catalyst `llms.txt`, condensed/full LLM context indexes, and their listed public HTML or Markdown routes for accuracy, reachability, publication eligibility, canonical identity, and deterministic size policy.
compatibility: Treats llms.txt as a proposed discovery convention. Uses live Astro routes, public content filters, site identity, mirrors, and build/runtime validation.
---

# llms.txt Standard

Maintain machine-readable discovery indexes as verifiable public route inventories. `llms.txt` is an emerging proposal/convention, not a universally enforced search-engine, crawler, ranking, or citation standard.

## Trigger boundary

Use for:

- auditing `/llms.txt`, `/llms-ctx.txt`, or `/llms-ctx-full.txt` route design and output;
- specifying which public routes may appear in machine-readable indexes;
- checking HTML/Markdown endpoint pairs, canonical origin, duplicates, and stale claims;
- defining deterministic context-file selection, truncation, and omission reporting;
- reviewing whether draft/private/API-only content is excluded.

Do not use for:

- implementing or debugging Astro routes, data loaders, Supabase queries, caching, or deployment code — hand findings to the owning developer;
- crawl/index/canonical/robots/sitemap implementation — route to `technical-seo`;
- content answerability or citation phrasing — route to `geo-optimization`;
- internal-link graph work — route to `content-interlinking`;
- substantive article drafting — route to `blog-writing`.

This skill may propose a bounded route/content contract and acceptance tests, but it does not claim application ownership.

## Protocol posture

Always state:

- `llms.txt` is a voluntary proposal/convention with varying adoption;
- serving it does not guarantee crawling, ingestion, citation, ranking, or use by any model/provider;
- conventional structure can improve discoverability for clients that choose to consume it;
- repository route correctness and public eligibility are testable even when ecosystem impact is uncertain.

Separate:

- **Repository requirement** — enforced by live routes, content policy, identity configuration, or tests;
- **Convention recommendation** — follows the current llms.txt proposal or common interoperable formatting;
- **Experiment hypothesis** — an observable change whose external client impact is not guaranteed.

## Inputs

Capture:

```json
{
  "mode": "audit|specify|validate",
  "targets": ["/llms.txt", "/llms-ctx.txt", "/llms-ctx-full.txt"],
  "environment": "development|preview|production",
  "canonical_origin": "configured public origin or null",
  "public_content_policy": {
    "include": [],
    "exclude": ["draft", "private", "API-only", "unpublished"]
  },
  "size_budgets": {},
  "constraints": []
}
```

For validation, require accessible route output or an executable preview/production target. If unavailable, return `LLMS_INDEX_BLOCKED` at `stage: intake` instead of inventing results.

## Authority order

Inspect:

1. `src/lib/site-identity` and Astro site configuration for canonical origin/brand identity;
2. live files under `src/pages` for route existence and response contract;
3. content/data access functions for publication filtering and ownership;
4. live collection schema and source ownership (`src/content/config.ts`, Supabase-backed domains, page files);
5. generated preview/production responses;
6. sitemap/robots only as corroborating route inventory, not sole authority;
7. this skill and old examples.

A filename pattern is not proof that a route exists. A database record is not proof that it is publicly publishable.

## Endpoint roles

Use current implementation, not a universal requirement, to define roles:

- `/llms.txt` — concise curated index of public destinations.
- `/llms-ctx.txt` — bounded condensed context with an explicit byte budget and deterministic selection.
- `/llms-ctx-full.txt` — broader inventory/context; “full” still requires public eligibility, route validity, and a documented practical size policy.
- Markdown mirrors — optional route pairs only when the actual endpoint exists and returns the intended public representation.

Do not require `/llms-ctx.txt` or `/llms-ctx-full.txt` on other sites merely because this repository uses them.

## Workflow

### 1. Inventory live route producers

Produce `Route_Inventory`:

```json
{
  "route": "/llms.txt",
  "producer": "src/pages/llms.txt.ts",
  "method": "GET",
  "content_type": "text/plain; charset=utf-8",
  "data_sources": [],
  "publication_filter": "verified behavior",
  "status": "verified|partial|missing"
}
```

Inspect the route files and every linked route family. For generated routes, inspect their dynamic route producers and backing lookups.

**Gate:** every target route has a live producer or is reported missing. Do not design content around nonexistent endpoints.

### 2. Establish canonical identity

Verify:

- canonical site origin comes from the current identity/configuration path;
- absolute URLs use one expected origin and HTTPS in production where configured;
- brand name/alias are sourced consistently;
- no localhost, preview hostname, stale domain, mixed origin, or malformed URL leaks into production output;
- relative URL construction resolves as expected.

Return `Identity_Check` with expected origin, observed origins, and mismatches.

**Gate:** an unknown or inconsistent production origin blocks a publication-ready index.

### 3. Classify publishable records

For each candidate record, capture:

```json
{
  "source_type": "post|glossary|model|page|resource",
  "source_id": "slug or path",
  "public_html_route": "verified route or null",
  "public_markdown_route": "verified route or null",
  "publication_status": "public|draft|private|api_only|unpublished|unknown",
  "include": true,
  "reason": "observable eligibility decision"
}
```

Rules:

- include only records with an intended public route in the target environment;
- exclude `draft: true` and other unpublished statuses even if development helpers return them;
- do not expose private, restricted, preview-only, admin, session, secret, or internal operational content;
- API/Supabase data may be listed only when an actual public page or public mirror resolves for that record;
- a route family existing is insufficient: verify the individual slug resolves and is eligible;
- exclude records with unknown publication status until ownership/visibility is confirmed;
- record exclusions by category and count.

Development behavior can include drafts while production filters them. Validate production semantics rather than trusting a development collection result.

### 4. Verify HTML and mirror routes

For every URL proposed for an index, verify:

- URL parses and uses expected origin;
- response status is successful without an unintended redirect chain;
- final URL remains an allowed public route;
- content type matches the advertised representation;
- response is not a 404 page returned with success status;
- title/slug identity corresponds to the listed record;
- Markdown mirror is listed only when its dynamic route exists and the individual lookup succeeds;
- duplicate canonical destinations are deduplicated.

Typical repository route families must be confirmed from live files, for example:

- `/blog/<slug>` and `/blog/<slug>.md`;
- `/glossary/<slug>` and `/glossary/<slug>.md`;
- `/tools/models/<slug>` and `/tools/models/<slug>.md`.

These examples are not permanent truth. Exclude a broken mirror while retaining a valid HTML route, unless the index contract explicitly requires both and returns the record for repair.

Produce `URL_Validation` with requested URL, status, final URL, content type, identity match, and decision.

### 5. Validate index claims

Check descriptive statements against live behavior. Examples requiring proof:

- “sources are required” versus schema optionality and validator behavior;
- “validated in CI” versus actual package/CI configuration;
- “DirectAnswer is required” versus current validator/component enforcement;
- “all Markdown mirrors are exposed” versus route/slug checks;
- structured-data types versus rendered implementation;
- “full” versus actual caps, sampling, and omitted domains.

Classify each claim as `verified|qualified|remove`. Do not publish trust/quality language that overstates current implementation.

### 6. Define deterministic ordering and selection

Before applying a size budget, define stable ordering and tie-breakers:

- posts: public status, business/editorial priority if explicitly provided, date descending, slug ascending;
- glossary: explicit priority if provided, otherwise stable name/slug ordering;
- models or API-backed records: public-route eligibility, explicit priority, release/update date descending, slug ascending;
- static routes: fixed declared order.

Do not rely on database return order or an unstable sort. Deduplicate before counting toward limits.

### 7. Enforce context size policy

Measure UTF-8 bytes, not JavaScript character count, when the budget is specified in bytes/KB. State the exact integer: this repository's current `MAX_SIZE = 32000` claim means 32,000 UTF-8 bytes, not the binary 32 KiB value of 32,768 bytes. If policy changes to KiB, name it explicitly.

For each context endpoint document:

```json
{
  "route": "/llms-ctx.txt",
  "budget_bytes": 32000,
  "hard_or_soft": "hard",
  "selection_order": [],
  "minimum_sections": {},
  "reduction_order": [],
  "entry_truncation": "none|field-level policy",
  "omission_report": true,
  "overflow_behavior": "reduce|blocked"
}
```

Condensed policy:

1. reserve bytes for identity, endpoint links, section headings, and omission summary;
2. select only eligible/deduplicated records in deterministic order;
3. reduce lower-priority section limits in documented order;
4. never cut a URL, Markdown list item, UTF-8 sequence, or record halfway;
5. do not remove all representation of a required core section silently;
6. report included/eligible/omitted counts by section;
7. if the minimum valid document cannot fit, return blocked rather than emit malformed or misleading output.

A loop that compares JavaScript `string.length` to “32KB” is a character heuristic, not verified byte enforcement. Record this as an implementation gap if present.

Full-context policy:

- define whether the endpoint is bounded or intentionally uncapped;
- even if uncapped, document operational safeguards, deterministic ordering, record caps (for example top-N models), and omitted domains;
- do not call it the “entire knowledge base” when records, fields, domains, private data, or API-only content are omitted;
- publish counts and selection notes so “full” is interpretable.

### 8. Validate generated responses

Use actual HTTP requests against a built preview or production URL when attesting status, redirects, headers, final URLs, or reachability. Direct route-function execution may help inspect body-generation logic, but it cannot by itself attest deployed HTTP behavior. For each target record:

```json
{
  "route": "/llms.txt",
  "http_status": 200,
  "content_type": "text/plain; charset=utf-8",
  "size_bytes": 0,
  "listed_urls": 0,
  "broken_urls": [],
  "duplicate_urls": [],
  "ineligible_records": [],
  "claim_mismatches": [],
  "status": "pass|revise|blocked"
}
```

Validation requirements:

- `npm run check` and `npm run build` may confirm Astro integration but do not prove deployed link reachability;
- inspect actual route response bodies and headers;
- validate listed URLs against the same environment/canonical origin;
- separate route implementation failures from content/index-policy findings;
- never claim remote validation occurred unless requests were executed.

### 9. Final decision

Return `LLMS_Index_Report`:

```json
{
  "status": "ready|revise|blocked",
  "protocol_posture": "proposal/convention",
  "route_inventory": [],
  "identity": {},
  "included_counts": {},
  "excluded_counts": {},
  "url_validation": {},
  "size_policy": {},
  "claim_validation": {},
  "implementation_handoffs": [],
  "residual_risks": []
}
```

Decision rules:

- `blocked` — unknown production origin, inaccessible target output, private/draft leakage, malformed output, broken required endpoint, or minimum valid document cannot fit.
- `revise` — broken optional mirror, stale/overstated claim, nondeterministic selection, duplicate URL, or missing omission report when no hard policy is currently violated. A generated response that still exceeds a declared hard byte budget is `blocked`; it becomes `revise` only while a deterministic reduction is proposed but not yet emitted/revalidated.
- `ready` — routes and listed URLs are public/reachable, identity is consistent, eligibility/exclusions are explicit, claims are accurate, and size policy is deterministic and validated.

`ready` does not mean external crawlers will consume or reward the files.

## Blocked response

```json
{
  "status": "LLMS_INDEX_BLOCKED",
  "stage": "intake|identity|eligibility|route_validation|size|response_validation",
  "blockers": [],
  "required_action": [],
  "safe_artifacts": []
}
```

## Gotchas

- Never index a draft because it appears in development.
- Do not equate Supabase/API availability with public-page eligibility.
- Do not derive a Markdown mirror by appending `.md` unless the route producer and individual slug are verified.
- A successful build does not prove every generated absolute URL works in production.
- Content-Type must match what the index promises.
- Count UTF-8 bytes for byte budgets; Cyrillic text makes character-count assumptions especially unsafe.
- Stable sorting needs a tie-breaker.
- Report omissions; silent truncation makes an index misleading.
- Keep operational/private URLs, credentials, unpublished research, sessions, and admin endpoints out of public indexes.

## Evals

Use `evals/evals.json` for proposal framing, draft leakage, broken mirrors, API-only models, canonical-origin mismatch, byte overflow, stale trust claims, and validation-boundary scenarios.
