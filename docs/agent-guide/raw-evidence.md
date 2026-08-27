# Raw evidence capture and provenance contract

This document defines the project-local `raw-v1` contract for source captures stored
under `kb/raw/`. It is intentionally separate from the canonical OKF/wiki contract
and from the project-local lesson contract.

## Purpose and boundaries

A raw capture preserves the smallest useful, sanitized representation of a public
source so that a later canonical page can be audited. It is evidence, not a
recommendation. A search result, transcript, or community report must not become a
canonical conclusion merely because it was captured or indexed.

The supported path is:

```text
public source -> raw capture -> optional cleaned derivative -> reviewed canonical page
```

- **Raw capture** is immutable after publication. A changed source is a new capture;
  never silently overwrite an existing capture.
- **Cleaned derivative** may normalize HTML, VTT, JSON, or line wrapping, but must
  identify its raw parent and transformation. It never replaces the raw capture.
- **Canonical knowledge** is written outside `kb/raw/` and contains reviewed claims
  with precise evidence references.

QMD indexes raw and canonical material through separate collections. Raw captures
remain searchable, but raw search is an explicit research operation, not a trust
signal.

## `raw-v1` envelope

Every new capture must contain this YAML frontmatter. Unknown values must be
`null` or `unknown`; do not guess. Dates and timestamps use UTC ISO-8601.

```yaml
---
raw_schema: raw-v1
capture_id: RAW-YYYYMMDD-source-stable-id-short-hash
status: raw_capture
source_type: web | reddit | youtube | github
source_url: "https://public.example/path" # public, token-free, canonical URL
source_title: "Observed public title"
author: null
organization: null
published_at: null
updated_at: null
captured_at: "2026-08-27T00:00:00Z"
source_version: null # release, ref, commit, video etag, or source item ID
retrieval:
  method: browser | http | api | repository-read | yt-dlp
  tool: "tool name"
  tool_version: "tool version or unknown"
  http_status: null
  media_type: "text/markdown"
  language: unknown
content:
  representation: markdown | html | json | vtt | srt | text
  sha256: "sha256 of the exact stored representation"
  byte_count: 0
  excerpted: true
  transform: null
provenance:
  captured_by: "public team or agent label"
  derived_from: null
quality:
  source_quality: high | medium | low | unknown
  claim_status: confirmed | corroborated | reported | hypothesis | unknown
  limitations: []
rights:
  license: unknown
  retention_note: "Smallest necessary excerpt or snapshot"
tags: []
---
```

### Required-field rules

- `capture_id` is stable and unique for the stored capture. It must not contain a
  session ID, machine path, credential, or other transient runtime value.
- `source_url` must be public and free of credentials, cookies, access tokens,
  signed query parameters, and unnecessary tracking parameters. Keep a separate
  stable source identifier in the channel block when the URL is mutable.
- `captured_at` records retrieval time. It is distinct from `published_at` and
  `updated_at`, which describe the source.
- `source_version` records the version/ref/ID used for the claim. For a GitHub code
  claim, prefer a full commit SHA; a branch or tag is only a discovery pointer.
- `retrieval.tool` and `retrieval.tool_version` record how the representation was
  obtained. If unavailable, use `unknown` rather than omitting provenance.
- `content.sha256` is the hash of the exact stored representation named by
  `content.representation`; `byte_count` is its UTF-8 byte count. Do not hash a
  cleaned derivative and label it as the raw payload. If the representation is
  stored separately, keep the hash/size in a sanitized sidecar and reference it.
- `quality.claim_status` describes the captured claim, not the QMD score. A single
  Reddit or YouTube report normally remains `reported`; absence of confirmation is
  not `rejected`.
- `quality.limitations` must state missing context, dynamic rendering, edits,
  deletion, automatic transcription, truncation, unavailable version data, or
  other material limits.
- `rights.license` and `retention_note` must not imply permission that was not
  verified. Store only the smallest necessary excerpt or representation.

## Channel-specific minimums

The common envelope is mandatory for all channels. Add one channel block with the
stable identity and locator needed to reproduce the evidence.

### Web page or API response

```yaml
web:
  canonical_url: "https://docs.example/public/page"
  publisher: "Observed publisher"
  locator: "Heading > subsection or JSON path"
  response_validators:
    etag: null
    last_modified: null
```

For dynamic pages, record whether the capture is an HTTP representation or a
browser-rendered representation. Do not describe uncaptured dynamic content as
present. A page heading or a line range in the stored representation is the
preferred locator.

### Reddit post or comment

```yaml
reddit:
  subreddit: "r/example"
  post_id: "t3_public_id"
  comment_id: null # t1_public_id for a comment
  parent_id: null
  link_id: "t3_public_id"
  permalink: "https://www.reddit.com/r/example/comments/public_id/title/"
  edited_at_capture: false
  score_at_capture: null
  locator: "post body | comment t1_public_id"
```

Record the observed author as a public username, `[deleted]`, or `unknown`. Preserve
post/comment relationships. Community material is attributed practical evidence;
it is not independently verified merely because several comments repeat it.

### YouTube video transcript or notes

```yaml
youtube:
  video_id: "public_video_id"
  channel_id: "public_channel_id"
  channel_title: "Observed channel title"
  duration_seconds: null
  transcript_language: "en"
  transcript_kind: manual | auto_generated | unknown
  captions_track: "en/original"
  locator: "00:12:34-00:13:10"
```

Keep transcript timestamps when available. Record manual versus automatic captions,
language, speaker-attribution limits, and the extractor/tool version. A transcript
is context/discovery evidence until important claims are independently verified.
Do not download media when subtitles or bounded notes are sufficient.

### GitHub repository, commit, issue, pull request, or release

```yaml
github:
  repository: "owner/repository"
  object_type: blob | commit | issue | pull_request | release
  ref: "main" # discovery pointer only
  commit_sha: "full resolved commit SHA when applicable"
  path: "path/to/file"
  blob_sha: null
  issue_or_pr: null
  comment_id: null
  locator: "path/to/file#L20-L48@full_commit_sha"
```

For code and configuration claims, capture the repository, path, and full resolved
commit SHA. For an issue or pull request, include its public number/comment ID and
capture-time state. For a release, include its public tag/release identity. Do not
use a mutable branch URL as the only version anchor.

## Provenance and evidence references

A canonical claim or cleaned derivative must point to a capture ID and a precise
location. Recommended reference shape:

```yaml
evidence_ref:
  evidence_id: RAW-20260827-example-a1b2c3
  source_type: web | reddit | youtube | github
  url: "https://public.example/path"
  captured_at: "2026-08-27T00:00:00Z"
  source_version: "version, item ID, or full commit SHA"
  locator:
    kind: heading | line_range | timestamp | reddit_post | reddit_comment | github_path | json_path
    value: "Configuration > SSR"
  quote_digest: null
  notes: "Scope, freshness, and limitations"
```

Use `line_range` against a named stored capture, `timestamp` for a transcript,
Reddit post/comment IDs for community material, `github_path` with a full SHA for
repository content, and `json_path` for structured responses. A generic link to
`kb/raw/` without an ID, version, and locator is not sufficient.

Use provenance relationships consistently:

```text
cleaned record  --derived_from-->  raw capture
canonical claim --supported_by--> raw capture or cleaned record
verification    --used-->         raw capture and test inputs
```

## Safety, minimal copying, and publication gate

Before committing a raw capture, a reviewer or deterministic check must confirm:

- [ ] The source is public and the URL contains no credentials, cookies, tokens,
      signatures, private hostnames, or sensitive query values.
- [ ] No secrets, PII, private payloads, prompts, runtime/session state, local
      filesystem paths, or internal network details are present.
- [ ] The capture contains the smallest necessary excerpt or snapshot; it is not a
      wholesale copy of a page, transcript, comments thread, or repository.
- [ ] `raw_schema: raw-v1`, `capture_id`, `source_type`, public URL, `captured_at`,
      version/context, retrieval metadata, representation, SHA-256, byte count,
      provenance, quality, limitations, and tags are present.
- [ ] The hash and byte count describe the exact stored representation and are
      reproducible without including frontmatter recursively.
- [ ] Channel-specific stable identity and locator are present; unknown fields are
      explicitly marked rather than invented.
- [ ] Reported/opinion/hypothesis claims are not phrased as confirmed guidance.
- [ ] The raw file is new or intentionally versioned; no existing capture was
      silently overwritten.
- [ ] Any cleaned derivative identifies its raw parent, transform/tool version, and
      material losses.
- [ ] The intended canonical destination is outside `kb/raw/`; canonical pages link
      back using evidence IDs and precise locators.
- [ ] `kb-bootstrap validate --dir kb --project-root .` passes. This validates KB
      links and collection configuration, but does not replace raw provenance review.
- [ ] After an authorized content/config change, run `qmd update` and smoke-test
      the relevant raw/wiki collections. Do not claim QMD rollout when these
      commands were not run.

## Sanitized template records

The following are templates, not captures. Replace every placeholder and calculate
hash/size before publication. They intentionally contain no copied external text.

### Web

```markdown
---
raw_schema: raw-v1
capture_id: RAW-YYYYMMDD-web-<stable-id>-<hash>
status: raw_capture
source_type: web
source_url: "https://public.example/docs/page"
source_title: "Public page title"
author: null
organization: "Publisher"
published_at: null
updated_at: null
captured_at: "YYYY-MM-DDTHH:MM:SSZ"
source_version: null
retrieval: {method: http, tool: "tool", tool_version: "X.Y", http_status: 200, media_type: text/html, language: unknown}
content: {representation: markdown, sha256: "<compute exact stored representation hash>", byte_count: 0, excerpted: true, transform: "html-to-markdown@X.Y"}
provenance: {captured_by: "agent-or-team", derived_from: null}
quality: {source_quality: high, claim_status: unknown, limitations: []}
rights: {license: unknown, retention_note: "Minimal excerpt"}
tags: [official, web]
web: {canonical_url: "https://public.example/docs/page", publisher: "Publisher", locator: "Heading > subsection", response_validators: {etag: null, last_modified: null}}
---

# Public page title

Minimal relevant excerpt or a short capture note.
```

### Reddit

```markdown
---
raw_schema: raw-v1
capture_id: RAW-YYYYMMDD-reddit-<post-or-comment-id>-<hash>
status: raw_capture
source_type: reddit
source_url: "https://www.reddit.com/r/example/comments/<post-id>/title/"
source_title: "Public post title"
author: "public-user | [deleted] | unknown"
organization: null
published_at: null
updated_at: null
captured_at: "YYYY-MM-DDTHH:MM:SSZ"
source_version: "t3_<post-id> or t1_<comment-id>"
retrieval: {method: api, tool: "reddit client", tool_version: "X.Y", http_status: 200, media_type: application/json, language: unknown}
content: {representation: markdown, sha256: "<compute exact stored representation hash>", byte_count: 0, excerpted: true, transform: "api-json-to-markdown@X.Y"}
provenance: {captured_by: "agent-or-team", derived_from: null}
quality: {source_quality: medium, claim_status: reported, limitations: [community_report_not_independently_verified]}
rights: {license: unknown, retention_note: "Minimal relevant excerpt"}
tags: [community, reddit]
reddit: {subreddit: "r/example", post_id: "t3_<post-id>", comment_id: null, parent_id: null, link_id: "t3_<post-id>", permalink: "https://www.reddit.com/r/example/comments/<post-id>/title/", edited_at_capture: false, score_at_capture: null, locator: "post body"}
---

# Public post title

Minimal attributed excerpt or a short capture note.
```

### YouTube

```markdown
---
raw_schema: raw-v1
capture_id: RAW-YYYYMMDD-youtube-<video-id>-<hash>
status: raw_capture
source_type: youtube
source_url: "https://www.youtube.com/watch?v=<video-id>"
source_title: "Public video title"
author: "Channel title"
organization: null
published_at: null
updated_at: null
captured_at: "YYYY-MM-DDTHH:MM:SSZ"
source_version: "video_id=<video-id>; etag=<if publicly available>"
retrieval: {method: yt-dlp, tool: yt-dlp, tool_version: "X.Y", http_status: null, media_type: text/vtt, language: unknown}
content: {representation: vtt, sha256: "<compute exact stored representation hash>", byte_count: 0, excerpted: true, transform: null}
provenance: {captured_by: "agent-or-team", derived_from: null}
quality: {source_quality: medium, claim_status: reported, limitations: [transcript_kind_or_speaker_attribution_unknown]}
rights: {license: unknown, retention_note: "Transcript excerpt only"}
tags: [video, transcript, youtube]
youtube: {video_id: "<video-id>", channel_id: null, channel_title: "Channel title", duration_seconds: null, transcript_language: unknown, transcript_kind: unknown, captions_track: unknown, locator: "00:00:00-00:00:00"}
---

# Public video title

Minimal transcript excerpt or a short capture note.
```

### GitHub

```markdown
---
raw_schema: raw-v1
capture_id: RAW-YYYYMMDD-github-<owner-repo>-<commit-sha>-<hash>
status: raw_capture
source_type: github
source_url: "https://github.com/owner/repository/blob/<full-commit-sha>/path/to/file"
source_title: "path/to/file"
author: null
organization: "owner"
published_at: null
updated_at: null
captured_at: "YYYY-MM-DDTHH:MM:SSZ"
source_version: "<full-commit-sha>"
retrieval: {method: api, tool: "GitHub API", tool_version: "X.Y", http_status: 200, media_type: text/plain, language: unknown}
content: {representation: markdown, sha256: "<compute exact stored representation hash>", byte_count: 0, excerpted: true, transform: null}
provenance: {captured_by: "agent-or-team", derived_from: null}
quality: {source_quality: high, claim_status: confirmed, limitations: []}
rights: {license: unknown, retention_note: "Relevant excerpt only"}
tags: [github, primary]
github: {repository: "owner/repository", object_type: blob, ref: "main", commit_sha: "<full-commit-sha>", path: "path/to/file", blob_sha: null, issue_or_pr: null, comment_id: null, locator: "path/to/file#L1-L20@<full-commit-sha>"}
---

# path/to/file

Minimal relevant excerpt or a short capture note.
```

## Relationship to other contracts

- This document owns new raw capture metadata only.
- `kb-bootstrap` canonical/wiki pages keep their existing OKF frontmatter and live
  outside `kb/raw/`.
- Project lessons keep their existing `PROJECT-XXXX` frontmatter, `SCHEMA.md`, and
  `index.yaml`; do not use lesson IDs for raw captures.
- Raw capture does not allocate lesson IDs, update lesson stores, promote lessons,
  or publish canonical conclusions.
