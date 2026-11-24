# Markdoc rendering does not prove Keystatic save preserves formatting

**Date:** 2026-11-24 · **Area:** content editing / migration

## Symptom

A styled paragraph rendered correctly from Markdoc, but its class annotation was lost after saving in the installed Keystatic editor.

## Cause

The renderer accepted an annotation that this editor configuration did not preserve when writing the document back. Build success checked only the rendering side of the workflow.

## Fix

The archive project's serializer probe reported preserving the formatting with a typed wrapper. That result does not establish browser save/reopen behavior or production wiring. Treat the wrapper as a site-specific option, not a default for generated sites.

## Verification and prevention

1. In a disposable local copy, build one representative article. Record its URL and the HTML properties that must survive (for example, classes or anchor IDs).
2. Open and save it in the editor without intentionally changing its body. Compare the saved Markdoc, rebuild, and verify the same HTML properties. A successful initial build does not replace this check.
3. If editors can rename titles, change only the title and rebuild. Check that the visible title changes but the explicit slug and the published URL do not. Do not derive a replacement slug from the new title.

Source: [kseniadenisova #11](https://github.com/ozand/kseniadenisova/issues/11). The editor behavior and fix are reported by the archive project, not independently reproduced in site-bootstrap. This check is for content preservation, not authentication or deployment.
