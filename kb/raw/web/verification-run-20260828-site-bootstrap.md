---
raw_schema: raw-v1
capture_id: RAW-20260828-web-verification-run-site-bootstrap-8a1d30b
status: raw_capture
source_type: web
source_url: "https://github.com/ozand/site-bootstrap"
source_title: "Verification run metadata contract example"
author: null
organization: "ozand/site-bootstrap"
published_at: null
updated_at: null
captured_at: "2026-08-28T22:50:00Z"
source_version: "template commit ed7b1a7e4e597891471396d6bd8569946f0aefb0"
retrieval:
  method: repository-read
  tool: "git/node/npm"
  tool_version: "recorded in run metadata"
  http_status: null
  media_type: text/markdown
  language: en
content:
  representation: markdown
  sha256: "be1cffa06fc9734aeeeaa8d5d1cbfa9bf6e3710f556419f98fa9be71dcca7a86"
  byte_count: 879
  excerpted: true
  transform: "sanitized metadata-only verification record"
provenance:
  captured_by: "site-bootstrap maintainer"
  derived_from: null
quality:
  source_quality: high
  claim_status: confirmed
  limitations:
    - "Example records metadata only; it does not reproduce a generated-site run."
rights:
  license: unknown
  retention_note: "Metadata contract example; no lockfile contents or environment dump."
tags: [verification, provenance, baseline, metadata]
web:
  canonical_url: "https://github.com/ozand/site-bootstrap"
  publisher: "ozand/site-bootstrap"
  locator: "Verification run metadata contract example"
  response_validators:
    etag: null
    last_modified: null

verification_run:
  run_id: "RUN-20260828-site-bootstrap-example-001"
  template_commit_sha: "ed7b1a7e4e597891471396d6bd8569946f0aefb0"
  input_manifest:
    hash_algorithm: "sha256"
    files:
      - path: "templates/base-astro/package.json"
        sha256: "61a56c30d1b05da251a6f8a8cc6dd98315544806dd873b485059f3de39a85532"
        byte_count: 1155
      - path: "templates/base-astro/package-lock.json"
        sha256: "5139cb79971bc32510aeb7362a6c30bc663dc1d10003876d3792f302a2cdbfe2"
        byte_count: 493981
    combined_sha256: "6e64b04541593bf595108d7fc7f077d77239cc8bbd210a956ac0089a1c478d63"
  runtime:
    node: "22.x"
    npm: "10.x"
    python: null
  result: "example-only; not executed"
  limitations:
    - "This record demonstrates metadata shape; it is not a generated-site verification result."
---

# Verification run metadata contract example

This versioned example defines the minimum identity needed to correlate a verification result with its inputs without storing a lockfile or environment dump.

- `run.run_id` is unique for one verification run and must not contain credentials, paths, or transient session IDs.
- `run.template_commit_sha` pins the template source used by the run.
- `run.input_manifest` records the exact package-input files and a deterministic SHA-256 manifest hash.
- `run.runtime` records relevant tool versions only; it excludes environment dumps and secrets.
- `run.result` and `run.limitations` distinguish an example contract from an executed verification.

A real capture must replace the example values with metadata computed from the actual inputs, preserve the old capture unchanged, and create a new versioned capture when inputs change.
