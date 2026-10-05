# Research Lesson: surf page.text 50k Truncation and DOM Export Fallback

- **Date:** 2026-10-05
- **Tool:** Surf CLI (v2.8.0)
- **Component:** Browser extension content script and CLI text extraction

## Symptom
`surf page.text` on long normative documents (such as W3C WCAG 2.2 Recommendation, 140k+ chars) silently truncates text at exactly 50,000 characters (~50,098 bytes), cutting off mid-sentence (e.g. at `Success Criterion 2.4.11 Focus Not Obs...`) with zero error or warning.

## Root Cause Analysis
1. In `surf-cli/dist/content/index.js` (line 115), the text extraction function `ze(e={})` handling `GET_PAGE_TEXT` contains:
   `r.substring(0, 5e4)` (50,000 characters hardcoded cap).
2. In `surf-cli/native/cli.cjs`, the `page.text` command is defined with `args: []` without `--max-bytes` or pagination flags, preventing any override of this limit from CLI.
3. In `surf-cli/dist/service-worker/index.js` (line 133), `EXECUTE_JAVASCRIPT` similarly caps output to `5e4` characters.
4. `surf page.save` without `--selector` fails with `Error: Value is unserializable` because `a.selector` is passed as `undefined` into Chrome's `scripting.executeScript({ args: [undefined, false] })`.

## Solution / Fallback Protocol
- **Reliable Full DOM Export:** Use `surf page.save --selector "html" --output <path>.html`.
  Supplying `--selector "html"` provides a valid string, avoids the Chrome API serialization bug, and streams the full rendered DOM directly to disk via Node.js `fs.writeFileSync` with zero length cap (e.g., WCAG 2.2 exports 512,791 bytes).
- **Structured Markdown Conversion:** Process the full exported HTML via a clean BeautifulSoup parser (`convert_wcag.py`) into structured Markdown, explicitly classifying the output as a *derived conversion* (Tier 3) rather than raw unedited capture (Tier 1/2), and document any loss of attributes/links.
- **Rule:** Never attempt global or destructive package patching on shared CLI installations. Use the non-invasive DOM export and documented conversion script fallback.
