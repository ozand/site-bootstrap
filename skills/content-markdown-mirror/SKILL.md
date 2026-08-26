---
name: content-markdown-mirror
description: Design, review, and verify public Markdown mirror endpoints for repository content. Use when working on `.md` routes, raw Markdown responses, crawler-facing content mirrors, publication filtering, frontmatter serialization, missing-slug behavior, or deployed HTTP validation for blog, glossary, and model pages.
license: MIT
metadata:
  audience: engineering
  workflow: content-delivery
---

# Content Markdown Mirror

Create or review a Markdown mirror only when a public HTML record has a legitimate raw-text representation. Preserve publication boundaries, source meaning, and route identity. A mirror is an alternate representation, not permission to expose every stored record.

This skill defines implementation and verification contracts. It does not itself edit route code, publish content, commit, deploy, or prove that an external crawler will ingest the response.

## Outcomes

Return exactly one primary outcome:

- `MIRROR_READY` — repository and deployed HTTP checks pass for the requested route set.
- `MIRROR_BLOCKED` — one or more safety, fidelity, route, or HTTP checks fail.
- `NEEDS_INPUT` — a decision such as eligible content class or Markdown/MDX policy is missing before implementation begins.
- `NOT_APPLICABLE` — the record has no public HTML route or no approved Markdown representation.

Never report `MIRROR_READY` from build success alone.

## Live repository precedence

Before proposing code, inspect current route, data, and schema files. These live contracts override examples in this skill:

1. `src/pages/**` HTML and `.md.ts` route implementations;
2. route helpers such as `src/lib/markdown-utils.ts`;
3. publication filters such as `src/lib/content.ts`;
4. `src/content/config.ts` and current database access types;
5. `package.json` scripts and deployment configuration.

If implementation and this document disagree, report the mismatch. Do not silently follow the example.

## Implemented route inventory

At the time of this skill revision, the repository contains these route implementations. `Implemented` means the route files exist; it does not attest public eligibility, deployed reachability, or `MIRROR_READY`:

| Content class | Implemented HTML route | Implemented Markdown route | Data source | Current rendering seam | Publication-boundary status |
|---|---|---|---|---|---|
| Blog | `/blog/{slug}` | `/blog/{slug}.md` | Astro `posts` collection | `createMarkdownResponse(entry)` | Needs parity verification: HTML list filters production drafts, mirror directly looks up an entry |
| Glossary | `/glossary/{slug}` | `/glossary/{slug}.md` | Astro `glossary` collection | `createMarkdownResponse(entry)` | No draft field in current schema; still requires negative and deployed checks |
| Model | `/tools/models/{slug}` | `/tools/models/{slug}.md` | Supabase model row | `gray-matter` reconstruction | Unknown until an explicit HTML/mirror visibility predicate is verified |

The implementing files are:

- `src/pages/blog/[...slug].md.ts`
- `src/pages/glossary/[...slug].md.ts`
- `src/pages/tools/models/[...slug].md.ts`
- `src/lib/markdown-utils.ts`

All other patterns are illustrative until a matching live HTML route, source seam, and mirror implementation are verified. Do not claim universal resource-page mirrors merely because `/resource/{slug}.md` would be a plausible pattern.

Rebuild this inventory whenever routes or content storage change.

## Core invariants

For every eligible record:

1. HTML and Markdown routes identify the same logical record.
2. The HTML record is publicly eligible before the Markdown record can be public.
3. A missing, malformed, private, draft, preview-only, or unpublished record never returns a successful mirror.
4. Source facts and uncertainty are not rewritten for crawler convenience.
5. Frontmatter is serialized by a library or a tested structured serializer, never by unsafe scalar interpolation.
6. The body is preserved intentionally; any transformation is declared and tested.
7. A successful response uses `text/markdown; charset=utf-8`.
8. Deployed reachability and headers are attested with actual HTTP requests.

## Workflow

### Phase 0 — Scope and eligibility

Record:

```yaml
Mirror_Request:
  content_classes: [blog, glossary, model]
  environment: development | preview | production
  origin: https://example.com
  mode: implement | review | verify
  mdx_policy: preserve | convert | block
  expected_routes: []
  decision_owner: string
```

Classify each candidate:

- `public` — HTML route is intentionally public and mirror-eligible;
- `draft` — authoring state, never production mirror-eligible;
- `private` or `restricted` — never public mirror-eligible;
- `preview_only` — available only through an explicitly protected preview mechanism;
- `unknown` — publication status cannot be proven; block by default;
- `no_public_route` — no matching public HTML route; return `NOT_APPLICABLE` unless a route owner approves a new pair.

**Gate:** every candidate has a proven HTML route, source seam, publication rule, and Markdown/MDX policy. Unknown eligibility blocks implementation.

### Phase 1 — Route parity contract

Create one row per route family:

```yaml
Route_Contract:
  content_class: blog
  html_pattern: /blog/{slug}
  markdown_pattern: /blog/{slug}.md
  implementation_file: src/pages/blog/[...slug].md.ts
  source_lookup: Astro posts collection
  publication_filter: explicit rule or MISSING
  canonical_identity: normalized logical slug
  known_good_slug: string
  known_missing_slug: string
  malformed_slugs: []
  redirect_policy: no redirect | documented canonical redirect
```

Slug handling must be derived from the live router and lookup seam. Test at least:

- absent slug;
- known missing slug;
- percent-encoded separator attempts such as `%2F` and `%5C` where the platform permits the request;
- dot segments and repeated separators;
- trailing slash variants;
- invalid percent encoding where the client/platform permits it;
- a slug from another content class;
- Unicode normalization variants (for example NFC/NFD) and case variants when slugs support them.

Malformed input must not broaden lookup scope, expose a different record, produce a directory listing, or return `200` with an error page.

**Gate:** HTML and Markdown identities are one-to-one for eligible records; unknown and malformed identities fail closed.

### Phase 2 — Publication-boundary audit

Trace the exact code path used by both HTML and Markdown routes. Similar-looking lookups are not equivalent.

For blog records in this repository, inspect both:

- HTML generation through `getBlogPosts()`, which filters drafts in production;
- Markdown lookup through direct `getEntry('posts', slug)` and `createMarkdownResponse()`.

A direct lookup is not automatically protected by a collection-list filter. If the mirror can retrieve a draft that the production HTML route excludes, return `MIRROR_BLOCKED` and identify the route/helper gap. Do not “verify” safety from the schema merely because `draft` exists.

Apply the same reasoning to database-backed records. Prove the row has a publication/visibility rule matching the HTML route. `Row exists` is not equivalent to `row is public`.

Required negative fixtures:

- one draft/unpublished identifier;
- one nonexistent identifier;
- one malformed identifier;
- one valid record from a different collection or route family.

Expected production behavior is normally `404` or `410` according to repository policy, with no private title, frontmatter, body fragment, stack trace, record ID, or storage detail in the response.

**Gate:** every non-public fixture fails closed through the actual mirror code path.

### Phase 3 — Structured serialization

Use a maintained structured serializer such as the repository's current `gray-matter` seam. Do not reconstruct YAML like this:

```ts
// Unsafe example — do not copy
const frontmatter = `---\ntitle: ${entry.data.title}\n---`;
```

That pattern can change meaning when a value contains `:`, `#`, quotes, newlines, arrays, objects, dates, or YAML-like tokens.

Serialization contract:

- preserve required schema fields and their types;
- omit internal-only fields intentionally and document the omission;
- keep arrays as arrays and objects as objects;
- emit deterministic key order when snapshots or hashes depend on it;
- encode the complete response as UTF-8;
- never concatenate request input into frontmatter keys or executable syntax;
- reject or explicitly normalize values unsupported by the serializer;
- treat malformed JSON strings or wrong database value shapes as serialization drift: do not silently coerce them to empty arrays/objects unless the public contract explicitly defines that fallback and emits an omission record;
- compare database-backed fallback behavior with the HTML route: an empty `content_md` or malformed field must not silently produce a materially different Markdown representation;
- do not expose secrets, moderation notes, preview tokens, database internals, or unpublished metadata.

Round-trip test serialized frontmatter with the same parser family. Compare typed values, not visual formatting.

**Gate:** parsing the emitted frontmatter reproduces the approved public metadata without extra private fields or type drift.

### Phase 4 — Body fidelity and embedded-content safety

Choose and record one body policy:

- `preserve` — return stored Markdown/MDX bytes after normalized frontmatter reconstruction;
- `convert` — convert supported MDX constructs to plain Markdown with a named, tested transform;
- `block` — do not expose records containing unsupported constructs.

Do not silently strip content to make validation pass.

Test bodies containing:

- `---` thematic breaks and frontmatter-like delimiters;
- backticks and nested fenced code blocks;
- raw HTML;
- MDX imports, exports, expressions, or components;
- Markdown links and images with parentheses, spaces, fragments, and Unicode;
- HTML comments plus Markdown/MDX directives;
- null bytes or invalid control characters;
- a final line without a newline;
- Cyrillic and other non-ASCII text.

The endpoint serves inert text; it must not execute MDX, templates, scripts, or embedded HTML on the server. However, consumers may render Markdown unsafely. Preserve source fidelity while documenting that downstream renderers must sanitize HTML and URLs according to their own trust boundary.

Body integrity checks:

1. response begins with exactly one parseable frontmatter block when frontmatter is part of the contract;
2. frontmatter closes before body content;
3. expected title/body sentinel appears exactly as expected;
4. the response is not HTML, JSON, an error page, or a login/challenge page;
5. no truncation occurs at multibyte or fence boundaries;
6. the emitted body matches the declared preservation/conversion policy.

**Gate:** serialization is parseable and the body survives the declared fidelity checks without execution or silent loss.

### Phase 5 — Local verification

Run repository-defined checks first. At minimum when available:

```bash
npm run check
npm run build
```

Then exercise route functions or a local server with fixtures for:

- valid published record;
- missing record;
- malformed slug;
- draft/unpublished record;
- serialization edge case.

A successful static build proves only that the project built. It does not prove deployed route status, headers, redirects, database visibility, or response body.

**Gate:** repository checks pass and local fixture outcomes match the route, publication, serialization, and body contracts.

### Phase 6 — Deployed HTTP verification

After rollout, issue real HTTP requests to the deployed origin. Record request URL, status, redirect chain, final URL, headers, byte length, body fingerprint/sentinels, and timestamp.

Example shape:

```bash
curl --silent --show-error --location \
  --dump-header headers.txt \
  --output body.md \
  "https://example.com/blog/known-slug.md"
```

Do not rely only on `curl -I`; some platforms treat `HEAD` differently from `GET`. Use `GET`, and test without `--location` first when redirect behavior matters.

For each route family verify:

| Case | Required result |
|---|---|
| Published valid slug | `200`; expected final URL; Markdown media type; non-error body |
| Missing slug | `404` or approved `410`; no leaked record data |
| Malformed slug | fail closed; never unrelated `200` |
| Draft/unpublished slug | `404`/approved protected behavior; never public `200` |
| HTML counterpart | public and same logical identity |

For successful mirrors verify:

- `Content-Type` media type is `text/markdown`;
- charset is UTF-8, case-insensitively;
- body decodes as valid UTF-8;
- body is parseable according to the declared format;
- HTML error shells, WAF pages, authentication pages, and redirect targets are rejected;
- if `X-Robots-Tag: noindex` is repository policy, its deployed value is verified rather than assumed.

**Gate:** actual production/preview GET requests pass all positive and negative cases. Deployment status alone is insufficient.

## Failure response

Return:

```yaml
MIRROR_BLOCKED:
  route_family: string
  environment: string
  failures:
    - code: DRAFT_LEAK | UNKNOWN_200 | WRONG_CONTENT_TYPE | HTML_BODY | SERIALIZATION_DRIFT | BODY_LOSS | ROUTE_MISMATCH | REDIRECT_MISMATCH | PRIVATE_METADATA | VALIDATION_ERROR
      request_url: string | null
      record_id: string | null
      evidence: concise reproducible observation
      owner: route-owner | content-owner | deployment-owner
      required_action: string
  passed_checks: []
  unverified_checks: []
```

Never hide a failed negative test behind successful happy-path output.

## Ready report

`MIRROR_READY` includes:

- verified route inventory;
- publication eligibility rule per family;
- serialization and body policy;
- local commands and results;
- deployed request matrix with timestamps;
- status, redirect/final URL, `Content-Type`, body-integrity result, and omission notes;
- residual risks and owner decisions.

Do not claim improved training, ingestion, citation, rankings, or crawler adoption. The endpoint only provides an alternate representation that clients may choose to use.

## Specialist handoffs

- Route implementation or data access changes → route/backend owner.
- Publication policy decisions → content owner.
- Writing or editing source content → `blog-writing`.
- Listing mirrors in `llms.txt` → `llms-txt-standard` after reachability is verified.
- Publication sequencing and release approval → `content-pipeline`.
- Portfolio-wide crawl/index policy → `technical-seo` or `seo-mastery`.

## Evaluation expectations

The eval suite should cover at least:

1. duplicate overview consolidation and route-inventory accuracy;
2. a blog draft available through direct lookup but excluded from production HTML;
3. unknown and malformed slugs that must fail closed;
4. unsafe YAML scalar interpolation;
5. embedded Markdown/MDX and fence fidelity;
6. a `200 text/html` error page masquerading as success;
7. redirect/final-URL mismatch;
8. build success without deployed HTTP evidence;
9. a proposed route pattern that does not exist;
10. a database row whose public status is unknown.
