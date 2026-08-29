---
raw_schema: raw-v1
capture_id: RAW-20260829-reddit-oxwsmop-41e7dd
status: raw_capture
source_type: reddit
source_url: "https://www.reddit.com/r/astrojs/comments/1uy5e6f/best_headless_cms/"
source_title: "Comment on Best headless CMS?"
author: "GlitzyChomsky"
organization: null
published_at: null
updated_at: null
captured_at: "2026-08-29T00:56:38Z"
source_version: "t1_oxwsmop"
retrieval:
  method: browser
  tool: "Surf CLI"
  tool_version: "2.13.0"
  http_status: 200
  media_type: "text/html"
  language: en
content:
  representation: markdown
  sha256: "e30e428dbeaa285ff16da6b366c5da2ff8ec2c359a00d5b0fe0b0b2b8d7f211f"
  byte_count: 535
  excerpted: true
  transform: "sanitized bounded browser excerpt; SML loader noise removed"
provenance:
  captured_by: "site-bootstrap research"
  derived_from: null
quality:
  source_quality: medium
  claim_status: reported
  limitations:
    - "Community comment; reported production use and feature behavior are not independently verified."
    - "Comment was observed with readable text and a stable comment permalink in the owned browser window."
rights:
  license: unknown
  retention_note: "Minimal relevant excerpt only"
tags: [community, reddit, astro, cms, pagescms, netlify]
reddit:
  subreddit: "r/astrojs"
  post_id: "t3_1uy5e6f"
  comment_id: "t1_oxwsmop"
  parent_id: "t3_1uy5e6f"
  link_id: "t3_1uy5e6f"
  permalink: "https://www.reddit.com/r/astrojs/comments/1uy5e6f/best_headless_cms/"
  edited_at_capture: false
  score_at_capture: null
  locator: "comment t1_oxwsmop; readable thread article e16"
---

# Comment on “Best headless CMS?”

**GlitzyChomsky:** Reports using PagesCMS for several months on a couple of Astro static sites hosted on Netlify. The commenter says the app connects directly to a GitHub repository, stores content as Markdown, pushes CMS changes to the repository, and reflects local repository changes in the CMS. They report no live editor; saving pushes to the repository and triggers a rebuild. They also report reusable components, one repository connection per website, and open-source/free availability.
